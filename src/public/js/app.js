const socket = io();  // frontend에서 backend와 연결 설정
 
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const roomUl = room.querySelector("ul");

room.hidden = true;

let roomName;

// 메시지를 리스트에 추가하는 함수
function addMessage(msg) {
  const li = document.createElement("li");
  li.innerText = msg;
  roomUl.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName}`;
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit)
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");

  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}


form.addEventListener("submit", handleRoomSubmit);


socket.on("welcome", (socket) => {
  addMessage("a new user has joined");
})

socket.on("bye", () => {
  addMessage("someone has left");
})

socket.on("new_message", addMessage);
