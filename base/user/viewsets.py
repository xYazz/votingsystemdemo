from .serializers import CustomUserSerializer
from .models import CustomUser
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters


class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = CustomUserSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['updated']
    ordering = ['-updated']

    def get_queryset(self):
        return CustomUser.objects.all()

    def get_object(self):
        lookup_field_value = self.kwargs[self.lookup_field]

        obj = CustomUser.objects.get(id=lookup_field_value)
        self.check_object_permissions(self.request, obj)

        return obj