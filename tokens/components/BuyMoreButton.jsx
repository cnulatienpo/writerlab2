export default function BuyMoreButton() {
  return (
    <a
      href="https://your-gumroad-product-url.com" // change this to your actual link
      className="inline-block mt-2 bg-black text-white font-bold px-6 py-3 rounded-full hover:bg-gray-800 transition"
    >
      ✨ Buy More Tokens
    </a>
  );
}

// /api/tokens
app.get("/api/tokens", async (req, res) => {
  const userId = req.headers["x-user-id"];
  const user = await db.collection("users").findOne({ userId });

  if (!user) return res.status(404).json({ tokens: 0 });
  res.json({ tokens: user.tokens });
});
