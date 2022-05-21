import json
from django.shortcuts import get_object_or_404
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils.timezone import now
from django.conf import settings
from typing import Generator
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer, AsyncAPIConsumer
from djangochannelsrestframework.observer.generics import (ObserverModelInstanceMixin, action)
from djangochannelsrestframework.observer import model_observer

from base.user.models import CustomUser
from base.user.serializers import CustomUserSerializer
from .models import Answer, Question, Room, SentAnswer
from .serializers import RoomSerializer


class RoomConsumer(ObserverModelInstanceMixin, GenericAsyncAPIConsumer):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    lookup_field = "pk"
    current_question = None
    async def disconnect(self, code):
        if hasattr(self, "room_subscribe"):
            await self.remove_user_from_room(self.room_subscribe, self.user_id)
            await self.notify_users()
        await super().disconnect(code)



    @action()
    async def join_room(self, pk, user_id, is_host, **kwargs):
        self.room_subscribe = pk
        self.user_id = user_id
        self.is_host = is_host

        await self.add_user_to_room(pk, user_id)
        await self.notify_users()

    @action()
    async def change_current_question(self, room_pk, question_pk, **kwargs):
        if await self.get_number_of_questions_for_room(room_pk)>question_pk:
            await self.set_current_question(room_pk, question_pk)
            await self.notify_changed_current_question()

    @action()
    async def leave_room(self, pk, **kwargs):
        await self.remove_user_from_room(pk)

    # @action()
    # async def create_message(self, message, **kwargs):
    #     room: Room = await self.get_room(pk=self.room_subscribe)
    #     await database_sync_to_async(Message.objects.create)(
    #         room=room,
    #         user=self.scope["user"],
    #         text=message
    #     )

    @action()
    async def subscribe_to_answers_in_room(self, pk, request_id, **kwargs):
        await self.sent_answer_activity.subscribe(room=pk, request_id=request_id)

    @model_observer(SentAnswer)
    async def sent_answer_activity(
        self,
        sent_answer,
        observer=None,
        subscribing_request_ids = [],
        **kwargs
    ):
        """
        This is evaluated once for each subscribed consumer.
        The result of `@message_activity.serializer` is provided here as the message.
        """
        # since we provide the request_id when subscribing we can just loop over them here.
        for request_id in subscribing_request_ids:
            message_body = dict(request_id=request_id)
            message_body.update(sent_answer)
            await self.send_json(message_body)

    @sent_answer_activity.groups_for_signal
    def sent_answer_activity(self, instance: SentAnswer, **kwargs):
        yield f'room__{instance.room_id}'
        yield f'pk__{instance.pk}'

    @sent_answer_activity.groups_for_consumer
    def sent_answer_activity(self, room=None, **kwargs):
        if room is not None:
            yield f'room__{room}'

    @sent_answer_activity.serializer
    def sent_answer_activity(self, instance:SentAnswer, action, **kwargs):
        """
        This is evaluated before the update is sent
        out to all the subscribing consumers.
        """
        return dict(data=SentAnswer(instance).data, action=action.value, pk=instance.pk)

    async def notify_users(self):
        print("notify_users_a")
        room: Room = await self.get_room(self.room_subscribe)
        for group in self.groups:
            await self.channel_layer.group_send(
                group,
                {
                    'type':'update_users',
                    'users':await self.current_users(room)
                }
            )

    async def notify_changed_current_question(self):
        room: Room = await self.get_room(self.room_subscribe)
        for group in self.groups:
            await self.channel_layer.group_send(
                group,
                {
                    'type':'update_current_question',
                    'current_question':await self.current_question(room)
                }
            )
    async def update_current_question(self, event: dict):
        print("notify_users_cq")
        await self.send(text_data=json.dumps({'data': {'action': 'update_current_question', 'current_question': event["current_question"]}}))

    async def update_users(self, event: dict):
        print("notify_users_b")
        await self.send(text_data=json.dumps({'data': {'action': 'update_users', 'users': event["users"]}}))


    
    @database_sync_to_async
    def set_current_question(self, room_pk, question_pk):
        room:Room = Room.objects.get(id=room_pk)
        room.current_question = question_pk
        room.save()

    @database_sync_to_async
    def current_question(self, room: Room):
        return room.current_question


    @database_sync_to_async
    def get_number_of_questions_for_room(self, pk: int) -> int:
        return len(Question.objects.filter(room=pk))

    @database_sync_to_async
    def get_room(self, pk: int) -> Room:
        return Room.objects.get(pk=pk)

    @database_sync_to_async
    def current_users(self, room: Room):
        return [CustomUserSerializer(user).data for user in room.current_users.all()]


    @database_sync_to_async
    def remove_user_from_room(self, room, user_id):
        user:CustomUser = CustomUser.objects.get(id=user_id)
        user.current_rooms.remove(room)
        user.save()

    @database_sync_to_async
    def add_user_to_room(self, pk, user_id):
        user:CustomUser = CustomUser.objects.get(id=user_id)
        if not user.current_rooms.filter(pk=self.room_subscribe).exists():
            user.current_rooms.add(Room.objects.get(pk=pk))
            user.save()