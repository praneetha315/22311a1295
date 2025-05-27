import React, { useState } from "react";
function StockAggregator() {
  const [symbols, setSymbols] = useState("");
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch price for one symbol
  const fetchPrice = async (symbol) => {
    try {
      const response = await fetch( `https://localhost:3000`)
      if (!response.ok) {
        throw new Error(`Error fetching ${symbol}`);
      }
      const data = await response.json();
      return data.c; // Current price
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleFetch = async () => {
    setError(null);
    setLoading(true);
    const symbolList = symbols
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter((s) => s.length > 0);

    const priceResults = {};
    for (const sym of symbolList) {
      const price = await fetchPrice(sym);
      priceResults[sym] = price;
    }
    setPrices(priceResults);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "Arial" }}>
      <h2>Stock Price Aggregator</h2>
      <p>Enter stock symbols separated by commas (e.g., AAPL, GOOG, MSFT)</p>
      <input
        type="text"
        value={symbols}
        onChange={(e) => setSymbols(e.target.value)}
        placeholder="Enter symbols"
        style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
      />
      <button
        onClick={handleFetch}
        disabled={loading || symbols.trim() === ""}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        {loading ? "Fetching..." : "Get Prices"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {Object.keys(prices).length > 0 && (
        <table
          style={{
            marginTop: "2rem",
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>
                Symbol
              </th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>
                Price (USD)
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(prices).map(([sym, price]) => (
              <tr key={sym}>
                <td
                  style={{
                    borderBottom: "1px solid #eee",
                    padding: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  {sym}
                </td>
                <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                  {price === null ? "N/A" : price.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StockAggregator;
