import unittest
from tests.helpers import set_up_test_board
from chess.piece import Position, Bishop, Rook, Queen
from chess.constants import WHITE, BLACK

def run_tests(test_class):
    suite = unittest.TestLoader().loadTestsFromTestCase(test_class)
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)


class TestQueen(unittest.TestCase):
    """Test suite for Queen class"""

    def test_queen_moves_new_game(self):
        """Test queen can't move at start of the game"""
        board = set_up_test_board(new_game=True)
        white_queen = board.get_piece(Position(3, 0))
        self.assertEqual(len(white_queen.moves), 0)

    def test_white_are_bishop_and_rook_moves(self):
        """Test that queen moves are equal to the sum of bishop and
        rook moves from the same position"""
        white_bishop = Bishop(None, WHITE, Position(4, 4))
        white_queen = Queen(None, WHITE, Position(4, 4))
        white_rook = Rook(None, WHITE, Position(4, 4))
        test_board1 = {'white_pieces': [white_bishop]}
        test_board2 = {'white_pieces': [white_rook]}
        test_board3 = {'white_pieces': [white_queen]}
        set_up_test_board(test_board=test_board1)
        set_up_test_board(test_board=test_board2)
        set_up_test_board(test_board=test_board3)
        bishop_rook_moves = white_bishop.moves + white_rook.moves

        self.assertEqual(len(bishop_rook_moves), len(white_queen.moves))
    
        for m in bishop_rook_moves:
            self.assertIn(m, white_queen.moves)
    

if __name__ == "__main__":
    run_tests(TestQueen)