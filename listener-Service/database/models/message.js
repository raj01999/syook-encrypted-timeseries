const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  time_stamp: { type: Date, required: true },
  segments: {},
});

const Message = model("messages", messageSchema);

module.exports = Message;
