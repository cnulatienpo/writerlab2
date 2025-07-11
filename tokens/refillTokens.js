// refillTokens.js

const { MongoClient } = require('mongodb');

// 🔐 Replace with your Mongo Atlas connection string
const uri = 'YOUR_MONGO_ATLAS_CONNECTION_STRING';
const client = new MongoClient(uri);

const DATABASE_NAME = 'yourDatabaseName';
const USERS_COLLECTION = 'users';
const REFILL_AMOUNT = 20000;
const DAYS_BETWEEN_REFILLS = 30;

async function refillMonthlyTokens() {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const users = db.collection(USERS_COLLECTION);

    const now = new Date();
    const cutoff = new Date(now.getTime() - DAYS_BETWEEN_REFILLS * 24 * 60 * 60 * 1000);

    // Find users who are eligible for a refill
    const eligibleUsers = await users.find({
      $or: [
        { lastRefill: { $lt: cutoff } },
        { lastRefill: { $exists: false } }
      ]
    }).toArray();

    for (const user of eligibleUsers) {
      const newTokenCount = (user.tokens_remaining || 0) + REFILL_AMOUNT;

      await users.updateOne(
        { _id: user._id },
        {
          $set: { 
            tokens_remaining: newTokenCount, 
            lastRefill: now 
          }
        }
      );

      console.log(`✅ Refilled ${user.email || user._id}: now has ${newTokenCount} tokens`);
    }

    console.log(`🎉 Done. Refilled ${eligibleUsers.length} users.`);
  } catch (err) {
    console.error('❌ Error during refill:', err);
  } finally {
    await client.close();
  }
}

refillMonthlyTokens();
