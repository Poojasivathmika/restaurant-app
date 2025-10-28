const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB URI specified in the .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully!');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure code if connection fails
    process.exit(1);
  }
};

module.exports = connectDB;