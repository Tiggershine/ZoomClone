const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick")
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);  // Client 측에서 Websocket 생성

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}


socket.addEventListener("open", () => {  // listen on open from Server
  console.log("Connected to Server 🤓");
})

socket.addEventListener("message", (message) => {  // listen on message from Server
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {  // listen on close from Server
  console.log("Disconnected from Server ❌");
});
 
function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  console.log(input.value);
  socket.send(makeMessage("new_message", input.value));
  input.value = '';
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
} 

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
