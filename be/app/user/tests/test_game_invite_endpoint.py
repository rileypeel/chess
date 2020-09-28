from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from core.models import GameInvite
from user.serializers import GameInviteSerializer

GAME_INVITE_URL = f'/user/invites/'

def get_game_detail_url(game_id):
    """Helper method for retrieving game-detail"""
    return reverse('game-detail', args=[game_id])

def sample_user(email="sample@email.ca"):
    """Helper method creates a sample user"""
    return get_user_model().objects.create(email=email, password="p12345")


class PublicApiTests(TestCase):
    """Test publically available API"""

    def setUp(self):
        self.client = APIClient()

    def test_unauthorized_api(self):
        """Test using API without being authenticated fails"""
        res = self.client.get(GAME_INVITE_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class GameInviteTestCase(TestCase):
    """Test API available to authenticaed users"""

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            'jonsnow@westeros.ca',
            'ghost'
        )
        self.client.force_authenticate(self.user)

    def test_retrieve_invites(self):
        """Test retrieving invites for a user is successful"""
        user2 = sample_user()
        invite1 = GameInvite.objects.create(
            from_user=self.user,
            to_user=user2, 
            game_url='fakeurl',
            message='hello want to play?'
        )
        invite2 = GameInvite.objects.create(
            from_user=user2,
            to_user=self.user, 
            game_url='fakeurl',
            message='hello want to play?'
        )
        res = self.client.get(GAME_INVITE_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        serializer = GameInviteSerializer([invite1, invite2], many=True)
        self.assertEqual(res.data, serializer.data)

    def test_post_game_invite_success(self):
        """Test posting a game invite is successful"""
        user2 = sample_user()
        payload = {
            'to_user': user2.id,
            'from_user': self.user.id,
            'message': 'hello would you like to play',
            'game_url': 'fakegameurl'
        }
        res = self.client.post(GAME_INVITE_URL, data=payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        invite = GameInvite.objects.get(to_user=user2, from_user=self.user)
        self.assertEqual(invite.message, payload['message'])
        self.assertEqual(invite.to_user, user2)
        self.assertEqual(invite.from_user, self.user)
        self.assertEqual(invite.game_url, payload['game_url'])