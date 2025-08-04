
import axios from 'axios';
import { AxiosError } from 'axios';
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

export const getGameDetails = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const response = await axios.get(`https://api.rawg.io/api/games/${id}`, {
      params: {
        key: process.env.RAWG_API_KEY,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    if (isLikelyAxiosError(error)) {
      const status = error.response?.status ?? 500;

      if (status === 404) {
        console.error('RAWG API error: Game not found');
        return res.status(404).json({ error: 'Game not found' });
      }

      console.error('RAWG API error:', error.message);
      return res.status(500).json({ error: 'Failed to fetch game details from RAWG API' });
    }

    console.error('Unexpected error type:', error);
    res.status(500).json({ error: 'An unknown error occurred.' });
  }
};

function isLikelyAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
}
