export const CONNECT_WS = 'CONNECT_WS'
export const WS_CONNECTED = 'WS_CONNECTED'
export const DISCONNECT_WS = 'DISCONNECT_WS'
export const ACCEPT_INVITE = 'ACCEPT_INVITE'
export const DECLINE_INVITE = 'DECLINE_INVITE'
export const CONNECT_GAME_WS = 'CONNECT_GAME_WS'
export const GAME_WS_CONNECTED = 'GAME_WS_CONNECTED'
export const DISCONNECT_GAME_WS = 'DISCONNECT_GAME_WS'
export const SEND_MOVE = 'SEND_MOVE'
export const SEND_CHAT_MESSAGE = 'SEND_CHAT_MESSAGE'
export const SEND_RESIGN = 'SEND_RESIGN'

export const connectGameWS = (gameUrl) => ({ type: CONNECT_GAME_WS, gameUrl }) 
export const gameWSConnected = () => ({ type: GAME_WS_CONNECTED })
export const sendMove = (from, to) => ({ type: SEND_MOVE, from, to })
export const connectWS = host => ({ type: CONNECT_WS, host })
export const wsConnected = () => ({ type: WS_CONNECTED })
export const disconnectWS = () => ({ type: DISCONNECT_WS })
export const acceptGameInvite = inviteId => ({ type: ACCEPT_INVITE, inviteId })
export const declineGameInvite = inviteId => ({ type: DECLINE_INVITE, inviteId })