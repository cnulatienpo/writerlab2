import { useEffect, useState } from "react";

export default function TokenStatus() {
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    fetch("/api/tokens", { headers: { "x-user-id": "demo-user" } }) // change this as needed
      .then((res) => res.json())
      .then((data) => setTokens(data.tokens))
      .catch(() => setTokens("error"));
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-100 text-black font-mono px-4 py-2 rounded-full border-2 border-yellow-500 shadow-md">
      {tokens === null && "Loading..."}
      {tokens === "error" && "⚠️ Token error"}
      {tokens !== null && tokens !== "error" && (
        <>🪙 Tokens: <strong>{tokens}</strong></>
      )}
    </div>
  );
}
