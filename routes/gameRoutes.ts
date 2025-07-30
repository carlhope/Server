import express from 'express';
import { getGames } from '../controllers/gameController';

const router = express.Router();

router.get('/', getGames); // Will be accessible via "/games"

export default router;
