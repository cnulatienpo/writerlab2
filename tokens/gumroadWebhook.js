const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB setup
const uri = "YOUR_MONGODB_ATLAS_CONNECTION_STRING";
const client = new MongoClient(uri);
const dbName = "yourDatabaseName";
const collectionName = "users";

async function addTokensToUser(email, tokens) {
  await client.connect();
  const db = client.db(dbName);
  const users = db.collection(collectionName);

  const result = await users.findOneAndUpdate(
    { _id: email.toLowerCase() },
    {
      $inc: { tokens_remaining: tokens }
    },
    { upsert: true, returnDocument: "after" }
  );

  console.log(`✅ ${tokens} tokens added to ${email}`);
}

// Webhook route
app.post("/gumroad/webhook", async (req, res) => {
  const email = req.body.email;
  const productName = req.body.product_name;

  if (!email || !productName) {
    return res.status(400).send("Missing email or product name");
  }

  // You can customize token amount per product
  let tokensToAdd = 20000;
  if (productName.includes("Token Refill")) {
    await addTokensToUser(email, tokensToAdd);
    return res.status(200).send("Success");
  }

  return res.status(400).send("Unknown product");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
});
