from django.urls import re_path
from sitting import consumers


websocket_urlpatterns = [
    re_path(r'ws/chat/$', consumers.RoomConsumer.as_asgi()),
]