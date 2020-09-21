import unittest
from tests.helpers import set_up_test_board
from chess.piece import Pawn, Position, Bishop, Rook
from chess.constants import WHITE, BLACK

def run_tests(test_class):
    suite = unittest.TestLoader().loadTestsFromTestCase(test_class)
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)


class TestBoard(unittest.TestCase):
    """Test suite for Board class"""

    def test_is_open(self):
        """Test is open returns true if square is open and 
        false otherwise"""
        pawn = Pawn(None, WHITE, Position(1, 4))
        test_board = {
            'white_pieces': [pawn]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        self.assertTrue(board.is_open(Position(1, 1)))
        self.assertFalse(board.is_open(Position(1, 4)))
    
    def test_is_enemy(self):
        """Test is enemy returns True for enemy and false otherwise"""
        pawn = Pawn(None, WHITE, Position(1, 4))
        pawn_black = Pawn(None, BLACK, Position(6, 4))
        test_board = {
            'white_pieces': [pawn], 
            'black_pieces': [pawn_black]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        self.assertTrue(board.is_enemy(Position(1, 4), BLACK))
        self.assertFalse(board.is_enemy(Position(1, 4), WHITE))
    
        self.assertTrue(board.is_enemy(Position(6, 4), WHITE))
        self.assertFalse(board.is_enemy(Position(6, 4), BLACK))
    
    def test_is_enemy_pawn(self):
        """Test is_enemy_pawn returns True if enemy pawn and 
        False otherwise"""
        black_pawn_position = Position(1, 4)
        black_rook_position = Position(2, 4) 
        black_pawn = Pawn(None, BLACK, black_pawn_position)
        black_rook = Rook(None, BLACK, black_rook_position)
        test_board = {
            'black_pieces': [black_rook, black_pawn]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)

        self.assertTrue(board.is_enemy_pawn(black_pawn_position, WHITE))
        self.assertFalse(board.is_enemy_pawn(black_rook_position, WHITE))

    def test_get_moves(self):
        """Test the get moves method returns the correct moves"""
        black_pawn = Pawn(None, BLACK, Position(2, 3))
        black_rook = Rook(None, BLACK, Position(4, 4))
        test_board = {
            'black_pieces': [black_rook, black_pawn]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        moves = board.get_moves(BLACK)

        for piece in test_board['black_pieces']:
            self.assertIn(piece, moves.keys())
    
        for move in black_pawn.moves:
            self.assertIn(move, moves[black_pawn]['moves'])

        for move in black_pawn.en_passant_moves:
            self.assertIn(move, moves[black_pawn]['special_moves'])
        
        for move in black_rook.moves:
            self.assertIn(move, moves[black_rook]['moves'])

    def test_in_check(self):
        """Test in_check returns true when king is in_check"""
        black_rook = Rook(None, BLACK, Position(4, 4))
        test_board = {
            'black_pieces': [black_rook]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        self.assertTrue(board.in_check(WHITE))

if __name__ == "__main__":
    run_tests(Testset_up_test_board)