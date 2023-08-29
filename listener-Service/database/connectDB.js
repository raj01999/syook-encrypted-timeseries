const { connect } = require("mongoose");

const connectDB = async () => {
  try {
    await connect(process.env.MONGODB_ATLAS_URL);
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
