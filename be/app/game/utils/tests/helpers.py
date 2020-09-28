from chess.piece import King, Position
from chess.constants import BLACK, WHITE
from chess.board import Board
from chess.game import Game

def set_up_test_game(board, turn=WHITE, history=None):
    """Helper method sets up a game for testing"""
    game = Game()
    game._board = board
    game._turn = turn
    if history:
        game._history.append(history)
    game.valid_moves = game.get_moves(game.turn)

    return game 

def set_up_test_board(new_game=False, test_board={}):
    """Helper method for tests to set up a board in a custom position"""
    board = Board(new_game=new_game)
    if not new_game:
        board.black_king = test_board.get('black_king', King(board, BLACK, Position(4, 7)))
        board.white_king = test_board.get('white_king', King(board, WHITE, Position(4, 0)))
        board.white_pieces = [board.white_king]
        board.black_pieces = [board.black_king]

    board.white_pieces += test_board.get('white_pieces', [])
    board.black_pieces += test_board.get('black_pieces', [])
    for piece in board.white_pieces:
        piece.board = board
    for piece in board.black_pieces:
        piece.board = board

    return board