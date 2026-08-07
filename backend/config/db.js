const mongoose = require('mongoose');

let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
  // Return existing promise if connection is in progress
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      // Remove deprecated options - they're now defaults in Mongoose 6+
      await mongoose.connect(process.env.MONGO_URI);
      
      isConnected = true;
      console.log("✅ MongoDB Connected successfully");
      
      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err.message);
        isConnected = false;
      });
      
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
        isConnected = false;
      });
      
      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected');
        isConnected = true;
      });
      
      return true;
    } catch (error) {
      console.error("❌ MongoDB Connection Failed:", error.message);
      isConnected = false;
      // Reset promise so we can retry
      connectionPromise = null;
      return false;
    }
  })();
  
  return connectionPromise;
};

const getConnectionStatus = () => {
  // Also check mongoose readyState (1 = connected)
  return isConnected && mongoose.connection.readyState === 1;
};

module.exports = connectDB;
module.exports.getConnectionStatus = getConnectionStatus;
