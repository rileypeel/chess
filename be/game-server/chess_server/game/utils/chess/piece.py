import chess.constants as constants


class PositionOutOfBounds(Exception):
    """Custom exception thrown when trying to initialize a
    position not on the board"""
    def __init__(self, msg, position=None):
        self.msg = msg
        self.position = position

def is_valid_sum(position1, position2):
    """Check if two positions can be summed"""
    x, y = 0, 0
    for position in (position1, position2):
        if isinstance(position, Position):
            x += position.x
            y += position.y
        else:
            x += position[0]
            y += position[1]
    if x < 0 or x > 7 or y < 0 or y > 7:
        return False
    return True 

class Position:
    """A class for holding data about a pieces position on the board"""

    def __init__(self, x, y):
        """Initialize x and y location of piece"""
        self.x = x
        self.y = y

    @property
    def x(self):
        return self._x

    @property
    def y(self):
        return self._y

    @x.setter
    def x(self, x):
        self._x = self.validate_position_value(x)

    @y.setter
    def y(self, y):
        self._y = self.validate_position_value(y)

    def validate_position_value(self, value):
        """Raise PositionOutOfBounds Exception if a position value is not on the board"""
        if value < 0 or value > 7:
            raise PositionOutOfBounds(f"Position values must be between 0 and 7.") 
        return value

    @staticmethod 
    def validate_tuple(position):
        """Validate a tuple contains two integers for arithmetic operations with
        this class"""
        if isinstance(position, tuple):
            return len(position) == 2 and list(map(type, position)) == [int, int]
        return False

    def to_tuple(self):
        """Return Position data as a tuple, for dictionary keys"""
        return (self.x, self.y)

    def copy(self):
        """Return a copy of an equivalent position"""
        return Position(self.x, self.y)

    def __add__(self, other):
        """Addition between Positions and validated tuples"""
        if isinstance(other, Position):
            return Position(self.x + other.x, self.y + other.y)
        if self.validate_tuple(other):
            return Position(self.x + other[0], self.y + other[1])
        return NotImplemented

    def __radd__(self, other):
        return self + other

    def __iadd__(self, other): 
        """Implement += operator between Positions and validated tuples"""
        if isinstance(other, Position):
            self.x += other.x
            self.y += other.y
            return self
        if self.validate_tuple(other):
            self.x += other[0]
            self.y += other[1]
            return self
        return NotImplemented
        
    def __eq__(self, other):
        """If instance attributes are equal then the positions are equal,
        allows comparison with validated tuples"""
        if isinstance(other, Position):
            return other.x == self.x and other.y == self.y
        if self.validate_tuple(other):
            return self.x == other[0] and self.y == other[1]
        return NotImplemented

    def __str__(self):
        """String representation of a position"""
        return f"({self.x}, {self.y})"
    

class Piece:
    """Base class to use for chess Pieces"""

    def __init__(self, board, colour, position):
        """Initialize a Piece with a colour, Position and a reference to
        the board it is on"""
        self.board = board 
        if position and not isinstance(position, Position):
            raise TypeError("position parameter must be of type Position")
        if colour not in [constants.WHITE, constants.BLACK]:
            raise ValueError(f"colour parameter must be either {constants.WHITE} or {constants.BLACK}")
        self._colour = colour
        self._position = position

    def add_line_moves(self, direction):
        """Add moves in a straight line in the direction given,
        stop when you hit a friendly piece or an enemy,
        or the end of the board"""
        board, moves = self.board, []
        position = self.position.copy()
        while True:
            if not is_valid_sum(position, direction):
                break
            position += direction 
            if board.is_open(position):
                moves.append(position)
            elif board.is_enemy(position, self.colour):
                moves.append(position)
                break
            else: 
                break
            position = position.copy()
        return moves    

    def add_list_moves(self, possible_moves):
        """Checks each move in a list of moves, to see 
        if the position is on the board, is open, or is an
        enemy"""
        board, moves = self.board, []
        for move in possible_moves:
            position = self.position.copy()
            if is_valid_sum(position, move):
                position += move
                if board.is_open(position):
                    moves.append(position)
                if board.is_enemy(position, self.colour):
                    moves.append(position)
        return moves

    @property
    def colour_symbol(self):
        if self.colour is constants.BLACK:
            return 'b'
        return 'w'

    @property
    def colour(self):
        return self._colour

    @property
    def position(self):
        return self._position

    @position.setter
    def position(self, value):
        if value and not isinstance(value, Position):
            raise TypeError("position parameter must be of type Position")
        self._position = value


