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
export const WS_HOST = 'ws://localhost:8000/chess-socket/'


export const WHITE = true
export const BLACK = false
export const pieces = {
  whitePawn: { type: 'pawn', symbol: 'p', image: whitePawnImg, colour: WHITE},
  whiteRook: { type: 'rook', symbol: 'R', image: whiteRookImg, colour: WHITE },
  whiteBishop: { type: 'bishop', symbol: 'B', image: whiteBishopImg, colour: WHITE },
  whiteKnight: { type: 'knight', symbol: 'K', image: whiteKnightImg, colour: WHITE},
  whiteKing: { type: 'king', symbol: 'Ki', image: whiteKingImg, colour: WHITE },
  whiteQueen: { type: 'queen', symbol: 'Q', image: whiteQueenImg, colour: WHITE },
  blackPawn: { type: 'pawn', symbol: 'p', image: blackPawnImg, colour: BLACK },
  blackRook: { type: 'rook', symbol: 'R', image: blackRookImg, colour: BLACK },
  blackBishop: { type: 'bishop', symbol: 'B', image: blackBishopImg, colour: BLACK },
  blackKnight: { type: 'knight', symbol: 'K', image: blackKnightImg, colour: BLACK},
  blackKing: { type: 'king', symbol: 'Ki', image: blackKingImg, colour: BLACK },
  blackQueen: { type: 'queen', symbol: 'Q', image: blackQueenImg, colour: BLACK }
}