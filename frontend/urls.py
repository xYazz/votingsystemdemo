from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('join', index),
    path('create', index),
    path('register', index),
    path('vote', index),
    path('login', index),
    path('logout', index),
    path('add_candidate', index),
    path('votes', index),
    path('profile', index),
    path('results', index),
    path('join', index),
    path('pending', index),
    path('sittings', index),
    path('sitting', index),
    path('live_sitting', index),
    path('finished_sitting', index)
]
