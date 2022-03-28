
from django.urls import path

from base.auth.viewsets.blacklist import BlacklistTokenUpdateViewSet
from .views import AddCandidateView, CanVoteRequest, CandidatesView, GetCandidate, PendingCanVoteRequest, Profile, Results, UserData, VoteView, CreateVoteView, GetVote, VoteList, VoteVoterList, AddVoteVoterView, EndedVoteList

urlpatterns = [
    path('vote/', VoteView.as_view()),
    path('votes/', VoteList.as_view()),
    path('user_data/<int:pk>', UserData.as_view()),
    path('profile/<int:pk>', Profile.as_view()),
    path('results/<int:pk>', Results.as_view()),
    path('auth/blacklist', BlacklistTokenUpdateViewSet.as_view()), #not tested
    path('submit_vote/', AddVoteVoterView.as_view()),
    path('vote_voter', VoteVoterList.as_view()),
    path('finished_votes', EndedVoteList.as_view()),
    path('candidates/', CandidatesView.as_view()),
    path('create-vote', CreateVoteView.as_view()),
    path('get-vote/<int:pk>', GetVote.as_view()),
    path('can-vote', CanVoteRequest.as_view()),
    path('can-vote/<int:pk>', PendingCanVoteRequest.as_view()),
    path('get-candidate/<int:pk>', GetCandidate.as_view()),
    path('add_candidate/<int:vote_id>', AddCandidateView.as_view()), 
]
