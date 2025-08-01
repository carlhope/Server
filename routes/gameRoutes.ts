import express from 'express';
import { getGames } from '../controllers/gameController.ts';
import { authenticate } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.get('/', getGames); // Will be accessible via "/games"
router.get('/:id', authenticate, getGames);//TODO: create getGamesById endpoint. requires auth

export default router;
