import express from 'express';
import { getGameDetails, getGames } from '../controllers/gameController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getGames); // Will be accessible via "/games"
router.get('/:id', authenticate, getGameDetails);// Will be accessible via "/games/:id" to logged-in users

export default router;
