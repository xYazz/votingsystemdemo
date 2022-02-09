import string
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone, dateformat
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager

def validate_pesel(pesel):
    if len(pesel)!=11:
        raise ValidationError('%(pesel)s is incorrect', params={'pesel': pesel},)
    weight = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3]
    sum = 0
    controlNumber = pesel[10]

    for idx in range(len(pesel)-1):
        sum += int(pesel[idx])*weight[idx]
    
    sum = sum % 10
    if not ((10 - sum) == int(controlNumber)):
        raise ValidationError('%(pesel)s is incorrect', params={'pesel': pesel},)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    class Status(models.IntegerChoices):
        PRA = 1, "Osoba pracująca"
        EME = 2, "Emeryt/rencista"
        UCZ = 3, "Uczeń/student"
        DOR = 4, "Osoba pracująca dorywczo"
        BEZ = 5, "Osoba bezrobotna"
    
    class Education(models.IntegerChoices):
        BEZ = 1, "Brak wykształcenia"
        POD = 2, "Wykształcenie podstawowe"
        GIM = 3, "Wykształcenie gimnazjalne"
        ZAS = 4, "Wykształcenie zasadnicze zawodowe"
        BR1 = 5, "Wykształcenie branżowe"
        BR2 = 6, "Wykształcenie średnie branżowe"
        SRE = 7, "Wykształcenie średnie"
        WYZ = 8, "Wykształcenie wyższe"

    class PlaceOfResidence(models.IntegerChoices):
        P50 = 1, "Miasto powyżej 500 tys. mieszkańców"
        B50 = 2 , "Miasto 200-499 tys. mieszkańców"
        B20 = 3, "Miasto 100-199 tys. mieszkańców"
        B10 = 4, "Miasto 50-99 tys. mieszkańców"
        B5 = 5, "Miasto poniżej 50 tys. mieszkańców"
        WIE = 6, "Wieś"
    
    class Citizenship(models.IntegerChoices):
        POL = 1, "Polskie"
        OTH = 2, "Inne"

    email = models.EmailField(_('email address'), unique=True, blank=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    pesel = models.CharField(max_length=11, validators=[validate_pesel], unique=True, blank=False)
    social_status = models.PositiveSmallIntegerField(choices = Status.choices, default = 1)
    education = models.PositiveSmallIntegerField(choices = Education.choices, default = Education.BEZ)
    place_of_residence = models.PositiveSmallIntegerField(choices = PlaceOfResidence.choices, default = 6)
    citizenship = models.PositiveSmallIntegerField(choices = Citizenship.choices, default = 1)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'pesel', 'social_status', 'education', 'place_of_residence', 'citizenship']

    objects = CustomUserManager()

    def __str__(self):
        return self.email