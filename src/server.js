import http from "http";
import WebSocket from "ws";
import socketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));  // Frontend에서 보여지는 static 파일 설정
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect('/'));

const handelListen = () => console.log(`Listening on http://localhost:3000`)

const httpServer = http.createServer(app);  // http 서버 생성
const wsServer = socketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  })

  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");  // socekt.to("room"): 나를 제외한 방의 모든 사람에게 보냄
  });

  socket.on("disconnecting", () => {  // disconnecting: 연결이 끊어짐 (아주 나간 event: disconnect)
    socket.rooms.forEach(room => socket.to(room).emit("bye"));
  })

  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", msg);
    done();
  })
});






/* const wss = new WebSocket.Server({ server });  // 같은 서버(port)에서 http와 webSocket 서버 둘 다 돌릴 수 있다. (http서버 위에 webSocket 서버를 올린거임)
const sockets = [];
wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";

  console.log("Connected to Browser 🤩");
  socket.on("close", () => console.log("Disconnected from Browser ❌"));  // close event on browser 

  socket.on("message", (msg) => {  // message event on browser 
    const message = JSON.parse(msg);  // transfer from String to JS Object
    switch(message.type) {
      case "new_message":
        sockets.forEach((aSocket) => 
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;
    }
  });
}); */

httpServer.listen(3000, handelListen);

