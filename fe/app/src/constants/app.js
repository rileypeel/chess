import blackBishopImg from '../pieceImages/blackBishop.png'
import blackKnightImg from '../pieceImages/blackKnight.png'
import blackRookImg from '../pieceImages/blackRook.png'
import blackQueenImg from '../pieceImages/blackQueen.png'
import blackKingImg from '../pieceImages/blackKing.png'
import whiteBishopImg from '../pieceImages/whiteBishop.png'
import whiteKnightImg from '../pieceImages/whiteKnight.png'
import whiteRookImg from '../pieceImages/whiteRook.png'
import whiteQueenImg from '../pieceImages/whiteQueen.png'
import whiteKingImg from '../pieceImages/whiteKing.png'
import whitePawnImg from '../pieceImages/whitePawn.png'
import blackPawnImg from '../pieceImages/blackPawn.png'

export const HOME = '/home'
export const LOGIN = '/login'
export const USER = '/user'
export const GAME = '/game'
export const WS_HOST = 'ws://3.129.46.53:8000/chess-socket/'

export const REGULAR = 'regular'
export const EN_PASSANT = 'en_passant'
export const CASTLE = 'castle'
export const WHITE = true
export const BLACK = false
export const pieces = {
  whitePawn: { type: 'pawn', symbol: 'p', image: whitePawnImg, colour: WHITE },
  whiteRook: { type: 'rook', symbol: 'R', image: whiteRookImg, colour: WHITE },
  whiteBishop: { type: 'bishop', symbol: 'B', image: whiteBishopImg, colour: WHITE },
  whiteKnight: { type: 'knight', symbol: 'K', image: whiteKnightImg, colour: WHITE },
  whiteKing: { type: 'king', symbol: 'Ki', image: whiteKingImg, colour: WHITE },
  whiteQueen: { type: 'queen', symbol: 'Q', image: whiteQueenImg, colour: WHITE },
  blackPawn: { type: 'pawn', symbol: 'p', image: blackPawnImg, colour: BLACK },
  blackRook: { type: 'rook', symbol: 'R', image: blackRookImg, colour: BLACK },
  blackBishop: { type: 'bishop', symbol: 'B', image: blackBishopImg, colour: BLACK },
  blackKnight: { type: 'knight', symbol: 'K', image: blackKnightImg, colour: BLACK},
  blackKing: { type: 'king', symbol: 'Ki', image: blackKingImg, colour: BLACK },
  blackQueen: { type: 'queen', symbol: 'Q', image: blackQueenImg, colour: BLACK }
}

export const pieceBySymbol = {
  'p': {
    [WHITE]: { type: 'pawn', symbol: 'p', image: whitePawnImg, colour: WHITE },
    [BLACK]: { type: 'pawn', symbol: 'p', image: blackPawnImg, colour: BLACK }
  },
  'R': {
    [WHITE]: { type: 'rook', symbol: 'R', image: whiteRookImg, colour: WHITE },
    [BLACK]: { type: 'rook', symbol: 'R', image: blackRookImg, colour: BLACK }
  },
  'N': {
    [WHITE]: { type: 'knight', symbol: 'N', image: whiteKnightImg, colour: WHITE },
    [BLACK]: { type: 'knight', symbol: 'N', image: blackKnightImg, colour: BLACK }
  },
  'B': {
    [WHITE]: { type: 'bishop', symbol: 'B', image: whiteBishopImg, colour: WHITE },
    [BLACK]: { type: 'bishop', symbol: 'B', image: blackBishopImg, colour: BLACK }
  },
  'Q': {
    [WHITE]: { type: 'queen', symbol: 'Q', image: whiteQueenImg, colour: WHITE },
    [BLACK]: { type: 'queen', symbol: 'Q', image: blackQueenImg, colour: BLACK }
  },
  'K': {
    [WHITE]: { type: 'king', symbol: 'K', image: whiteKingImg, colour: WHITE },
    [BLACK]: { type: 'king', symbol: 'K', image: blackKingImg, colour: BLACK }
  }
  
}

// WS receive message types
export const START_TURN = 'start_turn'
export const LOAD_GAME = 'load_game'
export const LOAD_MOVES = 'load_moves'
export const LOAD_MESSAGES = 'load_messages'
export const OPPONENT_MESSAGE = 'opponent_message'
export const OPPONENT_MOVE = 'opponent_move'
export const GAME_STATUS_UPDATE = 'status_update'
export const INVITE_RECEIVED = 'invite_received'
export const INVITE_UPDATE = 'invite_update'
export const ERROR = 'client_error'
export const START_GAME = 'start_game'
export const UPDATE_TIME = 'update_time'
export const LOAD_BOARD = 'load_board'

//WS send message type
export const SEND_MESSAGE = 'my_message'
export const MOVE = 'game_my_move'
export const CHAT_MESSAGE = 'game_my_message'
export const ACCEPT_INVITE = 'invite_accepted'
export const INVITE_RESPONSE = 'invite_response'
export const MOVE_RESPONSE = 'move_response'
export const REQUEST_UPDATE_TIME = 'game_update_time'
export const GAME_RESIGN = 'game_resign'

//notification removed by
export const CLICK = 'click'

//timer keys 
export const OPPONENT = 'opponent'
export const ME = 'me'

export const RESIGN = 'resign'
export const CHECKMATE = 'checkmate'
export const STALEMATE = 'stalemate'
export const TIMEOUT = 'timeout'