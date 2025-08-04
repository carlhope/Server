import express from 'express';
import gameRoutes from './routes/gameRoutes';
import authRoutes from './routes/authRoutes';
import { apiRateLimiter } from './middleware/rateLimiter';
import { loggerMiddleware } from './middleware/logger';
import cookieParser from 'cookie-parser';

const app = express();

// Global Middleware
app.use(express.json());          // Parse JSON bodies
app.use(loggerMiddleware);       // Custom logging
app.use(apiRateLimiter);        // Rate limiting for basic abuse protection
app.use(cookieParser());

// Routes
app.use('/games', gameRoutes);   // Main route group
app.use('/auth', authRoutes);


// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
