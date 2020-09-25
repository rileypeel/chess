# piece colours
WHITE = True
BLACK = False
NO_COLOUR = 2
# piece moves
DIAGONAL_DIRECTIONS = [(-1, -1), (-1, 1), (1, -1), (1, 1)]
STRAIGHT_DIRECTIONS = [(0, -1), (0, 1), (-1, 0), (1, 0)]
KNIGHT_MOVES = [(-2, 1), (-2, -1), (1, -2), (-1, -2),
    (2, -1), (2, 1), (1, 2), (-1, 2)]
KING_MOVES = [(-1, 0), (1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (-1, 1), (1, -1)]
KINGSIDE_SQUARES = [5, 6]
QUEENSIDE_SQUARES = [1, 2, 3]

# keys for move dicts
MOVES = 'moves'
SPECIAL_MOVES = 'special_moves'
POSITION = 'position'
PIECE = 'piece'

# dict keys for special moves
TYPE = 'type'
EN_PASSANT = 'en_passant'
CASTLE = 'castle'
PAWN_PROMOTIOM = 'pawn_promotion'
REGULAR = 'regular'
ROOK = 'rook'
ROOK_TO = 'rook_to'
CAPTURE_PIECE = 'capture'

# move record accessors
COLOUR = 'colour'
FROM = 'from'
TO = 'to'
PIECE_TYPE = 'piece_type'
CAPTURED = 'captured'
FIRST_MOVE = 'first_move'
MOVE_NUMBER = 'move_number'

#game status
IN_PROGRESS = 'in_progress'
CHECKMATE = 'checkmate'
STALEMATE = 'stalemate'

# castle formatting constants
KING_FROM = 'from'
KING_TO = 'to'
ROOK_FROM = 'rook_from'
