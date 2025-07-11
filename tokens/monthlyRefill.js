// monthlyRefill.js
const { MongoClient } = require("mongodb");

// Replace with your real connection string
const uri = "YOUR_MONGODB_ATLAS_CONNECTION_STRING";
const client = new MongoClient(uri);
const dbName = "yourDatabaseName";
const collectionName = "users";

async function monthlyRefill() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection(collectionName);

    const result = await users.updateMany({}, {
      $set: {
        tokens_remaining: 20000,
        critiques_used: 0,
        last_token_refill: new Date()
      }
    });

    console.log(`✅ Refilled ${result.modifiedCount} users.`);
  } catch (err) {
    console.error("❌ Error refilling tokens:", err);
  } finally {
    await client.close();
  }
}

monthlyRefill();
