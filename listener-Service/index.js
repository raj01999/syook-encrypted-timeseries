const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/connectDB");
const io1 = require("socket.io-client");
const socketIo = require("socket.io");
const { decryptAndValidateData } = require("./utils/decrypt");
const { insertData } = require("./utils/data");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const io2 = socketIo(server, { cors: { origin: "*" } });

// listener service is running on the port 3002
server.listen(process.env.PORT || 3002, (err) => {
  if (!err) {
    console.log("Listener Service Is Running On PORT 3002");
  } else {
    console.error(err);
  }
});

const socket1 = io1("http://localhost:3001");

// getting cncrypted data and after validating emiting the saved data
let socket2List = {};
io2.on("connection", (socket) => {
  socket2List[socket.id] = socket;

  socket.on("disconnect", () => {
    delete socket2List[socket.id];
  });
});

socket1.on("message", async (message) => {
  const messageArray = message.toString().split("|");
  const time = new Date();
  try {
    const { decryptArray, failureRate } = await decryptAndValidateData(
      messageArray,
      time
    );

    const insertRes = await insertData(decryptArray, time);

    downStreamData = {
      successRate: `${100 - failureRate}%`,
      time: time,
      insertRes: insertRes,
    };

    if (Object.keys(socket2List).length !== 0) {
      Object.values(socket2List).forEach((socket2) => {
        socket2.emit("message", downStreamData);
      });
    }
  } catch (err) {
    console.error(err);
  }
});
