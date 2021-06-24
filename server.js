const express = require("express");
const app = express();
const server = require("http").Server(app);
const path = require("path");
const cors = require("cors");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.static(path.join(__dirname, "front/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/front/build/index.html"));
});

server.listen(4000, () => {
  console.log("run server 4000!");
});

let roomId = null;

app.use(express.json());

app.post("/api/:roomId", (req, res) => {
  roomId = req.params.roomId;
  console.log("post api", roomId);
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    console.log("user", userId);
    socket.join(roomId);
    socket.broadcast.emit("user-connected", userId);
  });
});
