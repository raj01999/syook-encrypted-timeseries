const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");
const { createDataStream } = require("./utils/data");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const io = socketIo(server, { cors: { origin: "*" } });
io.on("connection", (socket) => {
  setInterval(() => {
    socket.emit("message", createDataStream());
  }, 10000);

  socket.on("finalMessage", (data) => {
    console.log(data);
  });
});

server.listen(process.env.PORT || 3001, (err) => {
  if (!err) {
    console.log("Emitter Service Is Running On PORT 3001");
  } else {
    console.error(err);
  }
});
