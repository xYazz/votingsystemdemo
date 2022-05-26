from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.RoomView.as_view(), name='create'),
    path('list/', views.RoomList.as_view(), name='list'),
    path('room/<int:pk>', views.RoomView.as_view(), name='room'),
    path('room_users/', views.AllowedUsersInRoom.as_view(), name='room_users'),
    path('room_questions/', views.QuestionView.as_view(), name='room_questions'),
    path('question_answers/', views.AnswerView.as_view(), name='question_answers'),
    path('ongoing_and_finished_rooms/', views.list_ongoing_and_finished_sittings, name='active_rooms'),
    path('answer/<int:pk>', views.AnswerView.as_view(), name='answer'),
    path('question/<int:pk>', views.QuestionView.as_view(), name='question'),
    path('check_if_voted/', views.check_if_voted, name='check_if_voted'),
]