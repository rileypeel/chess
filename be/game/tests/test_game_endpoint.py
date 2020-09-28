from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from chess.constants import WHITE, BLACK, IN_PROGRESS
from core.models import Game, Player, Move
from game.serializers import GameSerializer

GAME_URL = reverse('game-list')

def get_game_detail_url(game_id):
    """Helper method for retrieving game-detail"""
    return reverse('game-detail', args=[game_id])

def sample_user(email="sample@email.ca"):
    """Helper method creates a sample user"""
    return get_user_model().objects.create(email=email, password="p12345")

def sample_game(user1, user2):
    """Helper method creates a sample game"""
    game = Game.objects.create(status=IN_PROGRESS)
    player1 = Player.objects.create(game=game, user=user1, colour=WHITE)
    player2 = Player.objects.create(game=game, user=user2, colour=BLACK)
    return game

def sample_move(game):
    """Helper method adds a move to the game"""
    pass

class PublicApiTests(TestCase):
    """Test publically available API"""

    def setUp(self):
        self.client = APIClient()

    def test_unauthorized_api(self):
        """Test using API without being authenticated fails"""
        res = self.client.get(GAME_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class UserApiTests(TestCase):
    """Test API available to authenticaed users"""

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            'jonsnow@westeros.ca',
            'ghost'
        )
        self.client.force_authenticate(self.user)

    def test_retrieving_games(self):
        """Test retrieving games for authenticated user"""
        user2 = sample_user(email='sample2@email.ca')
        user3 = sample_user(email='sample3@email.ca')
        game1 = sample_game(self.user, user2)
        game2 = sample_game(user2, user3)

        res = self.client.get(GAME_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        serializer = GameSerializer([game1], many=True)
        self.assertEqual(serializer.data, res.data)

    def test_game_detail(self):
        """Test for retrieving game detail"""
        user2 = sample_user(email='sample2@email.ca')
        game1 = sample_game(self.user, user2)
        res = self.client.get(get_game_detail_url(game1.id))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        serializer = GameSerializer(game1)
        self.assertEqual(serializer.data, res.data)

    def test_game_detail_fails(self):
        """Test that retrieving a game for another user fails"""
        user2 = sample_user(email='sample2@email.ca')
        user3 = sample_user(email='sample3@email.ca')
        game1 = sample_game(user3, user2)
        res = self.client.get(get_game_detail_url(game1.id))
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)