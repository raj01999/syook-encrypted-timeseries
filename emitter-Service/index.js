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

let emitInterval = null;
// on connection of socket emiting message per 10 second
io.on("connection", (socket) => {
  if (!emitInterval) {
    emitInterval = setInterval(() => {
      socket.emit("message", createDataStream());
    }, 10000); // 10 seconds in milliseconds
  }

  socket.on("disconnect", () => {
    if (io.engine.clientsCount === 0) {
      clearInterval(emitInterval);
      emitInterval = null;
    }
  });
});

// listen to port 3001
server.listen(process.env.PORT || 3001, (err) => {
  if (!err) {
    console.log("Emitter Service Is Running On PORT 3001");
  } else {
    console.error(err);
  }
});
