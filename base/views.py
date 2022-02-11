import datetime
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
# Create your views here.

def get_user(req):
    return CustomUser.objects.get(id=(jwt.decode(req.headers['Authorization'][4:], settings.SECRET_KEY, algorithms=['HS256']))['user_id'])

class VoteList(APIView):
    http_method_names = ['get', 'head']
    serializer_class = VoteSerializer
   
    def get(self, request, format=None):
        user = get_user(request)
        
        votes = Vote.objects.filter(end_date__gt=datetime.datetime.now(tz=timezone.utc), start_date__lt=datetime.datetime.now(tz=timezone.utc))
        public = votes.exclude(private=True)
        private = votes.filter(private=True, id__in=CanVote.objects.filter(voter=user, can_vote=True))
        available = public | private
        serializer = VoteSerializer(available, many=True)
        return Response(serializer.data)

class EndedVoteList(APIView):
    http_method_names = ['get', 'head']
    serializer_class = VoteSerializer

    def get(self, request, format=None):
        votes = Vote.objects.filter(end_date__lt=datetime.datetime.now(tz=timezone.utc))
        response = []
        serializer = VoteSerializer(votes, many=True).data
        for vote in serializer:
            try:
                voted_times = VoteVoter.objects.filter(vote=vote).count()
                if vote['candidates'] and voted_times > 0:
                    new_candidates = []
                    for candidate in vote['candidates']:
                        new_candidates.append(dict(candidate))
                    vote['candidates']=new_candidates
                    response.append(dict(vote))
            except ObjectDoesNotExist:
                pass
        
        return Response(response)


class VoteVoterList(APIView):
    
    http_method_names = ['get', 'head']
    serializer_class = VoteVoterSerializer

    def get(self, request):
        Vote_id = Vote.objects.get(id=request.GET.get('vote'))
        Voter_id = CustomUser.objects.get(id=request.GET.get('user'))
        votes = VoteVoter.objects.filter(vote=Vote_id, voter=Voter_id)
        serializer = VoteVoterSerializer(votes, many=True)
        return Response(serializer.data)
    # def get(self, request, format=None):
    #     user = CustomUser.objects.get(id=request.data.get('user'))
    #     vote = Vote.objects.get(id=request.data.get('vote'))
    #     vote_voter = VoteVoter.objects.filter(voter=user, vote=vote)
    #     return Response(VoteVoterSerializer(vote_voter).data, status=status.HTTP_200_OK)

