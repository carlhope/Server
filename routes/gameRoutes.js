"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gameController_1 = require("../controllers/gameController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', gameController_1.getGames); // Will be accessible via "/games"
router.get('/:id', authMiddleware_1.authenticate, gameController_1.getGameDetails); // Will be accessible via "/games/:id" to logged-in users
exports.default = router;
