import datetime
import json

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from matplotlib.font_manager import json_dump, json_load
from rest_framework.test import APIClient

from .serializers import VoteSerializer

from .models import Vote, VoteResult


class TestsCases(TestCase):

    def setUp(cls):

        #setting basic models for further usage and testing
        User = get_user_model()
        cls.user1 = User.objects.create_user(email='normal1@user.com', password='foo')
        cls.user2 = User.objects.create_user(email='normal2@user.com', password='foo', pesel="2")
        cls.public_vote = Vote.objects.create(type=1, name="Test vote", max_votes=2, owner=cls.user2, start_date=timezone.now()-datetime.timedelta(days=1))
        cls.private_vote = Vote.objects.create(type=1, name="Test vote", max_votes=2, private=1, owner=cls.user2, start_date=timezone.now()-datetime.timedelta(days=1))

        #setting basic api client and setting further authenticated user as user1
        cls.api = APIClient()
        login_response = cls.api.post('/api/auth/login/', {'email': 'normal2@user.com', 'password': 'foo'})
        cls.assertEqual(login_response.status_code, 200)
        cls.token = login_response.data['access']
        cls.api.credentials(HTTP_AUTHORIZATION='JWT ' + cls.token)

    def test_vote_model(self):

        """Correct data provided"""

        self.assertEqual(self.public_vote.name, 'Test vote')
        self.assertEqual(self.public_vote.type, 1)
        self.assertEqual(self.public_vote.max_votes, 2)
        self.assertFalse(self.public_vote.private)
        self.assertEqual(self.public_vote.description, '')
        self.assertEqual(self.public_vote.owner, self.user2)
        self.assertEqual(len(self.public_vote.code), 6)

    def test_create_vote_api(self):

        """Testing create vote API with partial data (without required fields), all data, and no data"""

        not_all_data = {"name": "Test vote", "type": 1, "max_votes": 2}
        response_not_all_data = self.api.post('/api/create-vote', not_all_data, format='json')
        self.assertEqual(response_not_all_data.status_code, 201)
        all_data = {"name": "Test vote", "type": 1, "description": "test", "max_votes": 2, "private": 1, "start_date": timezone.now(), "end_date": timezone.now()+datetime.timedelta(days=3)}
        response_all_data = self.api.post('/api/create-vote', all_data, format='json')
        self.assertEqual(response_all_data.status_code, 201)
        response_empty = self.api.post('/api/create-vote', format='json')
        self.assertEqual(response_empty.status_code, 400)

    def test_votes_listing_api(self):

        response = self.api.get('/api/votes/', format='json')
        self.assertEqual(len(response.data), 1)

    def test_profile_api(self):

        """Checks getting logged user data and tries to get data of another user"""

        response = self.api.get('/api/profile/'+str(self.user2.id))
        self.assertEqual(response.data['user']['email'], 'normal2@user.com')
        self.assertEqual(len(response.data['votes']), 2)
        self.assertEqual(response.status_code, 200)

        response = self.api.get('/api/profile/'+str(self.user1.id))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data, {"Error": "Unauthorized access"})
        
    # def test_profile_api(self):

    #     """Checks getting logged user data and tries to get data of another user"""
        
    #     response = self.api.get('/api/profile/'+str(self.user2.id))
    #     self.assertEqual(response.data['user']['email'], 'normal2@user.com')
    #     self.assertEqual(response.data['email', 'normal2@user.com'])
    #     self.assertEqual(response.status_code, 200)

    #     response = self.api.get('/api/profile/'+str(self.user1.id))
    #     print(response.data)