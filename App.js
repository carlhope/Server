"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gameRoutes_1 = __importDefault(require("./routes/gameRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const rateLimiter_1 = require("./middleware/rateLimiter");
const logger_1 = require("./middleware/logger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
// Global Middleware
app.use(express_1.default.json()); // Parse JSON bodies
app.use(logger_1.loggerMiddleware); // Custom logging
app.use(rateLimiter_1.apiRateLimiter); // Rate limiting for basic abuse protection
app.use((0, cookie_parser_1.default)());
// Routes
app.use('/games', gameRoutes_1.default); // Main route group
app.use('/auth', authRoutes_1.default);
// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
exports.default = app;
