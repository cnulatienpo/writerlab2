import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');

  try {
    await client.connect();
    const db = client.db('YOUR_DATABASE_NAME'); // change this
    const users = db.collection('users');

    const DEFAULT_TOKENS = 10;

    await users.updateMany({}, {
      $set: {
        tokens_remaining: DEFAULT_TOKENS,
        last_refill: new Date()
      }
    });

    res.status(200).json({ message: 'Refill complete.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Refill failed.' });
  } finally {
    await client.close();
  }
}


if (req.headers['x-api-key'] !== process.env.REFILL_SECRET) {
  return res.status(403).send('Forbidden');
}
REFILL_SECRET=your_super_secret_key
https://your-app.com/api/refillTokens
x-api-key: your_super_secret_key
