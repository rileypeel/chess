import unittest
from tests.helpers import set_up_test_board
from chess.piece import Position, Knight
from chess.constants import WHITE, BLACK

def run_tests(test_class):
    suite = unittest.TestLoader().loadTestsFromTestCase(test_class)
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)


class TestKnight(unittest.TestCase):
    """Test suite for Knight class"""

    def test_knight_moves_new_game(self):
        """Test valid moves for a black and a white knight in starting position"""
        board = set_up_test_board(new_game=True)
        white_knight = board.get_piece(Position(1, 0))
        self.assertEqual(len(white_knight.moves), 2)
        self.assertIn(Position(0, 2), white_knight.moves)
        self.assertIn(Position(2, 2), white_knight.moves)
        black_knight = board.get_piece(Position(1, 7))
        self.assertEqual(len(black_knight.moves), 2)
        self.assertIn(Position(0, 5), black_knight.moves)
        self.assertIn(Position(2, 5), black_knight.moves)

    def test_knight_moves_open(self):
        """Test valid moves for a knight on an open board with no pieces"""
        white_knight = Knight(None, WHITE, Position(3, 3))
        test_board = {
            'white_pieces': [white_knight]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        self.assertEqual(len(white_knight.moves), 8)
        moves = [
            Position(5, 2), Position(5, 4), Position(1, 2),
            Position(1, 4), Position(4, 1), Position(4, 5),
            Position(2, 5), Position(2, 1)
        ]
        for m in moves:
            self.assertIn(m, white_knight.moves)

    def test_knight_moves_enemy_and_friendly(self):
        """Test valid moves for a knight with enemy and
        friendly pieces in attacked squares"""
        white_knight = Knight(None, WHITE, Position(3, 3))
        black_knight = Knight(None, BLACK, Position(2, 1))
        white_knight2 = Knight(None, WHITE, Position(5, 4))
        white_knight3 = Knight(None, WHITE, Position(5, 2))
        test_board = {
            'white_pieces': [white_knight, white_knight2, white_knight3],
            'black_pieces': [black_knight]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        self.assertEqual(len(white_knight.moves), 6)
        moves = [
            Position(1, 2), Position(1, 4), Position(4, 1),
            Position(4, 5), Position(2, 5), Position(2, 1)
        ]
        for m in moves:
            self.assertIn(m, white_knight.moves)


if __name__ == "__main__":
    run_tests(TestKnight)