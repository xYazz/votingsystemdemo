import datetime
from django.utils.dateparse import parse_date
import json
from django.utils import timezone
from django.db.models import Count
from django.core.exceptions import ObjectDoesNotExist
from django.views import View
from rest_framework import generics, status, permissions
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication, JWTAuthentication
from .user.models import CustomUser
from .serializers import AddVoteVoterSerializer, CanVoteSerializer, CandidateSerializer, AddCandidateSerializer, DisplayVoteSerializer, VoteResultSerializer, VoteSerializer, CreateVoteSerializer, VoteVoterSerializer
from .models import CanVote, Candidate, Vote, VoteResult, VoteVoter
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSetMixin
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .user.serializers import CustomUserSerializer, DisplayUserSerializer
import jwt
from project import settings

now = timezone.now()

# Returns instance of a user that sent the request.


def get_user(req):
    return CustomUser.objects.get(id=(jwt.decode(req.headers['Authorization'][4:], settings.SECRET_KEY, algorithms=['HS256']))['user_id'])

# Lists ongoing votes that user can particiapte in.


class VoteList(APIView):
    http_method_names = ['get', 'head']
    serializer_class = VoteSerializer
    queryset = Vote.objects.all()

    def get(self, request, format=None):
        user = get_user(request)
        votes = self.queryset.filter(end_date__gt=now, start_date__lt=now)
        public = votes.filter(private=False)
        private = votes.filter(private=True, id__in=CanVote.objects.filter(
            voter=user, can_vote=True).values_list('vote', flat=True))
        available = public | private
        serializer = self.serializer_class(available, many=True)
        return Response(serializer.data)

# lists finished votes that user could participate in


class EndedVoteList(APIView):
    http_method_names = ['get', 'head']
    serializer_class = VoteSerializer
    queryset = Vote.objects.all()

    def get(self, request, format=None):
        user = get_user(request)
        votes = self.queryset.filter(end_date__lt=now).filter(
            id__in=Candidate.objects.all().values_list('vote', flat=True))
        public = votes.filter(private=False)
        private = votes.filter(private=True, id__in=CanVote.objects.filter(
            voter=user, can_vote=True).values_list('vote', flat=True))
        available = public | private
        serializer = self.serializer_class(available, many=True).data
        # response = []
        # for vote in serializer:
        #     if vote['candidates']:
        #         new_candidates = []
        #         for candidate in vote['candidates']:
        #             new_candidates.append(dict(candidate))
        #         vote['candidates']=new_candidates
        #         response.append(dict(vote))

        return Response(serializer)

# checks if user can participate in a vote


class VoteVoterList(APIView):
    http_method_names = ['get', 'head']
    serializer_class = VoteVoterSerializer
    queryset = VoteVoter.objects.all()

    def get(self, request):
        Vote_id = Vote.objects.get(id=request.GET.get('vote'))
        Voter_id = CustomUser.objects.get(id=request.GET.get('user'))
        votes = self.queryset.filter(vote=Vote_id, voter=Voter_id)

        if not votes:
            return Response({'Ok.': 'Allowed to vote'}, status=status.HTTP_200_OK)
        serializer = self.serializer_class(votes, many=True)
        return Response(serializer.data, status=status.HTTP_403_FORBIDDEN)
    # def get(self, request, format=None):
    #     user = CustomUser.objects.get(id=request.data.get('user'))
    #     vote = Vote.objects.get(id=request.data.get('vote'))
    #     vote_voter = VoteVoter.objects.filter(voter=user, vote=vote)
    #     return Response(VoteVoterSerializer(vote_voter).data, status=status.HTTP_200_OK)

# sends user's vote making him unable to vote again


