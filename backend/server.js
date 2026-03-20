require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const axios = require("axios");

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:3000"]
  })
);

app.use(express.json());

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        input TEXT,
        output JSONB
      )
    `);
    console.log("Database ready");
  } catch (err) {
    console.error("DB Error:", err.message);
  }
};

initDB();

app.get("/", (req, res) => {
  res.send("Server running");
});

app.post("/generate-event", async (req, res) => {
  try {
    const { input } = req.body;
    console.log("INPUT:", input);

    const prompt = `
Take this event idea: "${input}"

Suggest 3-5 suitable venues and return them as a JSON array.

Return ONLY JSON:
[
  {
    "venueName": "",
    "location": "",
    "estimatedCost": "",
    "whyItFits": ""
  }
]
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/free",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let raw = response.data.choices[0].message.content;
    console.log("RAW AI:", raw);

    raw = raw.replace(/```json|```/g, "").trim();

    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return res.status(500).json({ error: "Invalid AI response" });
    }

    const result = JSON.parse(jsonMatch[0]);
    console.log("RESULT:", result);

    await pool.query(
      "INSERT INTO events(input, output) VALUES($1, $2::jsonb)",
      [input, JSON.stringify(result)]
    );

    res.json(result);
  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/history", async (req, res) => {
  try {
    const data = await pool.query(
      "SELECT id, input, output FROM events ORDER BY id DESC"
    );
    res.json(data.rows);
  } catch (err) {
    console.error("HISTORY ERROR:", err.message);
    res.status(500).json({ error: "Error fetching history" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});