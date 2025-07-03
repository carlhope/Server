require("dotenv").config();


const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());

const API_KEY = process.env.RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

// Proxy endpoint for search
app.get("/games", async (req, res) => {
  try {
    const { search } = req.query;
    const response = await axios.get(`${BASE_URL}/games`, {
      params: {
        key: API_KEY,
        search
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch data from RAWG." });
  }
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
