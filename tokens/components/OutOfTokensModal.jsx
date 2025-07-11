import { useEffect, useState } from "react";
import BuyMoreButton from "./BuyMoreButton";

export default function OutOfTokensModal() {
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    fetch("/api/tokens", { headers: { "x-user-id": "demo-user" } }) // change this too
      .then((res) => res.json())
      .then((data) => setTokens(data.tokens))
      .catch(() => setTokens("error"));
  }, []);

  if (tokens === null || tokens > 0) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-md p-6 rounded-lg text-center shadow-lg border-4 border-black">
        <h2 className="text-2xl font-bold mb-4">💔 Out of Tokens</h2>
        <p className="text-sm mb-4 text-gray-700 italic">
          You’ve used up all your critique energy for now. But we got you.
        </p>
        <BuyMoreButton />
      </div>
    </div>
  );
}
