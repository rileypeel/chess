from unittest.mock import patch
import core.models as models
from chess.piece import Pawn
from chess.constants import CHECKMATE, STALEMATE, IN_PROGRESS, WHITE, BLACK, REGULAR
from django.test import TestCase


def sample_user(email="sample@sample.ca"):
    """Helper method for tests, creates and returns a sample user"""
    new_user = models.User.objects.create(email=email, password='password123')
    return new_user

def create_sample_move(game):
    """Helper method creates a sample move for a game"""
    models.Move.objects.create(
        game=game,
        colour=WHITE, 
        move_number=1,
        from_position_x=4,
        from_position_y=1,
        to_position_x=4,
        to_position_y=3,
        move_type=REGULAR,
        piece_type=Pawn.SYMBOL,
        captured_piece_type=None
    )


class TestModels(TestCase):
    """Tests methods for saving games in the db"""

    def test_game_save_winner_set(self):
        """Test that when a game's status is changed to checkmate the winner is 
        automatically set"""
        game = models.Game(status=IN_PROGRESS)
        game.save()
        player1 = models.Player(game=game, user=sample_user(), colour=WHITE)
        player1.save()
        player2 = models.Player(
            game=game,
            user=sample_user("sample2@sample.ca"),
            colour=BLACK
        )
        create_sample_move(game)
        player2.save()
        game.status = CHECKMATE
        game.save()
        player1.refresh_from_db()
        self.assertTrue(player1.winner)
        player2.refresh_from_db()
        self.assertFalse(player2.winner)

    @patch('core.models.User.update_rating')
    def test_save_game_update_rating(self, update_rating):
        """Test that update_rating is called correctly when a game is saved"""
        game = models.Game(status=IN_PROGRESS)
        game.save()
        player1 = models.Player(game=game, user=sample_user(), colour=WHITE)
        player1.save()
        player2 = models.Player(
            game=game,
            user=sample_user("sample2@sample.ca"),
            colour=BLACK
        )
        create_sample_move(game)
        player2.save()
        game.status = CHECKMATE
        game.save()
        
        update_rating.assert_any_call(CHECKMATE, True, 1200)
        update_rating.assert_any_call(CHECKMATE, False, 1200)
        self.assertEqual(update_rating.call_count, 2)