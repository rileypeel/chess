import unittest
from tests.helpers import set_up_test_board
from unittest.mock import patch
from chess.piece import Position, Knight, King, Rook, Bishop
from chess.constants import WHITE, BLACK, TYPE, CASTLE, ROOK, ROOK_TO

def run_tests(test_class):
    suite = unittest.TestLoader().loadTestsFromTestCase(test_class)
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)


class TestKing(unittest.TestCase):
    """Test suite for King class"""

    def test_king_moves_new_game(self):
        """Test king has no valid moves when a new game starts"""
        board = set_up_test_board(new_game=True)
        white_king = board.get_piece(Position(4, 0))
        self.assertEqual(len(white_king.moves), 0)
    
    def test_king_moves_open_board(self):
        """Test valid moves for king on an open board with no pieces"""
        white_king = King(None, WHITE, Position(4, 4))
        test_board = {
            'white_pieces': [white_king]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        self.assertEqual(len(white_king.moves), 8)
        moves = [
            Position(3, 4), Position(3, 5), Position(4, 5),
            Position(5, 5), Position(5, 4), Position(5, 3), 
            Position(4, 3), Position(3, 3)
        ]
        for m in moves: 
            self.assertIn(m, white_king.moves)

    def test_king_moves_open_board(self):
        """Test valid moves for king on an open board with no pieces"""
        white_king = King(None, WHITE, Position(4, 4))
        white_knight = Knight(None, WHITE, Position(5, 3))
        black_knight = Knight(None, BLACK, Position(3, 5))
        test_board = {
            'white_pieces': [white_king, white_knight],
            'black_pieces': [black_knight]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        self.assertEqual(len(white_king.moves), 7)
        moves = [
            Position(3, 4), Position(3, 5), Position(4, 5),
            Position(5, 5), Position(5, 4),
            Position(4, 3), Position(3, 3)
        ]
        for m in moves: 
            self.assertIn(m, white_king.moves)

    def test_castling_moves_both_sides(self):
        """Test king castling moves returns correct moves
        when castling is open on both sides"""
        king_side_rook = Rook(None, WHITE, Position(0, 0))
        queen_side_rook = Rook(None, WHITE, Position(7, 0))
        test_board = {
            'white_pieces': [king_side_rook, queen_side_rook]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        white_king = board.get_piece(Position(4, 0))
        self.assertEqual(len(white_king.castling_moves), 2)
    
    def test_castling_kingside_only(self):
        """Test castling moves only contains kingside castle, when pieces are
        in the way of a queenside castle"""
        queen_side_rook = Rook(None, WHITE, Position(0, 0))
        king_side_rook = Rook(None, WHITE, Position(7, 0))
        white_bishop = Bishop(None, WHITE, Position(2, 0))
        test_board = {
            'white_pieces': [king_side_rook, queen_side_rook, white_bishop]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        white_king = board.get_piece(Position(4, 0))
        self.assertEqual(len(white_king.castling_moves), 1)
        king_move_key = (6, 0)
        self.assertIn(king_move_key, white_king.castling_moves.keys())
        test_castle_move = {
            TYPE: CASTLE,
            ROOK: king_side_rook,
            ROOK_TO: Position(5, 0)
        }
        for key in test_castle_move.keys():
            self.assertEqual(test_castle_move[key],
                white_king.castling_moves[king_move_key][key]
            )
        
    def test_castling_moves_empty(self):
        """Test that in initial position castling moves is empty"""
        board = set_up_test_board()
        white_king = board.get_piece(Position(4, 0))
        self.assertEqual(len(white_king.castling_moves), 0)

    @patch('chess.board.Board')
    def test_castling_moves_in_check_empty(self, board):
        """Test that when king is in check castling moves is empty"""
        board.in_check.return_value = True
        white_king = King(board, WHITE, Position(4, 4))
        self.assertEqual(len(board.castle_moves), 0)

    def test_castling_moves_empty_when_attacked(self):
        """Test castling moves is empty when an enemy is attacking
        a square in between king and rook"""
        black_knight = Knight(None, BLACK, Position(2, 2))
        white_rook = Rook(None, WHITE, Position(0, 0))
        white_rook2 = Rook(None, WHITE, Position(7, 0))
        test_board = {
            'white_pieces': [white_rook, white_rook2],
            'black_pieces': [black_knight]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        white_king = board.get_piece(Position(4, 0)) 
        self.assertEqual(len(white_king.castling_moves), 1)


if __name__ == "__main__":
    run_tests(TestKing)