class King(Piece):
    """Class for Kings, extends Piece"""
    SYMBOL = 'Ki'

    def __init__(self, board, colour, position):
        """Override piece init, keep track of whether
        this piece has moved or not"""
        self._in_start_position = True
        super().__init__(board, colour, position)

    @property
    def in_start_position(self):
        return self._in_start_position

    @Piece.position.setter
    def position(self, value):
        """If position setter is called then set _in_start_position
        to false"""
        if value and not isinstance(value, Position):
            raise TypeError("position parameter must be of type Position")
        self._in_start_position = False
        self._position = value

    @property
    def moves(self):
        return self.add_list_moves(constants.KING_MOVES)

    @property
    def castling_moves(self):
        """Property unique to king, add castling moves"""
        return self.add_castling()

    def add_castling(self):
        """Add castling moves to a dictionary if their constraints are met"""
        castle_moves = {}
        if not self.in_start_position or self.board.in_check(self.colour):
            return castle_moves
        y = 0
        if self.colour is constants.BLACK: 
            y = 7
        king_side_rook = self.board.get_piece(Position(7, y))
        if king_side_rook:
            if self.check_castling_constraints(king_side_rook, constants.KINGSIDE_SQUARES, y):
                castle_moves[(6, y)] = {
                    constants.TYPE: constants.CASTLE,
                    constants.ROOK_TO: Position(5, y),
                    constants.ROOK: king_side_rook
                }
        queen_side_rook = self.board.get_piece(Position(0, y))
        if queen_side_rook:
            if self.check_castling_constraints(queen_side_rook, constants.QUEENSIDE_SQUARES, y):
                castle_moves[(2, y)] = {
                    constants.TYPE: constants.CASTLE,
                    constants.ROOK_TO: Position(3, y),
                    constants.ROOK: queen_side_rook
                }
        return castle_moves

    def check_castling_constraints(self, rook, x_positions, y):
        """Check to see if castling constraints are met for the 
        given rook"""
        if not rook.in_start_position:
            return False
        for x in x_positions:
            position = Position(x, y)
            if not self.board.is_open(position):
                return False
            if position in self.board.get_moves_list(not self.colour):
                return False
        return True

    def __str__(self):
        return f"{self.colour_symbol}-Ki"


class Rook(Piece):
    """Class for Rooks, extends Piece"""
    SYMBOL = 'R'

    def __init__(self, board, colour, position):
        """Override piece init to keep track of whether
        this piece has moved or not"""
        self._in_start_position = True
        super().__init__(board, colour, position)

    @property
    def in_start_position(self):
        return self._in_start_position

    @Piece.position.setter
    def position(self, value):
        """If position setter is called then set _in_start_position
        to false"""
        if value and not isinstance(value, Position):
            raise TypeError("position parameter must be of type Position")
        self._in_start_position = False
        self._position = value

    @property
    def moves(self):
        return self.straight_moves()

    def straight_moves(self):
        """Call add line moves for straight directions only"""
        moves = []
        for direction in constants.STRAIGHT_DIRECTIONS:
            moves += self.add_line_moves(direction)
        return moves

    def __str__(self):
        return f"{self.colour_symbol}-R"


class Bishop(Piece):
    """class for Bishop extends Piece"""
    SYMBOL = 'B'

    @property
    def moves(self):
        return self.diagonal_moves()

    def diagonal_moves(self):
        """Call add line moves for diagonal directions"""
        moves = []
        for direction in constants.DIAGONAL_DIRECTIONS:
            moves += self.add_line_moves(direction)	
        return moves  

    def __str__(self):
        return f"{self.colour_symbol}-B"


class Queen(Rook, Bishop):
    """class for Queens, extends Bishop and Rooks"""
    SYMBOL = 'Q'

    @property
    def moves(self):
        return self.diagonal_moves() + self.straight_moves()

    def __str__(self):
        return f"{self.colour_symbol}-Q"


class Knight(Piece):
    """Class for Knights, extends Piece"""
    SYMBOL = 'Kn'

    @property
    def moves(self):
        return self.add_list_moves(constants.KNIGHT_MOVES)

    def __str__(self):
        return f"{self.colour_symbol}-Kn"


class Pawn(Piece):
    """Class for Pawns extends Piece"""
    SYMBOL = 'P'

    def __init__(self, board, colour, position):
        self.y_direction = (0, 1)
        if colour is not constants.WHITE:
            self.y_direction = (0, -1)
        super().__init__(board, colour, position)

    @Piece.position.setter
    def position(self, value):
        """If position setter is called then set _in_start_position
        to false"""
        if value and not isinstance(value, Position):
            raise TypeError("position parameter must be of type Position")
        self._position = value

    def __str__(self):
        return f"{self.colour_symbol}-P"

    @property
    def en_passant_moves(self):
        """Return valid en passant moves for the pawn, keyed with 
        the Position of the move"""
        if ((self.colour is constants.BLACK and self.position.y != 3) or
            (self.colour is constants.WHITE and self.position.y != 4)):
            return {}

        en_passant_moves = {}
        for m in [(-1, 0), (1, 0)]:
            if is_valid_sum(self.position, m):
                attack_position = self.position + m
                enemy_pawn = None
                if self.board.is_enemy_pawn(attack_position, self.colour):
                    enemy_pawn = self.board.get_piece(attack_position)
                to_position = attack_position + self.y_direction
                if enemy_pawn:
                    en_passant_moves[to_position.to_tuple()] = {
                        constants.TYPE: constants.EN_PASSANT,
                        constants.CAPTURE_PIECE: enemy_pawn 
                    } 
        return en_passant_moves

    @property
    def moves(self):
        """Compute the possible moves a pawn can make"""
        board, moves = self.board, []
        
        if is_valid_sum(self.position, self.y_direction):
            move_one_space = self.position + self.y_direction
            if board.is_open(move_one_space):
                moves.append(move_one_space)

            if is_valid_sum(move_one_space, self.y_direction): 
                move_two_space = move_one_space + self.y_direction
                if board.is_open(move_two_space) and self.in_start_position():
                    moves.append(move_two_space) 

        for move in [(-1, self.y_direction[1]), (1, self.y_direction[1])]:
            if is_valid_sum(self.position, move):
                possible_move = self.position + move
                if board.is_enemy(possible_move, self.colour):
                    moves.append(possible_move)
            
        return moves		

    def in_start_position(self):
        """helper method to check if a pawn is in it's starting position"""
        return ((self.colour is constants.WHITE and self.position.y is 1) or
            (self.colour is constants.BLACK and self.position.y is 6))