class AddVoteVoterView(APIView):
    serializer_class = AddVoteVoterSerializer

    def post(self, request, format=None):
        try:
            user = get_user(request)

            vote = Vote.objects.get(id=request.data.get('vote'))
            voter = CustomUser.objects.get(id=request.data.get('voter'))
            if user.id != voter.id:
                return Response({'Error', 'Unauthorized access'}, status=status.HTTP_401_UNAUTHORIZED)
            candidate = Candidate.objects.get(id=request.data.get('candidate'))
            if vote.private:
                if not CanVote.objects.filter(vote=vote, voter=user):
                    return Response({'Error', 'No permission to vote.'}, status=status.HTTP_403_FORBIDDEN)
            if len(VoteVoter.objects.filter(vote=vote, voter=voter)) >= vote.max_votes:
                return Response({'Error': 'Voted too many times.'}, status=status.HTTP_403_FORBIDDEN)
            vote_voter = VoteVoter(
                vote=vote, voter=voter, candidate=candidate)
            vote_voter.save()
            return Response(VoteVoterSerializer(vote_voter).data, status=status.HTTP_201_CREATED)
        except ObjectDoesNotExist:
            return Response({'Bad Request': 'Invalid Data...'}, status=status.HTTP_400_BAD_REQUEST)

# returns all votes, for debugging


class VoteView(generics.ListAPIView):
    serializer_class = VoteSerializer
    queryset = Vote.objects.all()

# returns all candidates, for debugging


class CandidatesView(generics.ListAPIView):
    serializer_class = CandidateSerializer
    queryset = Candidate.objects.all()

# creates vote


