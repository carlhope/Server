import express from 'express';
import gameRoutes from './routes/gameRoutes';
import authRoutes from './routes/authRoutes';
import { apiRateLimiter } from './middleware/rateLimiter';
import { loggerMiddleware } from './middleware/logger';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// Global Middleware
app.use(express.json());          // Parse JSON bodies
app.use(loggerMiddleware);       // Custom logging
app.use(apiRateLimiter);        // Rate limiting for basic abuse protection
app.use(cookieParser());

const allowedOrigins = ['http://localhost:30300', 'https://yourdomain.com', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

// Routes
app.use('/games', gameRoutes);   // Main route group
app.use('/auth', authRoutes);


// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
