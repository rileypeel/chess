import { EN_PASSANT, CASTLE, REGULAR } from '../constants/app'

export const isPosEqual = (p1, p2) => {
  if (!p1 || !p2) return false
  return p1.col === p2.col && p1.row === p2.row 
}
  
export const isPosIn = (pos, posArray) => {
  for (var i = 0; i < posArray.length; i++) {
    if (isPosEqual(pos, posArray[i])) {
      return true
    }
  }
  return false
} 

export const isValidMove = (pieceToMove, position) => {
  if (isPosIn(position, pieceToMove.moves)) return REGULAR
  if (pieceToMove.passant && isPosEqual(pieceToMove.passant.to, position)) return EN_PASSANT
  if (pieceToMove.castle && isPosEqual(pieceToMove.castle.to, position)) return CASTLE
  return null
}
