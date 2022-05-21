from django.shortcuts import render, reverse, get_object_or_404
from base.user.models import CustomUser
from base.user.serializers import CustomUserSerializer
from sitting.serializers import AnswerSerializer, QuestionSerializer, RoomSerializer
from rest_framework.response import Response
from .models import Answer, Question, Room
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import mixins
from rest_framework.decorators import api_view
from rest_framework.generics import GenericAPIView
from django.core.exceptions import ObjectDoesNotExist
from base.views import get_user


class RoomList(APIView):
    serializer_class = RoomSerializer
    queryset = Room.objects.all()

    def get(self, request):
        owner = get_user(request)
        room_list = self.queryset.filter(host=owner)
        return Response({"room_list": self.serializer_class(room_list, many=True).data}, status=status.HTTP_200_OK)

@api_view(('GET',))
def ListActiveSittings(request):
    user = get_user(request)
    rooms = Room.objects.filter(id__in=user.allowed_rooms.all(), status=2)
    return Response({"room_list": RoomSerializer(rooms, many=True).data}, status=status.HTTP_200_OK)


class RoomView(APIView):
    serializer_class = RoomSerializer
    queryset = Room.objects.all()

    def post(self, request, format=None):
        owner = get_user(request)
        name = request.data.get("name", None)
        if name:
            room = Room.objects.create(name=name, host=owner)
            return Response({"room": RoomSerializer(room).data},
                            status=status.HTTP_201_CREATED)

    def get(self, request, pk):
        room: Room = get_object_or_404(
            Room, pk=request.resolver_match.kwargs["pk"])

        return Response({"room": RoomSerializer(room).data},
                        status=status.HTTP_200_OK)

    def delete(self, request, pk):
            room = Room.objects.get(id=pk)
            user = get_user(request)
            if room.host == user:
                room.delete()
                room_list = self.queryset.filter(host=user)
                return Response({"room_list": RoomSerializer(room_list, many=True).data},
                                status=status.HTTP_200_OK)
            return Response({"Błąd": "Brak uprawnień."},
                status=status.HTTP_403_FORBIDDEN)

    
    def patch(self, request, pk):
            room = Room.objects.get(id=pk)
            user = get_user(request)
            if room.host == user:
                room.status=2
                room.save()
                return Response({"room": RoomSerializer(room).data},
                                status=status.HTTP_200_OK)
            return Response({"Błąd": "Brak uprawnień."},
                status=status.HTTP_403_FORBIDDEN)

class AllowedUsersInRoom(APIView):
    serializer_class = RoomSerializer
    queryset = Room.objects.all()

    def post(self, request, format=None):
        owner = get_user(request)
        room_pk = request.data.get("room_pk", None)
        user = CustomUser.objects.get(id=request.data.get("user_id"))

        room = Room.objects.get(id=room_pk, host=owner)
        room.allowed_users.add(user)
        return Response({"room": RoomSerializer(room).data},
                        status=status.HTTP_202_ACCEPTED)

    def get(self, request):
        users = CustomUser.objects.all()

        return Response({"users": CustomUserSerializer(users, many=True).data},
                        status=status.HTTP_200_OK)

    def patch(self, request, format=None):
        owner = get_user(request)
        room = request.data.get("room", None)
        user = request.data.get("user", None)

        room = Room.objects.get(id=room)
        user = CustomUser.objects.get(id=user)

        if not room.host == owner:
            return Response({"Błąd": "Brak uprawnień do obiektu."},
                            status=status.HTTP_401_UNAUTHORIZED)
        if user:
            room.allowed_users.remove(user)
            return Response({"room": RoomSerializer(room).data},
                            status=status.HTTP_202_ACCEPTED)


class QuestionView(GenericAPIView):
    serializer_class = QuestionSerializer

    def post(self, request, format=None):
        owner = get_user(request)
        room = request.data.get("room", None)
        question = request.data.get("question", None)
        if room and question:
            room = Room.objects.get(id=room)
            if not room.host == owner:
                return Response({"Błąd": "Brak uprawnień do obiektu."},
                                status=status.HTTP_401_UNAUTHORIZED)
            new_question = Question.objects.create(
                room=room, question=question)
            return Response({"question": self.serializer_class(new_question).data},
                            status=status.HTTP_201_CREATED)
        return Response({"Błąd": "Nieprawidłowe dane."}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        room = request.data.get("room", None)
        try:
            question: Question = Question.objects.get(room_id=room)
            return Response({"room_questions": self.serializer_class(question, many=True).data},
                            status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({"room_questions": None},
                            status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, pk):
            question = Question.objects.get(id=pk)
            user = get_user(request)
            if question.room.host == user:
                room=question.room
                question.delete()
                return Response({"room": RoomSerializer(room).data},
                                status=status.HTTP_200_OK)
            return Response({"Błąd": "Brak uprawnień."},
                status=status.HTTP_403_FORBIDDEN)

class AnswerView(GenericAPIView):
    serializer_class = AnswerSerializer

    def post(self, request, format=None):
        owner = get_user(request)
        question = request.data.get("question", None)
        answer = request.data.get("answer", None)
        if not (answer and question):
            return Response({"Błąd": "Nieprawidłowe dane."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            question = Question.objects.get(id=question)

            new_answer = Answer.objects.create(
                question=question, answer=answer)
            return Response({"answer": self.serializer_class(new_answer).data},
                            status=status.HTTP_201_CREATED)
        except ObjectDoesNotExist:
            return Response({"Błąd": "Nie znaleziono pytania o podanym id."},
                            status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        question = request.data.get("question", None)
        try:
            answers: Answer = Answer.objects.get(question_id=question)
            return Response({"room_questions": AnswerSerializer(answers, many=True).data},
                            status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({"room_questions": None},
                            status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, pk):
            answer = Answer.objects.get(id=pk)
            user = get_user(request)
            if answer.question.room.host == user:
                question=answer.question

                answer.delete()
                return Response({"question": QuestionSerializer(question).data},
                                status=status.HTTP_200_OK)
            return Response({"Błąd": "Brak uprawnień."},
                status=status.HTTP_403_FORBIDDEN)