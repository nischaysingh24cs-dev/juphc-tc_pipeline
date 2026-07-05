const { MongoClient } = require('mongodb');

// Connection URL (Replace with your Atlas connection string if needed)
const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'devops_capstone';

async function connectToDatabase() {
    try {
        // Task 4 Requirement: Connect to the MongoDB server
        await client.connect();
        console.log('Connected successfully to MongoDB server');
        
        const db = client.db(dbName);
        return db;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}

module.exports = { connectToDatabase, client };
