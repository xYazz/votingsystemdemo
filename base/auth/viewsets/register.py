from django.forms import ValidationError
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from base.auth.serializers.register import RegisterSerializer
from base.user.models import CustomUser


    

class RegistrationViewSet(ModelViewSet, TokenObtainPairView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        users = CustomUser.objects.all()
        serializer = self.get_serializer(data=request.data)
        if(serializer.is_valid()):
            if users.filter(email=request.data['email']).count()>0:
                return JsonResponse({"Błąd": "Podany adres email jest już w użyciu."}, status=status.HTTP_400_BAD_REQUEST)
            user = serializer.save()
            

            refresh = RefreshToken.for_user(user)
            res = {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }

            return Response({
                "user": serializer.data,
                "refresh": res["refresh"],
                "token": res["access"]
            }, status=status.HTTP_201_CREATED)
        else:
            errors =""
            if(serializer.errors["pesel"]):
                errors+="Podany pesel już jest w użytku. "
            return JsonResponse({"Błąd": errors}, status=status.HTTP_400_BAD_REQUEST)
    