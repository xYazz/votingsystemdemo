from email import message
import json
from asgiref.sync import sync_to_async
from django.shortcuts import get_object_or_404
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils.timezone import now
from django.conf import settings
from typing import Generator
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer, AsyncAPIConsumer
from djangochannelsrestframework.observer.generics import (
    ObserverModelInstanceMixin, action)
from djangochannelsrestframework.observer import model_observer

from base.user.models import CustomUser
from base.user.serializers import CustomUserSerializer
from .models import Answer, Question, Room, SentAnswer
from .serializers import AnswerSerializer, RoomSerializer, SentAnswerSerializer


class RoomConsumer(ObserverModelInstanceMixin, GenericAsyncAPIConsumer):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    lookup_field = "pk"
    current_question = None

    async def disconnect(self, code):
        if hasattr(self, "room_subscribe"):
            await self.remove_user_from_room(self.room_subscribe, self.user_id)
            await self.notify_users('update_users', self.current_users)
        await super().disconnect(code)

    @action()
    async def join_room(self, pk, user_id, is_host, **kwargs):
        self.room_subscribe = pk
        self.user_id = user_id
        self.is_host = is_host

        await self.add_user_to_room(pk, user_id)
        await self.notify_users('update_users', self.current_users)

    @action()
    async def change_current_question(self, room_pk, question_pk, **kwargs):
        if await self.get_number_of_questions_for_room(room_pk) > question_pk:
            await self.set_current_question(room_pk, question_pk)
            await self.notify_users('update_current_question', self.current_question)

    @action()
    async def leave_room(self, pk, **kwargs):
        await self.remove_user_from_room(pk)

    @action()
    async def create_sent_answer(self, user_id, answer_pk, question_pk, ** kwargs):
        user = await self.get_user(user_id)
        answer = await self.get_answer(answer_pk)
        question = await self.get_question(question_pk)
        await database_sync_to_async(SentAnswer.objects.create)(
            user=user,
            answer=answer,
            question=question
        )
        await self.add_one_vote_to_answer(answer_pk)
        await self.notify_users('update_answer', self.get_sent_answer, answer_pk=answer_pk)

    async def notify_users(self, action, function_returning_data, **kwargs):

        if not kwargs:
            room: Room = await self.get_room(self.room_subscribe)
            content_data = await function_returning_data(room)
        else:
            content_data = await function_returning_data(**kwargs)

        for group in self.groups:
            await self.channel_layer.group_send(
                group,
                {
                    'type': 'update_data',
                    'action': action,
                    'content': content_data
                }
            )

    async def update_data(self, event: dict):
        await self.send(text_data=json.dumps({'action': event["action"], 'content': event["content"]}))

    @database_sync_to_async
    def get_user(self, user_pk):
        return CustomUser.objects.get(id=user_pk)

    @database_sync_to_async
    def get_answer(self, answer_pk):
        return Answer.objects.get(id=answer_pk)

    @database_sync_to_async
    def get_question(self, question_pk):
        return Question.objects.get(id=question_pk)

    @database_sync_to_async
    def set_current_question(self, room_pk, question_pk):
        room: Room = Room.objects.get(id=room_pk)
        room.current_question = question_pk
        room.save()

    @database_sync_to_async
    def current_question(self, room: Room):
        return room.current_question

    @database_sync_to_async
    def get_sent_answer(self, **kwargs):
        answer_pk = kwargs['answer_pk']
        return AnswerSerializer(Answer.objects.get(id=answer_pk)).data

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
    def add_one_vote_to_answer(self, answer_pk):
        answer = Answer.objects.get(id=answer_pk)
        answer.times_voted += 1
        answer.save()

    @database_sync_to_async
    def remove_user_from_room(self, room, user_id):
        user: CustomUser = CustomUser.objects.get(id=user_id)
        user.current_rooms.remove(room)
        user.save()

    @database_sync_to_async
    def add_user_to_room(self, pk, user_id):
        user: CustomUser = CustomUser.objects.get(id=user_id)
        if not user.current_rooms.filter(pk=pk).exists():
            user.current_rooms.add(Room.objects.get(pk=pk))
            user.save()
