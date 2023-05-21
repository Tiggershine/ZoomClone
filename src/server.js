import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));  // Frontend에서 보여지는 static 파일 설정
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect('/'));

const handelListen = () => console.log(`Listening on http://localhost:3000`)

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });  // 같은 서버(port)에서 http와 webSocket 서버 둘 다 돌릴 수 있다. (http서버 위에 webSocket 서버를 올린거임)

function handleConnection(socket) {
  console.log(socket);
}
wss.on("connection", handleConnection);
server.listen(3000, handelListen);
