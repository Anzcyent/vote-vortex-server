const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.set("strictQuery", true).connect(process.env.MONGO_URI);
    console.log("MongoDB connection successful");
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
