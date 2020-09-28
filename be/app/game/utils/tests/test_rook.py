import unittest
from tests.helpers import set_up_test_board
from chess.piece import Position, Rook
from chess.constants import WHITE, BLACK

def run_tests(test_class):
    suite = unittest.TestLoader().loadTestsFromTestCase(test_class)
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)


class TestRook(unittest.TestCase):
    """Test suite for Rook class"""

    def test_rook_moves_new_game(self):
        """Test rook can't move at start of the game"""
        board = set_up_test_board(new_game=True)
        white_rook = board.get_piece(Position(0, 0))
        self.assertEqual(len(white_rook.moves), 0)

    def test_white_rook_moves_empty_board(self):
        """Test rook moves returns correct moves when only
        dealing with empty squares"""
        white_rook = Rook(None, WHITE, Position(4, 4))
        test_board = {
            'white_pieces': [white_rook]
        }
        board = set_up_test_board(test_board=test_board)
        self.assertEqual(len(white_rook.moves), 13)
        moves = [
            Position(5, 4), Position(6, 4), Position(7, 4),
            Position(3, 4), Position(2, 4), Position(1, 4),
            Position(0, 4), Position(4, 5), Position(4, 6),
            Position(4, 7), Position(4, 3), Position(4, 2),
            Position(4, 1)
        ]
        for m in moves:
            self.assertIn(m, white_rook.moves)

    def test_white_rook_moves_random(self):
        """Test bishop moves returns correct moves when,
        friendlies and enemies are on it's lines"""
        white_rook = Rook(None, WHITE, Position(4, 4))
        board = set_up_test_board(new_game=True)
        board.white_pieces.append(white_rook)
        white_rook.board = board
        self.assertEqual(len(white_rook.moves), 11)
        moves = [
            Position(4, 5), Position(4, 6), Position(4, 3),
            Position(4, 2), Position(5, 4), Position(6, 4),
            Position(7, 4), Position(3, 4), Position(2, 4),
            Position(1, 4), Position(0, 4)
        ]
        for m in moves:
            self.assertIn(m, white_rook.moves)
    

if __name__ == "__main__":
    run_tests(TestRook)