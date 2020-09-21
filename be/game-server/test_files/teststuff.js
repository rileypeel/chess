
const button = document.querySelector("#button")
const inp = document.querySelector("#input")
fetch('http://localhost:8000/user/login/', {
    method: 'POST',
    headers: new Headers({'Content-Type':'application/json'}),
    body: JSON.stringify({
        email: 'fitz@farseer.ca',
        password: 'nighteyes'
    })
  })

const clickBtn = () => {
    const socket = new WebSocket("ws://localhost:8000/testroute/")
}


button.onclick = clickBtn

