import unittest
from tests.helpers import set_up_test_board
from chess.piece import Pawn, Position, Bishop, Knight
from chess.constants import WHITE, BLACK, TYPE, EN_PASSANT, CAPTURE_PIECE

def run_tests(test_class):
    suite = unittest.TestLoader().loadTestsFromTestCase(test_class)
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)


class TestPawn(unittest.TestCase):
    """Test suite for Pawn class"""

    def test_white_pawn_moves_from_start(self):
        """Test pawn moves returns the correct moves
        when a pawn is in the starting position"""
        pawn = Pawn(None, WHITE, Position(1, 1))
        test_board = {
            'white_pieces': [pawn]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        self.assertEqual(len(pawn.moves), 2)
        self.assertIn(Position(1, 2), pawn.moves)
        self.assertIn(Position(1, 3), pawn.moves)

    def test_white_pawn_moves_one_enemy(self):
        """Test pawn moves returns correct moves with 
        one enemy on a diagonal square"""
        pawn = Pawn(None, WHITE, Position(1, 1))
        enemy = Bishop(None, BLACK, Position(2, 2))
        test_board = {
            'white_pieces': [pawn],
            'black_pieces': [enemy]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        self.assertEqual(len(pawn.moves), 3)
        self.assertIn(Position(2, 2), pawn.moves)

    def test_white_pawn_moves_two_enemy(self):
        """Test pawn moves returns correct moves with 
        two enemies on diagonal squares"""
        pawn = Pawn(None, WHITE, Position(1, 1))
        enemy = Bishop(None, BLACK, Position(2, 2))
        enemy2 = Bishop(None, BLACK, Position(0, 2))
        test_board = {
            'white_pieces': [pawn],
            'black_pieces': [enemy, enemy2]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        self.assertEqual(len(pawn.moves), 4)
        self.assertIn(Position(2, 2), pawn.moves)
        self.assertIn(Position(0, 2), pawn.moves)

    def test_en_passant_moves_empty(self):
        """Test en passant moves empty if piece in attacked position is not a pawn"""
        black_pawn_position = Position(1, 3)
        white_knight_position = Position(0, 3)
        black_pawn = Pawn(None, BLACK, black_pawn_position)
        white_knight = Knight(None, WHITE, white_knight_position)

        test_board = {
            'white_pieces': [white_knight],
            'black_pieces': [black_pawn]
        }
        board = set_up_test_board(test_board=test_board)
        self.assertEqual(0, len(black_pawn.en_passant_moves))

    def test_en_passant_moves(self):
        """Test if conditions are met en passant moves are given in 
        proper format"""
        black_pawn_position = Position(1, 3)
        white_pawn_position = Position(0, 3)
        black_pawn = Pawn(None, BLACK, black_pawn_position)
        white_pawn = Pawn(None, WHITE, white_pawn_position)

        test_board = {
            'white_pieces': [white_pawn],
            'black_pieces': [black_pawn]
        }
        board = set_up_test_board(test_board=test_board)
        self.assertEqual(len(black_pawn.en_passant_moves), 1)
        test_en_passant_move = {
            TYPE: EN_PASSANT,
            CAPTURE_PIECE: white_pawn
        }
        en_passant_move = black_pawn.en_passant_moves
        position_key = (0, 2)
        self.assertIn(position_key, en_passant_move.keys())
        for key in test_en_passant_move.keys():
            self.assertEqual(en_passant_move[position_key][key],
                test_en_passant_move[key]
            )

if __name__ == "__main__":
    run_tests(TestPawn)