from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import Vote, VoteResult
from django.utils import timezone
import datetime

class TestsCases(TestCase):
    def setUp(cls):
        User = get_user_model()
        cls.user = User.objects.create_user(email='normal@user.com', password='foo')
        cls.vote = Vote.objects.create(type=1, name="Test vote", max_votes=2, owner=cls.user)
        cls.api = APIClient()
        register_response = cls.api.post('/api/auth/register/', {'email': 'testowy@mail.com', 'password':'P@ssw0rd', 'first_name': 'test name', 'last_name': 'last name', 'pesel': '22222222222'})
        cls.assertEqual(register_response.status_code, 201)
        login_response = cls.api.post('/api/auth/login/', {'email': 'testowy@mail.com', 'password': 'P@ssw0rd'})
        cls.assertEqual(login_response.status_code, 200)
        cls.token = login_response.data['access']
    
    def test_vote_model(self):
        """Correct data provided"""
        self.assertEqual(self.vote.name, 'Test vote')
        self.assertEqual(self.vote.type, 1)
        self.assertEqual(self.vote.max_votes, 2)
        self.assertFalse(self.vote.private)
        self.assertEqual(self.vote.description, '')
        self.assertEqual(self.vote.owner, self.user)
        self.assertEqual(len(self.vote.code), 6)

    # def test_create_vote_view(self):
    #     response = self.api.post('/api/create-vote', {'name': 'Test vote', 'type': 'test', 'max_votes': 2, 'owner': self.user.id}, format='json')
    #     print(response)