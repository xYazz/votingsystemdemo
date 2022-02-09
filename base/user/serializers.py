from django.forms import CharField, ChoiceField
from .models import CustomUser
from rest_framework import serializers


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'is_active', 'first_name', 'last_name', 'pesel', "social_status", 'education', 'place_of_residence', 'citizenship']
        read_only_field = ['is_active',]

class DisplayUserSerializer(serializers.ModelSerializer):
    social_status = serializers.CharField(source='get_social_status_display')
    education = serializers.CharField(source='get_education_display')
    citizenship = serializers.CharField(source='get_citizenship_display')
    place_of_residence = serializers.CharField(source='get_place_of_residence_display')
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'is_active', 'first_name', 'last_name', 'pesel', "social_status", 'education', 'place_of_residence', 'citizenship']
        read_only_field = ['is_active',]