from chess.piece import King, Queen, Rook, Knight, Bishop, Pawn, Position
from chess.constants import WHITE, BLACK, MOVES, SPECIAL_MOVES

class InvalidMoveError(Exception):
    """Custom Exception, raised when a player makes an invalid move"""

    def __init__(self, msg, in_check=False):
        self.msg = msg
        self.in_check = in_check


class Board:
    """Board class, simulates a real chess board"""

    def __init__(self, new_game=True):
        """Initialize the board, by default initializes the board in the 
        position for a new game"""
        if new_game: 
            self.set_up_game()

    def set_up_game(self):
        """Create the pieces for a new game, store them in two lists
        white pieces and black pieces"""
        self.black_king = King(self, BLACK, Position(4, 7))
        self.white_king = King(self, WHITE, Position(4, 0))
        self.white_pieces = [self.white_king]
        self.black_pieces = [self.black_king]
        self.white_pieces.append(Queen(self, WHITE, Position(3, 0)))
        self.black_pieces.append(Queen(self, BLACK, Position(3, 7)))
        self.black_pieces.append(Rook(self, BLACK, Position(0, 7)))
        self.black_pieces.append(Rook(self, BLACK, Position(7, 7)))
        self.white_pieces.append(Rook(self, WHITE, Position(7, 0)))
        self.white_pieces.append(Rook(self, WHITE, Position(0, 0)))
        self.black_pieces.append(Bishop(self, BLACK, Position(2, 7)))
        self.black_pieces.append(Bishop(self, BLACK, Position(5, 7)))
        self.white_pieces.append(Bishop(self, WHITE, Position(2, 0)))
        self.white_pieces.append(Bishop(self, WHITE, Position(5, 0)))
        self.black_pieces.append(Knight(self, BLACK, Position(1, 7)))
        self.black_pieces.append(Knight(self, BLACK, Position(6, 7)))
        self.white_pieces.append(Knight(self, WHITE, Position(1, 0)))
        self.white_pieces.append(Knight(self, WHITE, Position(6, 0)))

        for i in range(0, 8):
            self.white_pieces.append(Pawn(self, WHITE, Position(i, 1)))
            self.black_pieces.append(Pawn(self, BLACK, Position(i, 6)))

    @property
    def white_positions(self):
        return [piece.position for piece in self.white_pieces]
    
    @property
    def black_positions(self):
        return [piece.position for piece in self.black_pieces]

    def all_piece_positions(self):
        """Return the a list of all the positions of all the pieces"""
        all_piece_positions = self.white_positions + self.black_positions
        return all_piece_positions
    
    def all_pieces(self):
        """Return a list of all the pieces"""
        all_pieces = self.white_pieces + self.black_pieces
        return all_pieces

    def is_open(self, position):
        """Return true if a square is unoccupied otherwise false"""
        return position not in self.all_piece_positions()

    def is_enemy(self, position, colour):
        """Return true is enemy is on the square position, otherwise false"""
        if colour is BLACK:
            return position in self.white_positions
        return position in self.black_positions

    def is_enemy_pawn(self, position, colour):
        """Return True if piece at position is an enemy pawn to colour"""
        return (isinstance(self.get_piece(position), Pawn) and 
            self.is_enemy(position, colour))

    def remove_piece(self, piece):
        """Remove a piece from the game"""
        piece.position = None
        if piece.colour is BLACK:
            self.black_pieces.remove(piece)
        else: self.white_pieces.remove(piece)

    def get_pieces(self, colour):
        """Get a list of the pieces of a given colour"""
        if colour is WHITE: 
            return self.white_pieces
        return self.black_pieces 

    def get_piece(self, position):
        """Returns piece at position or None"""
        all_pieces = self.all_pieces()
        for piece in all_pieces:
            if piece.position == position:
                return piece
        return None

    def get_special_moves(self, piece):
        """return special moves for given piece"""
        if isinstance(piece, Pawn):
            return piece.en_passant_moves
        if isinstance(piece, King):
            return piece.castling_moves
        return {}

    def get_moves(self, colour):
        """Get all moves for a colouf, return a dictionary, keyed by 
        the pieces themselves"""
        all_moves = {}
        pieces = self.black_pieces
        if colour is WHITE:
            pieces = self.white_pieces
        for p in pieces:
            all_moves[p] = {
                MOVES: p.moves,
                SPECIAL_MOVES: self.get_special_moves(p)
            }
        return all_moves

    def get_moves_list(self, colour):
        """Get all moves a colour can make as a list of Positions"""
        pieces = self.white_pieces
        if colour is BLACK:
            pieces = self.black_pieces
        moves_list = []
        for piece in pieces:
            moves_list += piece.moves
        return moves_list

    def add_piece(self, piece):
        """Add a piece back to the board"""
        if piece.colour is WHITE:
            self.white_pieces.append(piece)
        if piece.colour is BLACK:
            self.black_pieces.append(piece)

    def in_check(self, colour):
        """Return True if in colour side is in check otherwise False"""
        if colour is WHITE:
            return self.white_king.position in self.get_moves_list(BLACK)
        return self.black_king.position in self.get_moves_list(WHITE)

    def format_board(self):
        """Return the board representation in the natural way, 
        as a 2d list of pieces"""
        pieces = self.all_pieces()
        board = []
        for piece in pieces:
            board.append({
                'position': piece.position.to_tuple(),
                'type': piece.SYMBOL,
                'colour': piece.colour
            })
        return board