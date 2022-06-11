from django.db import models
from base.user.models import CustomUser


class Room(models.Model):
    STATUS = (
        (1, "Pending"),
        (2, "Active"),
        (3, "Finished"),
    )
    status = models.PositiveSmallIntegerField(
        choices=STATUS,
        default=1
    )
    name = models.CharField(max_length=255, null=False,
                            blank=False, unique=True)
    host = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="rooms")
    current_users = models.ManyToManyField(
        CustomUser, related_name="current_rooms", blank=True)
    allowed_users = models.ManyToManyField(
        CustomUser, related_name="allowed_rooms", blank=True)
    current_question = models.IntegerField(default=0, blank=False, null=False)
    is_public = models.BooleanField(default=False)

    def __str__(self):
        return f"Room({self.name} {self.host})"


class Question(models.Model):
    room = models.ForeignKey(
        "sitting.Room", on_delete=models.CASCADE, related_name="questions")
    question = models.TextField(max_length=500)

    def __str__(self):
        return f"Message({self.question})"

class Answer(models.Model):
    answer = models.TextField(max_length=100)
    times_voted = models.IntegerField(default=0, blank=False)
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="answers")

    def __str__(self):
        return f"Message({self.answer})"

class SentAnswer(models.Model):
    question = models.ForeignKey(
        "sitting.Question", on_delete=models.CASCADE, related_name="sent_answer")
    answer = models.ForeignKey(
        "sitting.Answer", on_delete=models.CASCADE, related_name="sent_answer")
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="sent_answer")

    def __str__(self):
        return f"Message({self.question} {self.answer} {self.user})"


