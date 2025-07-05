require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());

const API_KEY = process.env.RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

app.get("/games", async (req, res) => {
  try {
    const { search, page = 1 } = req.query;

    const queryParams = {
      key: API_KEY,
      page,
      ...(search && { search }),
    };

    const response = await axios.get(`${BASE_URL}/games`, {
      params: queryParams,
    });

    res.json(response.data);
  } catch (error) {
    console.error("RAWG fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch data from RAWG." });
  }
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});

