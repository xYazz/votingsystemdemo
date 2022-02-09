from rest_framework.routers import SimpleRouter
from base.auth.viewsets.login import LoginViewSet
from base.auth.viewsets.register import RegistrationViewSet
from base.auth.viewsets.refresh import RefreshViewSet
from base.auth.viewsets.blacklist import BlacklistTokenUpdateViewSet


routes = SimpleRouter()

# AUTHENTICATION
routes.register(r'login', LoginViewSet, basename='auth-login')
routes.register(r'register', RegistrationViewSet, basename='auth-register')
routes.register(r'refresh', RefreshViewSet, basename='auth-refresh')




urlpatterns = [
    *routes.urls
]