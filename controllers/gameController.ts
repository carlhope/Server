import { Request, Response } from 'express';

export const getGames = (req: Request, res: Response) => {
  res.send('Here are your games 🕹️');
};
