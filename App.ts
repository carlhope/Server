import {Request, Response} from 'express';
import logger from './middleware/logger';
const { apiRateLimiter } = require('./middleware/rateLimiter');
const { getCached, setCached } = require('./middleware/cache');
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(cors());

const API_KEY = process.env.RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

app.use('/api', apiRateLimiter);


app.get("/games", async (req: Request<{}, {}, {}, { search?: string; page?: string }>, res: Response) => {
  try {
    const { search, page = "1" } = req.query;
    const pageNumber = parseInt(page, 10);

    const queryParams = {
      key: API_KEY,
      page: pageNumber,
      ...(search && { search }),
    };

    const cacheKey = `games-${search || "all"}-page-${pageNumber}`;
    const cached = getCached(cacheKey);
    if (cached){
      logger.info(`Cache hit for key: ${cacheKey}`);

       return res.json(cached);
    }
    logger.error(`No cache hit: ${cacheKey}`);
    const response = await axios.get(`${BASE_URL}/games`, {
      params: queryParams,
    });

    setCached(cacheKey, response.data);
    res.json(response.data);

  } catch (error) {
    if (error instanceof Error) {
      console.error("RAWG fetch error:", error.message);
    }
    res.status(500).json({ error: "Failed to fetch data from RAWG." });
  }
});
export default app;