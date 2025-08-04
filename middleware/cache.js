"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCached = exports.getCached = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const cache = new node_cache_1.default({ stdTTL: 100 }); // cache expires after 100 seconds
const getCached = (key) => cache.get(key);
exports.getCached = getCached;
const setCached = (key, value) => cache.set(key, value);
exports.setCached = setCached;
