const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./database/connectDB");
const io = require("socket.io-client");
const { decryptAndValidateData } = require("./utils/decrypt");
const { insertData } = require("./utils/data");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const socket = io("http://localhost:3001");

socket.on("message", async (message) => {
  const messageArray = message.toString().split("|");
  const time = new Date(new Date().toUTCString());
  try {
    const { decryptArray, failureRate } = await decryptAndValidateData(
      messageArray,
      time
    );

    const upsertRes = await insertData(decryptArray, time);

    downStreamData = {
      successRateDecoding: `${100 - failureRate}%`,
      timeUTC: time,
      upsertRes,
    };

    socket.emit("finalMessage", downStreamData);
  } catch (err) {
    console.log(err);
  }
});
