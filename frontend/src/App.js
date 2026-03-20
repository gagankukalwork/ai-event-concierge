import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [result, setResult] = useState([]);
  const [history, setHistory] = useState([]);

  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchHistory = async () => {
    const res = await fetch(API + "/history");
    const data = await res.json();
    setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async () => {
    if (!input) return;

    setLoading(true);
    setShowCard(false);

    const res = await fetch(API + "/generate-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input })
    });

    const data = await res.json();
    setResult(data);

    setTimeout(() => {
      setLoading(false);
      setShowCard(true);
      fetchHistory();
    }, 1000);
  };

  return (
    <div className="container">
      <h1>AI Event Concierge</h1>

      <input
        placeholder="Describe your event..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleSubmit}>Generate</button>

      {loading && (
        <div className="scroll">
          <div className="paper"></div>
          <p>AI is planning your event...</p>
        </div>
      )}

      {showCard && result.length > 0 && (
        <div className="results">
          {result.map((venue, idx) => (
            <div key={idx} className="card">
              <h2>{venue.venueName}</h2>
              <p>{venue.location}</p>
              <p>{venue.estimatedCost}</p>
              <p>{venue.whyItFits}</p>
            </div>
          ))}
        </div>
      )}

      <h3>History</h3>
      {history.map((item, i) => (
        <div key={i} className="history">
          <p><b>{item.input}</b></p>
          {Array.isArray(item.output) ? (
            item.output.map((venue, idx) => (
              <p key={idx}>{venue.venueName}</p>
            ))
          ) : (
            <p>{item.output.venueName}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;