const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo_app';

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500 // Quick fallback if MongoDB is not running locally
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to ${mongoose.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB] Connection failed (${error.message}).`);
    console.warn(`[Storage] Running in resilient in-memory storage mode with seed tasks.`);
    console.warn(`[Storage] To persist in MongoDB, set MONGODB_URI in your .env or run mongod.`);
  }
};

const getIsConnected = () => isConnected;

module.exports = {
  connectDB,
  getIsConnected
};
