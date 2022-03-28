from wsgiref import validate
from rest_framework import serializers

from base.user.serializers import CustomUserSerializer

from .models import CanVote, Candidate, Vote, VoteResult, VoteVoter

# class CreateVoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Votes
#         fields = ('Type', 'max_votes')


class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = ('id', 'first_name', 'last_name', 'description', 'vote')

    def patch(self, instance, validated_data):
        instance.first_name = validated_data.get(
            'first_name', instance.first_name)
        instance.last_name = validated_data.get(
            'last_name', instance.last_name)
        instance.description = validated_data.get(
            'description', instance.description)
        instance.save()
        return instance


class VoteVoterSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoteVoter
        fields = ('id', 'vote', 'voter', 'candidate')


class VoteResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoteResult
        fields = ('id', 'vote', 'results')


class AddVoteVoterSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoteVoter
        fields = ('vote', 'voter', 'candidate')


class VoteSerializer(serializers.ModelSerializer):
    candidates = CandidateSerializer(
        source='candidate_set', many=True, read_only=True)

    class Meta:
        model = Vote
        fields = ('id', 'type', 'name', 'description', 'max_votes',
                  'start_date', 'end_date', 'candidates', 'private', 'code')

    def put(self, instance, validated_data):
        instance.type = validated_data.get('type', Vote.Type == instance.type)
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get(
            'description', instance.description)
        instance.max_votes = validated_data.get(
            'max_votes', instance.max_votes)
        instance.private = validated_data.get('private', instance.private)
        instance.start_date = validated_data.get(
            'start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.save()
        return instance


class DisplayVoteSerializer(serializers.ModelSerializer):
    candidates = CandidateSerializer(
        source='candidate_set', many=True, read_only=True)
    type = serializers.CharField(source='get_type_display')
    start_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    end_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Vote
        fields = ('id', 'type', 'name', 'description', 'max_votes',
                  'start_date', 'end_date', 'candidates', 'private', 'code')


class CreateVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ('type', 'name', 'description', 'max_votes',
                  'start_date', 'end_date', 'private')


class AddCandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = ('first_name', 'last_name', 'description')


class CanVoteSerializer(serializers.ModelSerializer):
    vote_data = VoteSerializer(source='name_set', many=True, read_only=True)

    class Meta:
        model = CanVote
        fields = ('id', 'vote', 'voter', 'can_vote', 'vote_data')

    def patch(self, instance, validated_data):
        instance.can_vote = validated_data.get('can_vote', instance.can_vote)
        instance.save()
        return instance
