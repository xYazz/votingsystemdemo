from django.db import models
from base.user.models import CustomUser
# Create your models here.


class Room(models.Model):
    STATUS = (
        (1, "Pending"),
        (2, "Active"),
        (3, "Finished"),
    )
    status = models.PositiveSmallIntegerField(
        choices=STATUS,
        default = 1
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

    def __str__(self):
        return f"Room({self.name} {self.host})"

    def add_allowed_user(self, user):
        self.allowed_users.add(user)

    def remove_allowed_user(self, user):
        self.allowed_users.remove(user)

    

class Question(models.Model):
    room = models.ForeignKey(
        "sitting.Room", on_delete=models.CASCADE, related_name="questions")
    question = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message({self.question})"

class SentAnswer(models.Model):
    room = models.ForeignKey(
        "sitting.Room", on_delete=models.CASCADE, related_name="sent_answer")
    question = models.ForeignKey(
        "sitting.Question", on_delete=models.CASCADE, related_name="sent_answer")
    answer = models.ForeignKey(
        "sitting.Answer", on_delete=models.CASCADE, related_name="sent_answer")
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="sent_answer")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message({self.room} {self.question} {self.answer} {self.user})"


class Answer(models.Model):
    answer = models.TextField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="answers")

    def __str__(self):
        return f"Message({self.answer})"