class CreateVoteView(APIView):
    serializer_class = CreateVoteSerializer

    def post(self, request, format=None):

        user = get_user(request)
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            # added or default because tests without passing data didn't pass
            type = serializer.data.get('type')
            name = serializer.data.get('name')
            description = serializer.data.get('description') or ''
            max_votes = serializer.data.get('max_votes')
            start_date = serializer.data.get(
                'start_date') or now+datetime.timedelta(days=1)
            end_date = serializer.data.get(
                'end_date') or now+datetime.timedelta(days=3)
            private = serializer.data.get('private') or 0

            # queryset = Votes.objects.filter(name=name)
            # if queryset.exists():
            #     vote = queryset[0]
            #     vote.max_votes=max_votess
            #     vote.save(update_fields=['max_votes'])
            #     return Response(VotesSerializer(vote).data, status=status.HTTP_202_ACCEPTED)
            # else:
            vote = Vote(type=type, name=name, description=description, max_votes=max_votes,
                        start_date=start_date, end_date=end_date, owner=user, private=private)
            vote.save()
            return Response(DisplayVoteSerializer(vote).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid Data...'}, status=status.HTTP_400_BAD_REQUEST)

# creates candidate


class AddCandidateView(APIView):
    serializer_class = AddCandidateSerializer
    votes = Vote.objects.all()

    def post(self, request, vote_id, format=None):

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            first_name = serializer.data.get('first_name')
            last_name = serializer.data.get('last_name')
            description = serializer.data.get('description')
            vote = self.votes.get(id=vote_id)
            candidate = Candidate(
                first_name=first_name, last_name=last_name, description=description, vote=vote)
            candidate.save()
            return Response(CandidateSerializer(candidate).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid Data...'}, status=status.HTTP_400_BAD_REQUEST)

# stores data of requests to vote's owner to allow one to participate in the vote


class CanVoteRequest(APIView):
    # send request
    def post(self, request, format=None):
        try:
            votes = Vote.objects.all()
            code = request.data.get('code')
            user = get_user(request)
            try:
                vote = votes.get(code=code)
                try:
                    can_vote = CanVote.objects.get(vote=vote, voter=user)
                except ObjectDoesNotExist:
                    if vote.start_date > now:
                        can_vote = CanVote(vote=vote, voter=user)
                        can_vote.save()
                    else:
                        return Response({'Błąd': 'Wybory się rozpoczęły'}, status=status.HTTP_403_FORBIDDEN)
                    return Response(CanVoteSerializer(can_vote).data, status=status.HTTP_201_CREATED)
            except ObjectDoesNotExist:
                return Response({'Błąd': 'Wprowadzony kod jest nieprawidłowy'}, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            return Response({'Błąd': 'Nie można wysłać prośby.'}, status=status.HTTP_204_NO_CONTENT)

    # get data of pending requests
    def get(self, request, format=None):
        user = get_user(request)
        try:
            can_vote = CanVote.objects.filter(
                vote__in=Vote.objects.filter(owner=user)).exclude(can_vote=True)
        except ObjectDoesNotExist:
            return Response({'Błąd': 'Brak oczekujących prośb o dołączenie'}, status=status.HTTP_204_NO_CONTENT)
        serializer = CanVoteSerializer(can_vote, many=True)
        vote_data = {}
        voter_data = {}
        for details in can_vote:
            voter = CustomUser.objects.get(id=details.voter.id)
            vote = Vote.objects.get(id=details.vote.id)
            voter_data[voter.id] = CustomUserSerializer(voter).data
            vote_data[vote.id] = VoteSerializer(vote).data
        return Response({"can_vote": serializer.data, "voter_data": voter_data, "vote_data": vote_data}, status=status.HTTP_200_OK)

# decide what to do with pending requests to access vote


class PendingCanVoteRequest(APIView):
    model = CanVote
    serializer_class = CanVoteSerializer
    queryset = CanVote.objects.all()

    # allow one to vote
    def patch(self, request, pk):
        user = get_user(request)
        try:
            prev_can_vote = self.queryset.get(id=pk)
            if prev_can_vote.vote.owner == user:
                serializer = self.serializer_class(
                    prev_can_vote, request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
                return Response(serializer.errors, status=status.HTTP_208_ALREADY_REPORTED)
            else:
                return Response({"Błąd": "Brak uprawnień."}, status=status.HTTP_401_UNAUTHORIZED)
        except ObjectDoesNotExist:
            return Response({'Bad Request': 'Invalid id.'}, status=status.HTTP_404_NOT_FOUND)

    # delete request
    def delete(self, request, pk):
        user = get_user(request)
        try:
            can_vote = self.queryset.get(id=pk)
            if can_vote.vote.owner == user:
                can_vote.delete()
                return Response({"Deleted.": "Element deleted."}, status=status.HTTP_202_ACCEPTED)
            else:
                return Response({"Błąd": "Brak uprawnień."}, status=status.HTTP_401_UNAUTHORIZED)
        except ObjectDoesNotExist:
            return Response({'Bad Request': 'Invalid id.'}, status=status.HTTP_400_BAD_REQUEST)

# get, update or delete candidate


class GetCandidate(APIView):
    model = Candidate
    serializer_class = CandidateSerializer
    queryset = Candidate.objects.all()

    def check_ownership(self, request, instance):
        user = get_user(request)
        vote = Vote.objects.get(id=instance.vote.id)
        if user.id is not vote.owner.id:
            return False
        return True

    def get(self, request, pk, format=None):
        candidate = self.queryset.get(id=pk)
        if not self.check_ownership(request, candidate):
            return Response({"Error": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = self.serializer_class(candidate)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):

        prev_instance = self.queryset.get(id=pk)
        if not self.check_ownership(request, prev_instance):
            return Response({"Error": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
        if prev_instance:
            serializer = self.serializer_class(
                prev_instance, request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'Invalid id.'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        instance = self.queryset.get(id=pk)
        if instance:
            if not self.check_ownership(request, instance):
                return Response({"Error": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
            instance.delete()
            return Response({"Deleted.": "Element deleted."}, status=status.HTTP_202_ACCEPTED)
        return Response({'Bad Request': 'Invalid candidate id.'}, status=status.HTTP_400_BAD_REQUEST)

# get, update or delete vote


class GetVote(GetCandidate):
    model = Vote
    serializer_class = VoteSerializer
    queryset = Vote.objects.all()

    def check_ownership(self, request, instance):
        user = get_user(request)
        if user.id is not instance.owner.id:
            return False
        return True

    def get(self, request, pk):
        vote = self.queryset.get(id=pk)
        if not self.check_ownership(request, vote):
            return Response({"Error": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
        if vote:
            match vote.type:
                case 1:
                    vote.type = "Wybory prezydenckie"
                case 2:
                    vote.type = "Wybory parlamentarne"
                case 3:
                    vote.type = "Wybory starosty roku"
                case 4:
                    vote.type = "Wybory dziekana wydziału"
                case 5:
                    vote.type = "Wybory ogólne"
            data = self.serializer_class(vote).data

            return Response(data, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Invalid vote id.'}, status=status.HTTP_404_NOT_FOUND)

# get user data and owned votes


class Profile(APIView):
    def get(self, request, format=None, **kwargs):
        user = CustomUser.objects.get(
            id=self.request.resolver_match.kwargs["pk"])
        if user != get_user(request):
            return Response({"Error": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
        votes = Vote.objects.filter(owner=user)
        if votes:
            return Response({"user": DisplayUserSerializer(user).data,
                             "votes": VoteSerializer(votes, many=True).data}, status=status.HTTP_200_OK)

        return Response({"user": DisplayUserSerializer(user).data, "votes": []}, status=status.HTTP_200_OK)

# get instance of finished vote's summary, create if doesn't exist


class Results(APIView):
    def get(self, request, format=None, **kwargs):
        try:
            vote = Vote.objects.get(
                id=self.request.resolver_match.kwargs["pk"])
        except ObjectDoesNotExist:
            return Response({"Błąd", "Głosowanie nie istnieje."}, status=status.HTTP_404_NOT_FOUND)

        if not len(VoteSerializer(vote).data['candidates']) > 0:
            return Response({"result": None}, status=status.HTTP_200_OK)
        else:
            try:
                result = VoteResult.objects.get(vote=vote)
            except ObjectDoesNotExist:
                results = {"Edukacja": {}, "Miejsce zamieszkania": {},
                           "Status społeczny": {}, "Kandydaci": []}
                vote_voters = VoteVoter.objects.filter(vote=vote)
                sum = len(vote_voters)
                if sum == 0:
                    result = VoteResult(vote=vote, results={
                                        "results": "Brak oddanych głosów"})
                    result.save()
                    return Response(VoteResultSerializer(result).data, status=status.HTTP_201_CREATED)

                for candidate in VoteSerializer(vote).data['candidates']:
                    get_candidate = Candidate.objects.get(id=candidate['id'])
                    # get percentage for certain label

                    def get_value(name, idx):
                        # labels = {
                        #     'education': len(vote_voters.filter(candidate=get_candidate, voter__in=CustomUser.objects.filter(social_status=idx))),
                        #     'social_status': len(vote_voters.filter(candidate=get_candidate, voter__in=CustomUser.objects.filter(social_status=idx))),
                        #     'place_of_residence': len(vote_voters.filter(candidate=get_candidate, voter__in=CustomUser.objects.filter(place_of_residence=idx)))
                        #     }
                        specific_candidate_data = len(vote_voters.filter(
                            candidate=get_candidate, voter__in=CustomUser.objects.filter(**{name: idx})))
                        all_candidates_data = len(
                            vote_voters.filter(candidate=get_candidate))
                        try:
                            return round(specific_candidate_data/all_candidates_data*100, 2)
                        except ZeroDivisionError:
                            return 0

                    results['Edukacja'][candidate['id']] = []
                    results['Miejsce zamieszkania'][candidate['id']] = []
                    results['Status społeczny'][candidate['id']] = []

                    for idx, stat in enumerate(CustomUser.Education.labels):
                        results['Edukacja'][candidate['id']].append({"label": CustomUser.Education.labels[idx],
                                                                     "value": get_value("education", idx+1)})

                        if idx < (len(CustomUser.PlaceOfResidence.labels)):
                            results['Miejsce zamieszkania'][candidate['id']].append({"label": CustomUser.PlaceOfResidence.labels[idx],
                                                                                     "value": get_value("place_of_residence", idx+1)})

                        if idx < (len(CustomUser.Status.labels)):
                            results['Status społeczny'][candidate['id']].append({"label": CustomUser.Status.labels[idx],
                                                                                 "value": get_value("social_status", idx+1)})

                    results["Kandydaci"].append({"label": candidate["first_name"] + " " + candidate["last_name"],
                                                 "value": round(len(vote_voters.filter(candidate=get_candidate))/sum*100, 2), "id": candidate['id']})

                result = VoteResult(vote=vote, results=json.dumps(results))
                result.save()
                return Response(VoteResultSerializer(result).data, status=status.HTTP_201_CREATED)
            return Response(VoteResultSerializer(result).data, status=status.HTTP_200_OK)

# probably useless


class UserData(APIView):
    def get(self, request, format=None, **kwargs):
        user = CustomUser.objects.get(
            id=self.request.resolver_match.kwargs["pk"])

        if user != get_user(request):
            return Response({"user": [], "votes": [], "Error": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)

        votes = Vote.objects.filter(owner=user)
        if len(votes) < 1:
            return Response({"user": DisplayUserSerializer(user).data, "votes": []}, status=status.HTTP_200_OK)
        return Response({"user": DisplayUserSerializer(user).data, "votes": json.loads(json.dumps(VoteSerializer(votes, many=True).data))}, status=status.HTTP_200_OK)
