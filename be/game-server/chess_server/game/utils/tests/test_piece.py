import unittest
from tests.helpers import Board
from unittest.mock import patch
from chess.piece import Piece, Position
from chess.constants import WHITE, BLACK

def run_tests(test_class):
    suite = unittest.TestLoader().loadTestsFromTestCase(test_class)
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)


class TestPiece(unittest.TestCase):
    """Test suite for Piece class"""

    @patch('chess.board.Board')
    def test_add_list_moves_open_squares(self, board):
        """Test add_list_moves method with only open squares,
        returns the correct moves"""
        board.is_open.return_value = True
        board.is_enemy.return_value = False
        piece = Piece(board, WHITE, Position(1, 1))
        list_of_moves = [(3, 3), (1, 2)]
        moves = piece.add_list_moves(list_of_moves)
        self.assertEqual(len(moves), 2)
        for m in list_of_moves:
            m = piece.position + m
            self.assertIn(m, moves)
    
    @patch('chess.board.Board')
    def test_add_list_moves_enemy_squares(self, board):
        """Test add_list_moves method with enemies and open
        squares, returns the correct moves"""
        board.is_open.return_value = False
        board.is_enemy.return_value = True
        piece = Piece(board, WHITE, Position(1, 1))
        list_of_moves = [(3, 3), (1, 2)]
        moves = piece.add_list_moves(list_of_moves)
        self.assertEqual(len(moves), 2)
        for m in list_of_moves:
            m = piece.position + m
            self.assertIn(m, moves)

    @patch('chess.board.Board')
    def test_add_list_moves_friendly_squares(self, board):
        """Test add list moves with with friendly pieces in the way,
        returns the correct moves"""
        board.is_open.return_value = False
        board.is_enemy.return_value = False
        piece = Piece(board, WHITE, Position(1, 1))
        list_of_moves = [(3, 3), (1, 2)]
        moves = piece.add_list_moves(list_of_moves)
        self.assertEqual(len(moves), 0)

    @patch('chess.board.Board')
    def test_add_line_moves_open_squares(self, board):
        """Test add line moves with only open squers returns
        the correct moves"""
        direction = (1, 0)
        board.is_open.return_value = True
        board.is_enemy.return_value = False
        piece = Piece(board, WHITE, Position(1, 1))
        moves = piece.add_line_moves(direction)
        self.assertEqual(len(moves), 6)
        position = piece.position.copy()
        for i in range(5):
            position = position + direction
            self.assertIn(position, moves)
    
    @patch('chess.board.Board')
    def test_add_line_moves_enemy(self, board):
        """Test add line moves with enemies, returns the 
        correct moves"""
        direction = (1, 0)
        board.is_open.side_effect = [True, True, False, True]
        board.is_enemy.return_value = True
        piece = Piece(board, WHITE, Position(1, 1))
        moves = piece.add_line_moves(direction)
        self.assertEqual(len(moves), 3)
        position = piece.position.copy()
        for i in range(3):
            position = position + direction
            self.assertIn(position, moves)

    @patch('chess.board.Board')
    def test_add_line_moves_friendly(self, board):
        """Test add line moves with friendly pieces in the way
        returns the correct moves"""
        direction = (1, 0)
        board.is_open.side_effect = [True, True, False, False]
        board.is_enemy.return_value = False
        piece = Piece(board, WHITE, Position(1, 1))
        moves = piece.add_line_moves(direction)
        self.assertEqual(len(moves), 2)
        position = piece.position.copy()
        for i in range(2):
            position = position + direction
            self.assertIn(position, moves)

    
if __name__ == "__main__":
    run_tests(TestPiece)