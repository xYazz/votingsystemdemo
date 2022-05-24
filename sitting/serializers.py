from .models import Room, Question, Answer, SentAnswer
from base.user.serializers import CustomUserSerializer
from rest_framework import serializers


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        exclude = []
        depth = 1


class QuestionSerializer(serializers.ModelSerializer):
    last_answer = serializers.SerializerMethodField()
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ["pk", "room", "question", "created_at", "answers", "last_answer"]
        depth = 1
        read_only_fields = ["answers", "last_answer"]
    
    def get_last_answer(self, obj:Question):
        return AnswerSerializer(obj.answers.order_by('created_at').last()).data

class RoomSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ["pk", "name", "host", "status", "questions", "current_question", "current_users", "allowed_users"]
        depth = 1
        read_only_fields = ["questions"]


class SentAnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = SentAnswer
        fields = ["pk", "question", "answer", "user", "created_at"]
        depth = 1