class AddVoteVoterView(APIView):
    serializer_class = AddVoteVoterSerializer
    def post(self, request, format=None):

        Vote_id = Vote.objects.get(id=request.data.get('vote'))
        Voter_id = CustomUser.objects.get(id=request.data.get('voter'))
        Candidate_id = Candidate.objects.get(id=request.data.get('candidate'))
        vote_voter = VoteVoter(vote=Vote_id, voter=Voter_id, candidate=Candidate_id)
        vote_voter.save()
        return Response(VoteVoterSerializer(vote_voter).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid Data...'}, status=status.HTTP_400_BAD_REQUEST)

class VoteView(generics.ListAPIView):
    serializer_class=VoteSerializer
    queryset = Vote.objects.all()

class CandidatesView(generics.ListAPIView):
    serializer_class=CandidateSerializer
    queryset = Candidate.objects.all()
    
class CreateVoteView(APIView):
    serializer_class = CreateVoteSerializer
    

    def post(self, request, format=None):
        
        user = get_user(request)
        serializer= self.serializer_class(data=request.data)
        if serializer.is_valid():
            type = serializer.data.get('type')
            name = serializer.data.get('name')
            description = serializer.data.get('description')
            max_votes = serializer.data.get('max_votes')
            start_date = serializer.data.get('start_date')
            end_date = serializer.data.get('end_date')
            print(serializer.data.get('start_date'))
            private = serializer.data.get('private')
            # queryset = Votes.objects.filter(name=name)
            # if queryset.exists():
            #     vote = queryset[0]
            #     vote.max_votes=max_votess
            #     vote.save(update_fields=['max_votes'])
            #     return Response(VotesSerializer(vote).data, status=status.HTTP_202_ACCEPTED)
            # else:
            vote = Vote(type=type, name=name, description=description, max_votes=max_votes, start_date=start_date, end_date=end_date, owner=user, private=private)
            vote.save()
            return Response(DisplayVoteSerializer(vote).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid Data...'}, status=status.HTTP_400_BAD_REQUEST)

class AddCandidateView(APIView):
    serializer_class = AddCandidateSerializer
    votes = Vote.objects.all()
    def post(self, request, vote_id, format=None):

        serializer= self.serializer_class(data=request.data)
        if serializer.is_valid():
            first_name = serializer.data.get('first_name')
            last_name = serializer.data.get('last_name')
            description = serializer.data.get('description')
            vote = self.votes.get(id=vote_id)
            candidate = Candidate(first_name=first_name, last_name=last_name, description=description, vote=vote)
            candidate.save()
            return Response(CandidateSerializer(candidate).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid Data...'}, status=status.HTTP_400_BAD_REQUEST)

class CanVoteRequest(APIView):
    def post(self, request, format=None):
        
        try:
            votes = Vote.objects.all()
        except ObjectDoesNotExist:
            return Response({'Błąd': 'Brak oczekujących prośb o dołączenie'}, status=status.HTTP_204_NO_CONTENT)
        code = request.data.get('code')
        user = get_user(request)
        try:
            vote = votes.get(code=code)
        except ObjectDoesNotExist:
            return Response({'Błąd': 'Wprowadzony kod jest nieprawidłowy'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            can_vote = CanVote.objects.get(vote=vote, voter=user)
        except ObjectDoesNotExist:
            can_vote = CanVote(vote=vote, voter=user)
            can_vote.save()
        return Response(CanVoteSerializer(can_vote).data, status=status.HTTP_200_OK)

    def get(self, request, format=None):        
        user = get_user(request)
        
        try:
            can_vote = CanVote.objects.filter(vote__in = Vote.objects.filter(owner=user)).exclude(can_vote=True)
        except ObjectDoesNotExist:
            return Response({'Błąd': 'Brak oczekujących prośb o dołączenie'}, status=status.HTTP_204_NO_CONTENT)
        serializer = CanVoteSerializer(can_vote, many=True)
        vote_data = {}
        voter_data = {}
        for details in can_vote:
            voter = CustomUser.objects.get(id=details.voter.id)
            vote = Vote.objects.get(id=details.vote.id)
            voter_data[voter.id]=CustomUserSerializer(voter).data
            vote_data[vote.id]=VoteSerializer(vote).data
        return Response({"can_vote": serializer.data, "voter_data": voter_data, "vote_data": vote_data}, status=status.HTTP_200_OK)

class PendingCanVoteRequest(APIView):
    model = CanVote
    serializer_class = CanVoteSerializer
    queryset = CanVote.objects.all()

    def patch(self, request, pk):
        user = get_user(request)
        try:
            prev_can_vote = self.queryset.get(id=pk)
            if prev_can_vote.vote.owner==user:
                serializer = CanVoteSerializer(prev_can_vote, request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
                return Response(serializer.errors, status=status.HTTP_208_ALREADY_REPORTED)
            else:
                return Response({"Błąd": "Uwierzytelnianie nie powiodło się."}, status=status.HTTP_401_UNAUTHORIZED)
        except ObjectDoesNotExist:
            return Response({'Bad Request': 'Invalid id.'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        user = get_user(request)
        try:
            can_vote = self.queryset.get(id=pk)
            if can_vote.vote.owner==user:
                can_vote.delete()
                return Response({"Ok.": "Usunięto element."}, status=status.HTTP_202_ACCEPTED)
            else:
                return Response({"Błąd": "Uwierzytelnianie nie powiodło się."}, status=status.HTTP_401_UNAUTHORIZED)
        except ObjectDoesNotExist:
            return Response({'Bad Request': 'Invalid id.'}, status=status.HTTP_400_BAD_REQUEST)

class GetCandidate(APIView):
    model = Candidate
    serializer_class = CandidateSerializer
    queryset = Candidate.objects.all()

    def get(self, request, pk, format=None):        
        candidate = self.queryset.get(id=pk)
        serializer = CandidateSerializer(candidate)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        prev_candidate = self.queryset.get(id=pk)
        if prev_candidate:
            serializer = CandidateSerializer(prev_candidate, request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            return Response(serializer.errors, status=status.HTTP_208_ALREADY_REPORTED)
        return Response({'Bad Request': 'Invalid id.'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        candidate = self.queryset.get(id=pk)
        if candidate:
            candidate.delete()
            return Response({"Ok.": "Usunięto element."}, status=status.HTTP_202_ACCEPTED)
        return Response({'Bad Request': 'Invalid candidate id.'}, status=status.HTTP_400_BAD_REQUEST)
    

class Profile(APIView):
    
    def get(self,request, format=None, **kwargs):
        user = CustomUser.objects.get(id=self.request.resolver_match.kwargs["pk"])

        votes = Vote.objects.filter(owner=user)

        if (votes):
            return Response({"user": DisplayUserSerializer(user).data,
                            "votes": VoteSerializer(votes, many=True).data}, status=status.HTTP_200_OK)
        else:
            
            return Response({"user": DisplayUserSerializer(user).data, "votes": []}, status=status.HTTP_200_OK)

class Results(APIView):
    
    def get(self,request, format=None, **kwargs):
        
        try: 
            vote = Vote.objects.get(id=self.request.resolver_match.kwargs["pk"])
        except ObjectDoesNotExist:
            return Response({"Błąd", "Głosowanie nie istnieje."}, status=status.HTTP_404_NOT_FOUND)
        if len(VoteSerializer(vote).data['candidates']):
            # try:
            #     result=VoteResult.objects.get(vote=vote)
            # except ObjectDoesNotExist:   
            results = {'Edukacja': {}, 'Miejsce zamieszkania':{},'Status społeczny':{}, 'Kandydaci': []}
            print(CustomUserSerializer(CustomUser.objects.get(id=2)).data)
            print(CustomUserSerializer(CustomUser.objects.get(id=3)).data)
            vote_voters = VoteVoter.objects.filter(vote=vote)
            sum = len(vote_voters)
            print()
            voter = VoteVoter.objects.values('voter').annotate(weight=Count('voter')).order_by()
            
            for candidate in VoteSerializer(vote).data['candidates']:
                results['Edukacja'][candidate['id']]= []
                
                results['Miejsce zamieszkania'][candidate['id']]= []
                results['Status społeczny'][candidate['id']]=[]
                
                get_candidate = Candidate.objects.get(id=candidate['id'])
                for idx, stat in enumerate(CustomUser.Education.labels):
                    try: 
                        results['Edukacja'][candidate['id']].append({"label": CustomUser.Education.labels[idx], "value": round(
                        len(vote_voters.filter(candidate=get_candidate, voter__in=CustomUser.objects.filter(education=idx+1)))
                        /len(vote_voters.filter(candidate=get_candidate)
                        )*100, 2)})
                        
                    except (ZeroDivisionError, IndexError) as e:
                        results['Edukacja'][candidate['id']].append({"label": CustomUser.Education.labels[idx], "value": 0})

                    if idx < (len(CustomUser.PlaceOfResidence.labels)):
                        try: 
                            results['Miejsce zamieszkania'][candidate['id']].append({"label": CustomUser.PlaceOfResidence.labels[idx], "value":round(
                            len(vote_voters.filter(candidate=get_candidate, voter__in=CustomUser.objects.filter(place_of_residence=idx+1)))
                            /len(vote_voters.filter(candidate=get_candidate)
                            )*100, 2)})
                            
                        except (ZeroDivisionError, IndexError) as e:
                            results['Miejsce zamieszkania'][candidate['id']].append({"label": CustomUser.PlaceOfResidence.labels[idx], "value": 0})

                    if idx < (len(CustomUser.Status.labels)):
                        try: 
                            results['Status społeczny'][candidate['id']].append({"label": CustomUser.Status.labels[idx], "value": (round(
                            len(vote_voters.filter(candidate=get_candidate, voter__in=CustomUser.objects.filter(place_of_residence=idx+1)))
                            /len(vote_voters.filter(candidate=get_candidate)
                            )*100, 2))})
                            
                        except (ZeroDivisionError, IndexError) as e:
                            results['Status społeczny'][candidate['id']].append({"label": CustomUser.Status.labels[idx], "value": 0})
                try:      
                    results['Kandydaci'].append({"label": candidate['first_name'] + " " + candidate['last_name'], "value": round(len(vote_voters.filter(candidate=get_candidate))/sum*100, 2), "id": candidate['id']}) 
                except ZeroDivisionError:
                    results['Kandydaci'].append({"label": candidate['first_name'] + " " + candidate['last_name'], "value": 0, "id": candidate['id']}) 

            
            result = VoteResult(vote=vote, result=results)
            result.save()
            return Response(VoteResultSerializer(result).data, status=status.HTTP_201_CREATED)
            return Response(VoteResultSerializer(result).data, status=status.HTTP_200_OK)
        else:
            return Response({"result": None}, status=status.HTTP_200_OK)

class UserData(APIView):
    
    def get(self,request, format=None, **kwargs):
        user = CustomUser.objects.get(id=self.request.resolver_match.kwargs["pk"])
  
        return Response({"user": DisplayUserSerializer(user).data, "votes": []}, status=status.HTTP_200_OK)


class GetVote(APIView):
    model = Vote
    serializer_class = VoteSerializer

    def get(self, request, pk):
        vote = Vote.objects.get(id=pk)
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
            data = VoteSerializer(vote).data
            
            return Response(data, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Invalid vote id.'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        prev_vote = Vote.objects.get(id=pk)
        
        if prev_vote:
            serializer = VoteSerializer(prev_vote, request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'Invalid vote id.'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        vote = Vote.objects.get(id=pk)
        if vote:
            vote.delete()
            
            return Response({"Ok.": "Usunięto element."}, status=status.HTTP_202_ACCEPTED)
        return Response({'Bad Request': 'Invalid vote id.'}, status=status.HTTP_404_NOT_FOUND)
        
