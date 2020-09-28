import unittest, pytest
from tests.helpers import set_up_test_board, set_up_test_game
from unittest.mock import patch
from chess.piece import Pawn, Position, Bishop, King, Rook, Queen, Pawn, Knight
from chess.board import InvalidMoveError
import chess.constants as constants
from chess.game import Game

def run_tests(test_class):
    suite = unittest.TestLoader().loadTestsFromTestCase(test_class)
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)

def get_pawn_move_record_passant(white_position, from_position):
    move_record = {
        constants.COLOUR: constants.WHITE,
        constants.FROM: Position(0, 1),
        constants.TO: white_position,
        constants.PIECE_TYPE: Pawn,
        constants.CAPTURED: Pawn,
        constants.TYPE: constants.EN_PASSANT,
        constants.FIRST_MOVE: True
    }
    return move_record


class TestGame(unittest.TestCase):
    """Test suite for Game class"""

    @patch('chess.board.Board')
    def test_is_valid_passant(self, board):
        white_pawn_position = Position(3, 3)
        black_pawn_position = Position(4, 3)
        black_pawn = Pawn(board, constants.BLACK, black_pawn_position)
        white_pawn = Pawn(board, constants.WHITE, white_pawn_position)
        game = Game()
        game._board = board
        en_passant_move = Position(3, 2)
        game._history.append({
            constants.COLOUR: white_pawn.colour,
            constants.FROM: Position(3, 1),
            constants.TO: white_pawn.position,
            constants.PIECE_TYPE: type(white_pawn),
            constants.CAPTURED: None,
            constants.TYPE: constants.EN_PASSANT,
            constants.FIRST_MOVE: True
        })
        board.get_piece.return_value = white_pawn
        board.in_check.return_value = True
        self.assertFalse(game.is_valid_passant(black_pawn, en_passant_move, white_pawn))
        self.assertEqual(white_pawn.position, white_pawn_position)
        self.assertEqual(black_pawn.position, black_pawn_position)
        board.in_check.return_value = False
        self.assertTrue(game.is_valid_passant(black_pawn, en_passant_move, white_pawn))
        self.assertEqual(white_pawn.position, white_pawn_position)
        self.assertEqual(black_pawn.position, black_pawn_position)
        game._history[0][constants.FIRST_MOVE] = False
        self.assertFalse(game.is_valid_passant(black_pawn, en_passant_move, white_pawn))
        game._history[0][constants.FIRST_MOVE] = True
        board.get_piece.return_value = Rook(board, constants.BLACK, Position(1, 1))
        self.assertFalse(game.is_valid_passant(black_pawn, en_passant_move, white_pawn))

    @patch('chess.board.Board')
    def test_try_move_with_capture(self, board):
        white_rook_position = Position(4, 4)
        white_rook = Rook(board, constants.WHITE, white_rook_position)
        to_position = Position(5, 4)
        black_rook = Rook(board, constants.BLACK, to_position)
        board.in_check.return_value = False
        game = Game()
        game._board = board
        self.assertTrue(game.try_move(white_rook, to_position))
        self.assertEqual(white_rook.position, white_rook_position)
        self.assertEqual(black_rook.position, to_position)
        board.in_check.return_value = True
        self.assertFalse(game.try_move(white_rook, to_position))
        self.assertEqual(white_rook.position, white_rook_position)
        self.assertEqual(black_rook.position, to_position)

    @patch('chess.board.Board')
    def test_try_move_without_capture(self, board):
        rook_position = Position(4, 4)
        rook = Rook(board, constants.WHITE, rook_position)
        board.in_check.return_value = False
        game = Game()
        game._board = board
        self.assertTrue(game.try_move(rook, Position(5, 4)))
        self.assertEqual(rook.position, rook_position)
        board.in_check.return_value = True
        self.assertFalse(game.try_move(rook, Position(5, 4)))
        self.assertEqual(rook.position, rook_position)

    @patch('chess.game.Game.try_move')
    @patch('chess.board.Board')
    def test_get_moves_no_special(self, board, try_move):

        invalid_position = Position(3, 3)
        def my_side_effect(*args):
            if args[1] == invalid_position:
                return False
            return True

        try_move.side_effect = my_side_effect
        game = Game()
        game._board = board
        rook = Rook(board, constants.WHITE, Position(4, 4))
        bishop = Bishop(board, constants.WHITE, Position(1, 1))
        knight = Knight(board, constants.WHITE, Position(7, 0))
        mocked_board_moves = {
            rook: {
                constants.MOVES: [Position(5, 4), Position(3, 4)],
                constants.SPECIAL_MOVES: {}
            },
            bishop: {
                constants.MOVES: [Position(2, 2), invalid_position],
                constants.SPECIAL_MOVES: {}
            },
            knight: {
                constants.MOVES: [],
                constants.SPECIAL_MOVES: {}
            }
        }
        valid_moves = {
            rook: {
                constants.MOVES: [Position(5, 4), Position(3, 4)],
                constants.SPECIAL_MOVES: {}
            },
            bishop: {
                constants.MOVES: [Position(2, 2)],
                constants.SPECIAL_MOVES: {}
            },
            knight: {
                constants.MOVES: [],
                constants.SPECIAL_MOVES: {}
            }
        }
        board.get_moves.return_value = mocked_board_moves
        all_game_moves = game.get_moves(constants.WHITE)
        self.assertEqual(len(mocked_board_moves), len(all_game_moves))
        for key in valid_moves.keys():
            self.assertIn(key, all_game_moves)
            self.assertEqual(len(valid_moves[key]), len(all_game_moves[key]))
            for move in mocked_board_moves[key]:
                self.assertIn(move, all_game_moves[key])
        self.assertEqual(game.status, constants.IN_PROGRESS)

    @patch('chess.board.Board')
    def test_get_moves_with_passant(self, board):
        pass #TODO maybe these should work fine anyways

    @patch('chess.board.Board')
    def test_get_moves_with_castle(self, board):
        pass
    
    @patch('chess.game.Game.try_move')
    @patch('chess.board.Board')
    def test_get_moves_checkmate(self, board, try_move):
        try_move.return_value = True
        game = Game()
        game._board = board
        mocked_board_moves = {}
        board.in_check.return_value = True
        board.get_moves.return_value = mocked_board_moves
        all_game_moves = game.get_moves(constants.WHITE)
        self.assertEqual(game.status, constants.CHECKMATE)

    @patch('chess.game.Game.try_move')
    @patch('chess.board.Board')
    def test_get_moves_stalemate(self, board, try_move):
        try_move.return_value = True
        game = Game()
        game._board = board
        mocked_board_moves = {}
        board.in_check.return_value = False
        board.get_moves.return_value = mocked_board_moves
        all_game_moves = game.get_moves(constants.WHITE)
        self.assertEqual(game.status, constants.STALEMATE)

    @patch('chess.board.Board')
    def test_player_move_fails_wrong_turn(self, board):
        rook_position = Position(1, 1)
        board.get_piece.return_value = Rook(board, constants.BLACK, rook_position)
        game = Game()
        game._board = board
        game._turn = constants.WHITE
        with pytest.raises(InvalidMoveError):
            game.player_move(rook_position, Position)

    @patch('chess.board.Board')
    def test_player_move_fails_no_piece(self, board):
        board.get_piece.return_value = None
        game = Game()
        game._board = board
        with pytest.raises(InvalidMoveError):
            game.player_move(Position(1, 1), Position(2, 2))


    @patch('chess.game.Game.get_moves')
    @patch('chess.board.Board')
    def test_player_move_fails_invalid_move(self, board, mock_get_moves):
        rook_position = Position(1, 1)
        rook = Rook(board, constants.WHITE, rook_position)
        board.get_piece.return_value = rook

        mock_get_moves.return_value = {
            rook: {
                constants.MOVES: [Position(0, 1), Position(1, 2)],
                constants.SPECIAL_MOVES: {}
            } 
        }
        game = Game()
        game._board = board
        with pytest.raises(InvalidMoveError):
            game.player_move(rook.position, Position(2, 2))


    @patch('chess.game.Game.get_moves')
    def test_player_move_success(self, mock_get_moves):
        rook_position = Position(1, 1)
        rook = Rook(None, constants.WHITE, rook_position)
        test_board = {'black_pieces': [rook]}
        mock_get_moves.return_value = {
            rook: {
                constants.MOVES: [Position(0, 1), Position(1, 2), Position(2, 2)],
                constants.SPECIAL_MOVES: {}
            } 
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        game = Game()
        game._board = board
        game.player_move(rook.position, Position(2, 2))
        self.assertEqual(rook.position, Position(2, 2))

    # these tests are not unit tests, they depend on everything working properly
    
    def test_player_move_en_passant(self):
        """Test calling making an en passant move is successful if valid"""
        white_position = Position(0, 3)
        black_position = Position(1, 3)
        white_pawn = Pawn(None, constants.WHITE, white_position)
        black_pawn = Pawn(None, constants.BLACK, black_position)
        test_board = {
            'white_pieces': [white_pawn],
            'black_pieces': [black_pawn]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        
        game = set_up_test_game(
            board,
            turn=constants.BLACK,
            history=get_pawn_move_record_passant(white_position, Position(0, 1))
        )
        en_passant_position = Position(0, 2)
        game.player_move(black_position, en_passant_position)
        self.assertEqual(black_pawn.position, en_passant_position)
        self.assertIsNone(white_pawn.position)
        self.assertNotIn(white_pawn, board.white_pieces)
    
    def test_player_move_en_passant_fails(self):
        """Test calling making an en passant move is fails when not valid"""
        white_position = Position(0, 3)
        black_position = Position(1, 3)
        white_rook = Rook(None, constants.WHITE, white_position)
        black_pawn = Pawn(None, constants.BLACK, black_position)
        test_board = {
            'white_pieces': [white_rook],
            'black_pieces': [black_pawn]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        game = set_up_test_game(
            board,
            turn=constants.BLACK,
            history=get_pawn_move_record_passant(white_position, Position(0, 1))
        )
        en_passant_position = Position(0, 2)
        with pytest.raises(InvalidMoveError):
            game.player_move(black_position, en_passant_position)

    def test_player_move_fails_into_check(self):
        """Test trying to make a move into check fails"""
        white_rook_position = Position(4, 1)
        black_rook = Rook(None, constants.BLACK, Position(4, 5))
        white_rook = Rook(None, constants.WHITE, white_rook_position)

        test_board = {
            'white_pieces': [white_rook],
            'black_pieces': [black_rook]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        game = set_up_test_game(board)
        with pytest.raises(InvalidMoveError):
            game.player_move(white_rook_position, Position(2, 1))

    def test_player_move_already_in_check_fails(self):
        """Test trying to move when you're in check and still in check
        after the move fails"""
        white_bishop_position = Position(3, 3)
        black_rook = Rook(None, constants.BLACK, Position(4, 5))
        white_bishop = Rook(None, constants.WHITE, white_bishop_position)

        test_board = {
            'white_pieces': [white_bishop],
            'black_pieces': [black_rook]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        game = set_up_test_game(board)
        with pytest.raises(InvalidMoveError):
            game.player_move(white_bishop_position, Position(6, 6))
        
    def test_pawn_promotion(self):
        """Test when a pawn reaches the end of the board that it is promoted
        to a queen"""
        white_pawn_position = Position(0, 6)
        end_position = Position(0, 7)
        white_pawn = Pawn(None, constants.WHITE, white_pawn_position)

        test_board = {
            'white_pieces': [white_pawn]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        game = set_up_test_game(board)
        game.player_move(white_pawn_position, end_position)
        self.assertIsNone(white_pawn.position)
        self.assertNotIn(white_pawn, board.white_pieces)
        queen = board.get_piece(end_position)
        self.assertTrue(isinstance(queen, Queen))

    def test_player_move_castle_success(self):
        """Test player move castling is successful when it is a valid move"""

        white_rook_position = Position(0, 0)
        white_rook = Rook(None, constants.WHITE, white_rook_position)
        test_board = {
            'white_pieces': [white_rook]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        game = set_up_test_game(board)
        game.player_move(Position(4, 0), Position(2, 0))
        self.assertEqual(white_rook.position, Position(3, 0))
        self.assertTrue(isinstance(board.get_piece(Position(2, 0)), King))

    def test_player_move_castle_fails(self):
        """Test castling fails when a position in between king and rook is attacked"""
        white_rook_position = Position(0, 0)
        black_rook = Rook(None, constants.BLACK, Position(2, 5))
        white_rook = Rook(None, constants.WHITE, white_rook_position)
        test_board = {
            'white_pieces': [white_rook],
            'black_pieces': [black_rook]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        game = set_up_test_game(board)
        with pytest.raises(InvalidMoveError):
            game.player_move(Position(4, 0), Position(2, 0))
        self.assertEqual(white_rook.position, white_rook_position)
        self.assertTrue(isinstance(board.get_piece(Position(4, 0)), King))
        
    def test_player_move_capture_success(self):
        """Test a basic capture of a piece works as expected"""
        white_rook_position = Position(2, 0)
        black_rook_position = Position(2, 5)
        black_rook = Rook(None, constants.BLACK, black_rook_position)
        white_rook = Rook(None, constants.WHITE, white_rook_position)
        test_board = {
            'white_pieces': [white_rook],
            'black_pieces': [black_rook]
        }
        board = set_up_test_board(new_game=False, test_board=test_board)
        game = set_up_test_game(board)

        game.player_move(white_rook_position, black_rook_position)
        self.assertEqual(white_rook.position, black_rook_position)
        self.assertIsNone(black_rook.position)
        self.assertNotIn(black_rook, board.black_pieces)
    
    def test_player_move_fails_not_in_progress(self):
        """Test exception is thrown if the game is over and 
        a player tries to move"""
        game = Game()
        game._status = constants.CHECKMATE

        with pytest.raises(InvalidMoveError):
            game.player_move(Position(0, 1), Position(0, 2))

if __name__ == "__main__":
    run_tests(TestGame)