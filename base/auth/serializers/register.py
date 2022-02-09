import email
from django.forms import ValidationError
from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist

from base.user.serializers import CustomUserSerializer
from base.user.models import CustomUser


class RegisterSerializer(CustomUserSerializer):
    password = serializers.CharField(max_length=128, min_length=8, write_only=True, required=True)
    email = serializers.EmailField(required=True, write_only=True, max_length=128)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'password', 'first_name', 'last_name', 'pesel', 'social_status', 'education', 'place_of_residence', 'citizenship']

    def create(self, validated_data):
        try:
            user = CustomUser.objects.get(email=validated_data['email'])
        except ObjectDoesNotExist:
            user = CustomUser.objects.create_user(**validated_data)
        return user