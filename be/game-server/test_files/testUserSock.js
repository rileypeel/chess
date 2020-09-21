
const textArea = document.querySelector("#textarea")
const submitBtn = document.querySelector("#submitbutton")
const userSocket = new WebSocket('ws://localhost:8000/usersocket/')

userSocket.onmessage = (message) => {
  messageJson = JSON.parse(message.data)
  console.log(JSON.stringify(messageJson))
}



const btnClick = () => {
  console.log("sending....")
  console.log(textArea.value)
  userSocket.send(textArea.value)
}

submitBtn.onclick = btnClick