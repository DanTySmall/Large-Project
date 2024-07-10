require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
//const URI = 'mongodb+srv://wlphillips:Admin@cluster0.tjtuhkp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
//const client = new MongoClient(URI);
const client = new MongoClient(url);

// Connects to database
async function connectDatabase() {
  try {
    await client.connect();
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

// Returns MongoDB client
function getClient() {
  return client;
}

// Closes connection to database
async function closeDatabase() {
  try {
    await client.close();
    console.log('MongoDB connection closed');
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    throw err; 
  }
}

module.exports = { connectDatabase, getClient, closeDatabase, };
