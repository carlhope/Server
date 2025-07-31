import express from 'express';
import gameRoutes from './routes/gameRoutes.ts';
import authRoutes from './routes/authRoutes.ts';
import { apiRateLimiter } from './middleware/rateLimiter.ts';
import { loggerMiddleware } from './middleware/logger.ts';





const app = express();

// Global Middleware
app.use(express.json());          // Parse JSON bodies
app.use(loggerMiddleware);       // Custom logging
app.use(apiRateLimiter);        // Rate limiting for basic abuse protection

// Routes
app.use('/games', gameRoutes);   // Main route group
app.use('/auth', authRoutes);


// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
