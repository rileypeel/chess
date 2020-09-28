import unittest
from tests.helpers import set_up_test_board
from chess.piece import Position, Bishop
from chess.constants import WHITE, BLACK
from django.test import TestCase

def run_tests(test_class):
    suite = unittest.TestLoader().loadTestsFromTestCase(test_class)
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)


class BishopTests(TestCase):
    """Tests suite for Bishop class"""

    def test_bishop_moves_new_game(self):
        """Test bishop can't move at start of the game"""
        board = set_up_test_board(new_game=True)
        white_bishop = board.get_piece(Position(2, 0))
        self.assertEqual(len(white_bishop.moves), 0)

    def test_white_bishop_moves_empty_board(self):
        """Test bishop moves returns correct moves when only
        dealing with empty squares"""
        white_bishop = Bishop(None, WHITE, Position(4, 4))
        test_board = {
            'white_pieces': [white_bishop]
        }
        board = set_up_test_board(test_board=test_board)
        self.assertEqual(len(white_bishop.moves), 13)
        moves = [
            Position(3, 5), Position(2, 6), Position(1, 7),
            Position(5, 5), Position(6, 6), Position(7, 7),
            Position(5, 3), Position(6, 2), Position(7, 1),
            Position(3, 3), Position(2, 2), Position(1, 1), Position(0, 0)
        ]
        for m in moves:
            self.assertIn(m, white_bishop.moves)

    def test_white_bishop_moves_random(self):
        """Test bishop moves returns correct moves when,
        friendlies and enemies are on it's lines"""
        white_bishop = Bishop(None, WHITE, Position(4, 4))
        board = set_up_test_board(new_game=True)
        board.white_pieces.append(white_bishop)
        white_bishop.board = board
        self.assertEqual(len(white_bishop.moves), 8)
        moves = [
            Position(3, 5), Position(2, 6),
            Position(5, 5), Position(6, 6),
            Position(5, 3), Position(6, 2),
            Position(3, 3), Position(2, 2)
        ]
        for m in moves:
            self.assertIn(m, white_bishop.moves)
    

if __name__ == "__main__":
    run_tests(TestBishop)