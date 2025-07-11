// gumroadWebhook.js
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const uri = "YOUR_MONGODB_ATLAS_CONNECTION_STRING";
const client = new MongoClient(uri);
const dbName = "yourDatabaseName";
const collectionName = "users";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Map Gumroad product names to token amounts
const productTokens = {
  "Mini Refill": 20000,
  "Light Session": 100000,
  "Full Workshop": 300000,
  "Obsessive Refill": 1000000
};

app.post('/gumroad-webhook', async (req, res) => {
  const { email, product_name } = req.body;

  if (!email || !productTokens[product_name]) {
    return res.status(400).send('Invalid webhook data');
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection(collectionName);

    const result = await users.updateOne(
      { email: email.toLowerCase() },
      { $inc: { tokens_remaining: productTokens[product_name] } }
    );

    if (result.modifiedCount === 0) {
      console.log(`User not found: ${email}`);
    } else {
      console.log(`✅ Gave ${productTokens[product_name]} tokens to ${email}`);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Webhook listening on port ${PORT}`));
