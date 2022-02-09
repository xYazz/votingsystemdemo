from django.db import models
# Create your models here.
import datetime
from django.db.models.deletion import CASCADE
from django.db.models.fields import DateTimeField
from django.db.models.fields.related import ForeignKey
from django.forms import BooleanField
from django.utils import timezone
from jsonfield import JSONField
import string
import random
from .user.models import CustomUser

def generate_code():
    length = 6
    code_range = string.ascii_letters + string.digits
    while True:
        code = ''.join(random.choices(code_range, k=length))
        if Vote.objects.filter(code=code).count()==0:
            break
    return code

def date():
    return timezone.now()+timezone.timedelta(days=1)

class VoteResult(models.Model):
    vote = ForeignKey("Vote", on_delete=models.PROTECT)
    result = JSONField()

class Candidate(models.Model):
    first_name = models.CharField(max_length=100, blank=False)
    last_name = models.CharField(max_length=100, blank=False)
    description = models.CharField(max_length=500, blank=False)
    vote = ForeignKey("Vote", on_delete=CASCADE)

class VoteVoter(models.Model):
    vote = ForeignKey("Vote", on_delete=CASCADE)
    voter = ForeignKey(CustomUser, on_delete=models.PROTECT)
    candidate = ForeignKey("Candidate", on_delete=CASCADE)

class CanVote(models.Model):
    vote = ForeignKey("Vote", on_delete=CASCADE)
    voter = ForeignKey(CustomUser, on_delete=models.PROTECT)
    can_vote = models.BooleanField(default=False, blank=False)

class Vote(models.Model):
    class Type(models.IntegerChoices):
        PRE = 1, "Wybory prezydenckie"
        PAR = 2, "Wybory parlamentarne"
        STA = 3, "Wybory starosty roku"
        DZI = 4, "Wybory dziekana wydziału"
        BRA = 5, "Wybory ogólne"
    type = models.PositiveSmallIntegerField(
        choices=Type.choices,
        default = Type.BRA
    )
    private = models.BooleanField(default=False, blank=False)
    name = models.CharField(max_length=100, blank=False)
    description = models.CharField(max_length=500, blank=True)
    max_votes = models.PositiveSmallIntegerField(default=1, blank=False)
    start_date = models.DateTimeField(default=timezone.now, blank=False)
    end_date = models.DateTimeField(default=timezone.now()+datetime.timedelta(days=1), blank=False)
    owner = models.ForeignKey(CustomUser, on_delete=models.PROTECT, blank=False)
    code = models.CharField(default = generate_code, max_length=6, unique=True)

    class Meta:
        ordering = ('-end_date',)


    def __str__(self):
        return self.name  

