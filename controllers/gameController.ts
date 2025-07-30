
import axios from 'axios';
import type { Request, Response } from 'express';


export const getGames = async (
  req: Request<{}, {}, {}, { search?: string; page?: string }>,
  res: Response
) => {
  try {
    const { search, page = '1' } = req.query;
    const pageNumber = parseInt(page, 10);

    const queryParams = {
      key: process.env.RAWG_API_KEY,
      page: pageNumber,
      ...(search && { search }),
    };

    const response = await axios.get('https://api.rawg.io/api/games', {
      params: queryParams,
    });

    res.status(200).json(response.data);
  } catch (error) {
    if(error instanceof Error){
    console.error('RAWG API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from RAWG API' });
    }
    else {
    console.error('Unexpected error type:', error);
    res.status(500).json({ error: 'An unknown error occurred.' });
    }
  }
};

