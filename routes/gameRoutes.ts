import express from 'express';
import { getGames } from '../controllers/gameController.ts';

const router = express.Router();

router.get('/', getGames); // Will be accessible via "/games"

export default router;
