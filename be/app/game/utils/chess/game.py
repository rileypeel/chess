from chess.board import Board, InvalidMoveError
from chess.piece import King, Pawn, Position, Queen, Pawn
import chess.constants as constants
from copy import deepcopy


class Game:
    """"A class which provides all the methods and objects for playing a game of chess"""
    
    def __init__(self, new_game=True):
        """Initialize a Game instance with a board instance, a turn attribute
        to keep track of who's turn it is, and a history list to keep track of all 
        moves that happen"""
        self._board = Board(new_game=new_game)
        self._turn = constants.WHITE
        self._history = []
        self._status = constants.IN_PROGRESS 
        self.valid_moves = self.get_moves(constants.WHITE)
        self.move_number = 1

    @property 
    def board(self):
        return self._board

    @property
    def status(self):
        return self._status

    @property
    def history(self):
        return self._history

    @property
    def turn(self):
        return self._turn

    def load_move(self, move):
        """
        Load a move into a game
        """
        # TODO 
        # for now just call player_move
        move_from = Position(move.from_position_x, move.from_position_y)
        move_to = Position(move.to_position_x, move.to_position_y)
        colour = move.colour
        self.player_move(move_from, move_to, colour)

    def get_moves(self, colour):
        """Returns all the valid moves a player can make"""
        board_moves = self.board.get_moves(colour)
        pieces = list(board_moves.keys())
        no_moves = True
        for piece in pieces:
            moves = board_moves[piece][constants.MOVES]
            for move in deepcopy(moves): 
                if not self.try_move(piece, move):
                    moves.remove(move)

            special_moves = board_moves[piece][constants.SPECIAL_MOVES]
            for key in deepcopy(list(special_moves.keys())):
                move = Position(key[0], key[1])
                move_type = special_moves[key].get(constants.TYPE, None)
                if move_type is constants.EN_PASSANT:
                    if not self.is_valid_passant(piece, move, special_moves[key][constants.CAPTURE_PIECE]):
                        special_moves.pop(key)
                elif move_type is constants.CASTLE:
                    if not self.try_move(piece, move):
                        special_moves.pop(key)
            if moves or special_moves:
                no_moves = False
        
        if no_moves:
            if self.board.in_check(colour):
                self._status = constants.CHECKMATE
            else:
                self._status = constants.STALEMATE
        return board_moves

    def try_move(self, piece, to_position):
        """Try moving piece to to_position to see if such a move 
        is valid"""
        move_is_valid = True
        piece_to_capture = self.board.get_piece(to_position)
        from_position = piece.position
        in_start = getattr(piece, '_in_start_position', False)
        piece.position = to_position

        if piece_to_capture:
            self.board.remove_piece(piece_to_capture)

        if self.board.in_check(piece.colour):
            move_is_valid = False

        if piece_to_capture:
            piece_to_capture.position = to_position
            self.board.add_piece(piece_to_capture)
        piece.position = from_position
        piece._in_start_position = in_start
        return move_is_valid

    def is_valid_passant(self, piece, to_position, capture_pawn):
        """Check if the conditions for en passant are met"""
        is_valid = True
        if not self.history:
            return False
        last_move = self.history[-1]
        last_move_piece = self.board.get_piece(last_move[constants.TO])
        if not last_move[constants.FIRST_MOVE] or last_move_piece is not capture_pawn:
            return False

        capture_pawn_from = capture_pawn.position
        self.board.remove_piece(capture_pawn)
        capture_pawn.position = None
        from_position = piece.position
        piece.position = to_position

        if self.board.in_check(piece.colour):
            is_valid = False

        self.board.add_piece(capture_pawn)
        capture_pawn.position = capture_pawn_from
        piece.position = from_position
        return is_valid

    def is_pawn_promotion(self, piece, to_position):
        """Check if a pawn should be promoted"""
        if not isinstance(piece, Pawn):
            return False
        if to_position.y is 0 or to_position.y is 7:
            return True
        return False

    def move_piece(self, piece_to_move, to_position, move_type):
        """Update the pieces position add a new move record"""

        from_position = piece_to_move.position
        piece_to_capture = self.board.get_piece(to_position)

        if move_type is constants.CASTLE:
            castle_move = piece_to_move.castling_moves[to_position.to_tuple()]
            rook = castle_move[constants.ROOK]
            rook_to_position = castle_move[constants.ROOK_TO]
            rook_from_position = rook.position
            rook.position = rook_to_position
            
        if move_type is constants.EN_PASSANT:
            en_passant_move = piece_to_move.en_passant_moves[to_position.to_tuple()]
            piece_to_capture = en_passant_move[constants.CAPTURE_PIECE]
        
        piece_to_move.position = to_position
        if piece_to_capture:
            if isinstance(piece_to_capture, King): 
                raise InvalidMoveError("You cannot capture the King")
            self.board.remove_piece(piece_to_capture)
            piece_to_capture.position = None

        move_record = {
            constants.MOVE_NUMBER: self.move_number,
            constants.COLOUR: piece_to_move.colour,
            constants.FROM: from_position,
            constants.TO: to_position,
            constants.PIECE: piece_to_move,
            constants.CAPTURED: piece_to_capture,
            constants.TYPE: move_type,
            constants.FIRST_MOVE: getattr(piece_to_move, 'in_start_position', None)
        }
        self.move_number += 1
        self._history.append(move_record)
        if self.is_pawn_promotion(piece_to_move, to_position): 
            move_record[constants.TYPE] = constants.PAWN_PROMOTIOM
            new_queen = Queen(self.board, piece_to_move.colour, piece_to_move.position)
            piece_to_move.position = None
            self.board.remove_piece(piece_to_move)
            self.board.add_piece(new_queen)

    def player_move(self, from_position, to_position, colour=constants.NO_COLOUR):
        """Player calls this method to make a move, either an exception is 
        raised or the move is completed."""

        if self.status != constants.IN_PROGRESS:
            raise InvalidMoveError("Game is over")

        piece = self.board.get_piece(from_position)
        if not piece:
            raise InvalidMoveError(f"There is no piece at position {from_position}")

        if colour != constants.NO_COLOUR:
            if colour != self.turn:
                raise InvalidMoveError("Not your turn")
            if colour != piece.colour:
                raise InvalidMoveError("Not your piece!")

        if self.turn is not piece.colour: 
            raise InvalidMoveError("It ain't your turn!")

        moves = self.valid_moves[piece][constants.MOVES]
        special_moves = self.valid_moves[piece][constants.SPECIAL_MOVES]
        move_type = constants.REGULAR
        if to_position not in moves:
            if to_position.to_tuple() not in special_moves.keys():
                raise InvalidMoveError("Error, invalid move for the piece was given.")
            move_type = special_moves[to_position.to_tuple()]['type']
        self.move_piece(piece, to_position, move_type)
        self._turn = not self.turn
        self.valid_moves = self.get_moves(self.turn)

    def format_moves(self):
        """Return valid moves formatted for JSON to send to client"""
        formatted_moves = []
        for piece in self.valid_moves.keys():
            formatted_moves.append({
                constants.PIECE: str(piece),
                constants.POSITION: piece.position.to_tuple(),
                constants.MOVES: [move.to_tuple() for move in self.valid_moves[piece]['moves']],
                constants.SPECIAL_MOVES: self.format_special_moves(piece)
            })  
        return formatted_moves

    def format_special_moves(self, piece):
        """Format for special moves"""
        formatted_special_moves = []
        for move in self.valid_moves[piece][constants.SPECIAL_MOVES].keys():
            move_info = self.valid_moves[piece][constants.SPECIAL_MOVES][move]
            if move_info[constants.TYPE] == constants.CASTLE:
                formatted_castle = {
                    constants.TYPE: constants.CASTLE,
                    constants.ROOK_TO: move_info[constants.ROOK_TO].to_tuple(),
                    constants.ROOK_FROM: move_info[constants.ROOK].position.to_tuple(),
                    constants.KING_FROM: piece.position.to_tuple(),
                    constants.KING_TO: move
                }
                formatted_special_moves.append(formatted_castle)
            elif move_info[constants.TYPE] == constants.EN_PASSANT:
                formatted_passant = {
                    constants.TYPE: constants.EN_PASSANT,
                    constants.FROM: piece.position.to_tuple(),
                    constants.TO: move,
                    constants.CAPTURE_PIECE: move_info[constants.CAPTURE_PIECE].position.to_tuple()
                }
                formatted_special_moves.append(formatted_passant)
            elif move_info[constants.TYPE] == constants.PAWN_PROMOTIOM:
                #TODO pass this for now
                pass
            return formatted_special_moves


if __name__ == '__main__':
    game = Game()

    
