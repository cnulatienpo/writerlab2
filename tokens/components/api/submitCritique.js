app.post("/api/submit-critique", async (req, res) => {
  const userId = req.headers["x-user-id"];
  const { text } = req.body;

  if (!userId || !text) return res.status(400).json({ error: "Missing data" });

  const wordCount = text.trim().split(/\s+/).length;
  const cost = Math.ceil(wordCount / 100); // 1 token per 100 words

  const user = await db.collection("users").findOne({ userId });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.tokens < cost) {
    return res.status(403).json({ error: "Not enough tokens", tokens: user.tokens });
  }

  // Save critique (optional)
  await db.collection("critiques").insertOne({
    userId,
    text,
    submittedAt: new Date(),
    wordCount,
    cost,
  });

  // Deduct tokens
  const newTokens = user.tokens - cost;
  await db.collection("users").updateOne(
    { userId },
    { $set: { tokens: newTokens } }
  );

  res.json({ message: "Critique submitted", tokens: newTokens });
});

async function submitCritique(text) {
  const res = await fetch("/api/submit-critique", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": "demo-user", // replace dynamically
    },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();
  if (!res.ok) {
    alert(data.error || "Something went wrong.");
    return null;
  }

  return data.tokens; // new token count
}
