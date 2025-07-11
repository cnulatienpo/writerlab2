app.post("/api/get-critique-response", async (req, res) => {
  const userId = req.headers["x-user-id"];
  const { critiqueId } = req.body;

  if (!userId || !critiqueId) return res.status(400).json({ error: "Missing data" });

  const critique = await db.collection("critiques").findOne({ _id: new ObjectId(critiqueId) });
  if (!critique || critique.userId !== userId) {
    return res.status(404).json({ error: "Critique not found" });
  }

  // If already generated, return cached
  if (critique.response) {
    return res.json({ response: critique.response });
  }

  // 🔮 Call DeepSeek API (placeholder)
  const deepseekRes = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-coder",
      messages: [
        { role: "system", content: "Give a warm, honest writing critique. Be brief but sharp." },
        { role: "user", content: critique.text },
      ],
    }),
  });

  const data = await deepseekRes.json();
  const critiqueText = data.choices?.[0]?.message?.content || "Error: no critique";

  // Save response
  await db.collection("critiques").updateOne(
    { _id: new ObjectId(critiqueId) },
    { $set: { response: critiqueText, respondedAt: new Date() } }
  );

  res.json({ response: critiqueText });
});
