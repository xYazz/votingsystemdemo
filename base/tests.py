import datetime
import json
from urllib import response

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from matplotlib.font_manager import json_dump, json_load
from rest_framework.test import APIClient

from .serializers import VoteSerializer

from .models import CanVote, Candidate, Vote, VoteResult


class TestsCases(TestCase):

    def setUp(cls):

        # setting basic models for further usage and testing
        User = get_user_model()
        cls.user1 = User.objects.create_user(
            email='normal1@user.com', password='foo')
        cls.user2 = User.objects.create_user(
            email='normal2@user.com', password='foo', pesel="2")
        cls.public_vote = Vote.objects.create(
            type=1, name="Test vote", max_votes=2, owner=cls.user2, start_date=timezone.now()-datetime.timedelta(days=1))
        cls.private_vote = Vote.objects.create(type=1, name="Test vote", max_votes=2, private=1,
                                               code='123456', owner=cls.user2, start_date=timezone.now()-datetime.timedelta(days=1))
        cls.candidate1 = Candidate.objects.create(
            first_name="Candidate", last_name="lastname", description="testing description", vote=cls.public_vote)
        cls.candidate2 = Candidate.objects.create(
            first_name="Candidate", last_name="lastname", description="testing description", vote=cls.public_vote)
        cls.candidate3 = Candidate.objects.create(
            first_name="Candidate", last_name="lastname", description="testing description", vote=cls.public_vote)

        # setting basic api client and setting further authenticated user as user1
        cls.api = APIClient()
        login_response = cls.api.post(
            '/api/auth/login/', {'email': 'normal2@user.com', 'password': 'foo'})
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
        response_not_all_data = self.api.post(
            '/api/create-vote', not_all_data, format='json')
        self.assertEqual(response_not_all_data.status_code, 201)
        all_data = {"name": "Test vote", "type": 1, "description": "test", "max_votes": 2, "private": 1,
                    "start_date": timezone.now(), "end_date": timezone.now()+datetime.timedelta(days=3)}
        response_all_data = self.api.post(
            '/api/create-vote', all_data, format='json')
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

    def test_profile_api(self):
        """Checks getting logged user data and tries to get data of another user."""

        response = self.api.get('/api/profile/'+str(self.user2.id))
        self.assertEqual(response.data['user']['email'], 'normal2@user.com')
        self.assertEqual(len(response.data['votes']), 2)
        self.assertEqual(response.status_code, 200)

        response = self.api.get('/api/profile/'+str(self.user1.id))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data, {"Error": "Unauthorized access"})

    def test_create_candidate_api(self):
        """Creating new candidate with correct and incorrect data."""

        correct_data_response = self.api.post('/api/add_candidate/'+str(self.public_vote.id),
                                              {"first_name": "Jan", "last_name": "Kowalski", "description": "Program"}, format='json')
        self.assertEqual(correct_data_response.data['first_name'], 'Jan')
        self.assertEqual(correct_data_response.status_code, 201)

        incorrect_data_response = self.api.post(
            '/api/add_candidate/'+str(self.public_vote.id))

        self.assertEqual(incorrect_data_response.status_code, 400)
        self.assertEqual(incorrect_data_response.data, {
                         'Bad Request': 'Invalid Data...'})

    def test_get_candidate_api(self):
        """Testing get, patch and delete of candidate instance."""

        response_get = self.api.get(
            '/api/get-candidate/' + str(self.candidate1.id))
        self.assertEqual(response_get.status_code, 200)
        self.assertEqual(response_get.data['first_name'], 'Candidate')

        response_patch = self.api.patch(
            '/api/get-candidate/' + str(self.candidate1.id), {'first_name': 'Edited name'}, format='json')
        self.assertEqual(response_patch.status_code, 202)
        self.assertEqual(response_patch.data['first_name'], 'Edited name')

        response_delete = self.api.delete(
            '/api/get-candidate/' + str(self.candidate1.id))
        self.assertEqual(response_delete.status_code, 202)
        self.assertEqual(response_delete.data, {
                         "Deleted.": "Element deleted."})

        login_response = self.api.post(
            '/api/auth/login/', {'email': 'normal1@user.com', 'password': 'foo'})
        self.assertEqual(login_response.status_code, 200)
        self.token = login_response.data['access']
        self.api.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)

        unauthorized_response_get = self.api.get(
            '/api/get-candidate/' + str(self.candidate2.id))
        self.assertEqual(unauthorized_response_get.status_code, 401)
        self.assertEqual(unauthorized_response_get.data, {
                         "Error": "Unauthorized access"})

        unauthorized_response_patch = self.api.patch(
            '/api/get-candidate/' + str(self.candidate2.id), {'name': 'Edited name'}, format='json')
        self.assertEqual(unauthorized_response_patch.status_code, 401)
        self.assertEqual(unauthorized_response_patch.data,
                         {"Error": "Unauthorized access"})

        unauthorized_response_delete = self.api.delete(
            '/api/get-candidate/' + str(self.candidate2.id))
        self.assertEqual(unauthorized_response_delete.data,
                         {"Error": "Unauthorized access"})

    def test_get_vote_api(self):
        """Testing get, patch and delete of vote instance."""

        response_get = self.api.get(
            '/api/get-vote/' + str(self.public_vote.id))
        self.assertEqual(response_get.status_code, 200)
        self.assertEqual(response_get.data['name'], 'Test vote')

        response_patch = self.api.patch(
            '/api/get-vote/' + str(self.public_vote.id), {'name': 'Edited name'}, format='json')
        self.assertEqual(response_patch.status_code, 202)
        self.assertEqual(response_patch.data['name'], 'Edited name')

        response_delete = self.api.delete(
            '/api/get-vote/' + str(self.public_vote.id))
        self.assertEqual(response_delete.status_code, 202)
        self.assertEqual(response_delete.data, {
                         "Deleted.": "Element deleted."})

        login_response = self.api.post(
            '/api/auth/login/', {'email': 'normal1@user.com', 'password': 'foo'})
        self.assertEqual(login_response.status_code, 200)
        self.token = login_response.data['access']
        self.api.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)

        unauthorized_response_get = self.api.get(
            '/api/get-vote/' + str(self.private_vote.id))
        self.assertEqual(unauthorized_response_get.status_code, 401)
        self.assertEqual(unauthorized_response_get.data, {
                         "Error": "Unauthorized access"})

        unauthorized_response_patch = self.api.patch(
            '/api/get-vote/' + str(self.private_vote.id), {'name': 'Edited name'}, format='json')
        self.assertEqual(unauthorized_response_patch.status_code, 401)
        self.assertEqual(unauthorized_response_patch.data,
                         {"Error": "Unauthorized access"})

        unauthorized_response_delete = self.api.delete(
            '/api/get-vote/' + str(self.private_vote.id))
        self.assertEqual(unauthorized_response_delete.data,
                         {"Error": "Unauthorized access"})

    def test_submit_vote_api(self):
        """Tests submiting vote."""

        response1 = self.api.post('/api/submit_vote/', {'vote': str(self.public_vote.id), 'voter': str(
            self.user2.id), 'candidate': str(self.candidate1.id)}, format='json')
        self.assertEqual(response1.status_code, 201)
        self.assertEqual(response1.data['voter'], self.user2.id)
        self.assertEqual(response1.data['vote'], self.public_vote.id)
        self.assertEqual(response1.data['candidate'], self.candidate1.id)

        response2 = self.api.post('/api/submit_vote/', {'vote': str(self.public_vote.id), 'voter': str(
            self.user2.id), 'candidate': str(self.candidate2.id)}, format='json')
        self.assertEqual(response2.status_code, 201)
        self.assertEqual(response2.data['voter'], self.user2.id)
        self.assertEqual(response2.data['vote'], self.public_vote.id)
        self.assertEqual(response2.data['candidate'], self.candidate2.id)

        response3 = self.api.post('/api/submit_vote/', {'vote': str(self.public_vote.id), 'voter': str(
            self.user2.id), 'candidate': str(self.candidate3.id)}, format='json')
        self.assertEqual(response3.status_code, 403)
        self.assertEqual(response3.data, {'Error': 'Voted too many times.'})

    def test_votevoter_api(self):
        """Checks if user already voted."""

        response_able_to_vote = self.api.get(
            '/api/vote_voter', {'vote': str(self.public_vote.id), 'user': str(self.user2.id)})
        self.assertEqual(response_able_to_vote.status_code, 200)
        self.assertEqual(response_able_to_vote.data,
                         {'Ok.': 'Allowed to vote'})

        self.test_submit_vote_api()
        response_unable_to_vote = self.api.get(
            '/api/vote_voter', {'vote': str(self.public_vote.id), 'user': str(self.user2.id)})
        self.assertEqual(response_unable_to_vote.status_code, 403)

    def test_finished_votes_api(self):
        """Tests listing ended votes."""

        response = self.api.get('/api/finished_votes')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

        vote = Vote.objects.create(type=1, name="Test vote", max_votes=2, owner=self.user2, start_date=timezone.now(
        )-datetime.timedelta(days=1), end_date=timezone.now()-datetime.timedelta(hours=1))
        Candidate.objects.create(
            first_name='name', last_name='name', description='desc', vote=vote)
        response = self.api.get('/api/finished_votes')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_joining_private_vote_api(self):
        """Tests joining to private votes, accepting/declining pending requests."""

        # login as user with no access
        login_response = self.api.post(
            '/api/auth/login/', {'email': 'normal1@user.com', 'password': 'foo'})
        self.assertEqual(login_response.status_code, 200)
        self.token = login_response.data['access']
        self.api.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)

        private_vote = Vote.objects.create(type=1, name="Test vote", max_votes=2, private=1,
                                           code='123455', owner=self.user2, start_date=timezone.now()+datetime.timedelta(days=1))

        response_unable_to_vote = self.api.post('/api/submit_vote/', {'vote': str(
            private_vote.id), 'voter': str(self.user1.id), 'candidate': str(self.candidate1.id)})
        self.assertEqual(response_unable_to_vote.status_code, 403)

        response_trying_to_vote_as_other_user = self.api.post('/api/submit_vote/', {'vote': str(
            private_vote.id), 'voter': str(self.user2.id), 'candidate': str(self.candidate1.id)})
        self.assertEqual(
            response_trying_to_vote_as_other_user.status_code, 401)

        response_send_request = self.api.post(
            '/api/can-vote', {'code': '123455'})
        self.assertEqual(response_send_request.status_code, 201)

        # login as owner
        login_response = self.api.post(
            '/api/auth/login/', {'email': 'normal2@user.com', 'password': 'foo'})
        self.assertEqual(login_response.status_code, 200)
        self.token = login_response.data['access']
        self.api.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)

        response_pending_requests = self.api.get('/api/can-vote')
        self.assertEqual(response_pending_requests.status_code, 200)
        self.assertEqual(len(response_pending_requests.data['can_vote']), 1)

        response_accept_request = self.api.patch(
            '/api/can-vote/' + str(response_pending_requests.data['can_vote'][0]['id']))
        self.assertEqual(response_accept_request.status_code, 202)

        # login as user with access
        login_response = self.api.post(
            '/api/auth/login/', {'email': 'normal1@user.com', 'password': 'foo'})
        self.assertEqual(login_response.status_code, 200)
        self.token = login_response.data['access']
        self.api.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)

        response_able_to_vote = self.api.post('/api/submit_vote/', {'vote': str(
            private_vote.id), 'voter': str(self.user1.id), 'candidate': str(self.candidate1.id)})
        self.assertEqual(response_able_to_vote.status_code, 201)

        response_trying_to_vote_as_other_user = self.api.post('/api/submit_vote/', {'vote': str(
            private_vote.id), 'voter': str(self.user2.id), 'candidate': str(self.candidate1.id)})
        self.assertEqual(
            response_trying_to_vote_as_other_user.status_code, 401)

        # try to delete
        self.assertEqual(len(CanVote.objects.all()), 1)
        response_accept_request = self.api.delete(
            '/api/can-vote/' + str(response_pending_requests.data['can_vote'][0]['id']))
        self.assertEqual(response_accept_request.status_code, 401)
        self.assertEqual(len(CanVote.objects.all()), 1)

        # login as owner to delete permission
        login_response = self.api.post(
            '/api/auth/login/', {'email': 'normal2@user.com', 'password': 'foo'})
        self.assertEqual(login_response.status_code, 200)
        self.token = login_response.data['access']
        self.api.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)

        response_pending_requests = self.api.get('/api/can-vote')
        self.assertEqual(response_pending_requests.status_code, 200)
        self.assertEqual(len(response_pending_requests.data['can_vote']), 1)

        self.assertEqual(len(CanVote.objects.all()), 1)
        response_accept_request = self.api.delete(
            '/api/can-vote/' + str(response_pending_requests.data['can_vote'][0]['id']))
        self.assertEqual(response_accept_request.status_code, 202)
        self.assertEqual(len(CanVote.objects.all()), 0)
