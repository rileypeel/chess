const boardElement = document.querySelector("#board")
var selectedSquare = null
var myTurn = false
const gameStatusElement = document.querySelector("#game-status")
const turnElement = document.querySelector("#turn")
const colorElement = document.querySelector("#my-colour")
var lastMove = null

const drawBoard = () => {
    for (var j = 0; j < 8; j++) {
        var row = document.createElement("div")
        row.className = "row"
        row.id = `row-${j}`
        boardElement.appendChild(row)
        drawRowOfSquares(row, j)
    }
}

const drawRowOfSquares = (row, rowNumber) => {
    for (var j = 0; j < 8; j++) {
        var square = document.createElement("div")
        square.className = "square"
        square.id = `row${rowNumber}-col${j}`
        square.onclick = squareClick
        row.appendChild(square)
    }
}

const getSquareAt = (row, col) => {
    var square = document.getElementById(`row${row}-col${col}`)
    return square
}

const drawPieces = (board) => {
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            square = getSquareAt(i, j)
            symbol = ''
            if (board[i][j] != 0) {
                symbol = board[i][j]
            }
            square.innerText = symbol
        }
    }
}

const parsePosition = (squareNode) => {
    nodeId = squareNode.id
    row = parseInt(nodeId.charAt(3))
    col = parseInt(nodeId.charAt(8))
    return [col, row]
}

const unmove = () => {
    lastMove['to'].innerText = lastMove['capture']
    lastMove['from'].innerText = lastMove['piece']
    lastMove = null
}

const move = (fromElement, toElement) => {
    lastMove = {
        to: toElement,
        from: fromElement,
        capture: toElement.innerText,
        piece: fromElement.innerText
    }
    toElement.innerText = fromElement.innerText
    fromElement.innerText = ''
}

const squareClick = (e) => {
    square = document.getElementById(selectedSquare)
    if (square) {
        square.classList.remove("selected")
        if (square != e.target) {
            move(square, e.target)
            sendMove(parsePosition(square), parsePosition(e.target))
        }
        selectedSquare = null

    } else {
        e.target.classList.add("selected")
        selectedSquare = e.target.id
    }
}

const startGame = (gameInfo) => {
    drawPieces(gameInfo['board'])
    gameStatusElement.innerText = "Game started"
    colorElement.innerText = gameInfo['my_colour']
}

const startTurn = () => {
    turnElement.innerText = "your turn"
    myTurn = true
}

drawBoard()
//const gameSocket = new WebSocket('ws://localhost:8000/test/061dad53-e865-4dbe-8e85-f93d903f7a6a/')
const userSocket = new WebSocket('ws://localhost:8000/usersocket/')
const test = () => {
    console.log("test called")
    userSocket.send(JSON.stringify({type: "login", email: "fitz@farseer.ca"}))
    userSocket.send(JSON.stringify({type: 'game_invite', message: "let's play"}))
}
setTimeout(test, 3000)
const sendMove = (from, to) => {
    message = {
        type: 'player_move',
        move: {
            from: from,
            to: to
        }
    }
    gameSocket.send(JSON.stringify(message))
    console.log("sending message to server....")
    console.log(JSON.stringify(message))
}

gameSocket.onopen = () => {
    gameStatusElement.innerText = "Waiting for opponent...."
}

gameSocket.onmessage = (message) => {
    messageJson = JSON.parse(message.data)
    if (messageJson['type'] == 'start_game') {
        startGame(messageJson)
    }
    if (messageJson['type'] == 'start_turn') {
        startTurn() // dont worry about valid moves for now 
    }
    if (messageJson['type'] == 'opponent_move') {
        var opponent_move = messageJson['move']
        fromSquare = getSquareAt(opponent_move['from'][1], opponent_move['from'][0])
        toSquare = getSquareAt(opponent_move['to'][1], opponent_move['to'][0])
        move(fromSquare, toSquare)
    }

    if (messageJson['type'] == 'move_error') {
        unmove()
    }
    console.log("receiving message from server...")
    console.log(JSON.stringify(messageJson))
}