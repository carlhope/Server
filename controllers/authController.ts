import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const users: { username: string; passwordHash: string }[] = [];

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRY = '15m';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret';
const REFRESH_EXPIRY = '7d';

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ username, passwordHash });
  res.status(201).json({ message: 'User registered' });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  const refreshToken = jwt.sign({ username }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });

  res
    .cookie('refreshToken', refreshToken, { httpOnly: true, secure: false })
    .json({ accessToken });
};

export const refreshToken = (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const payload = jwt.verify(token, REFRESH_SECRET) as { username: string };
    const newAccessToken = jwt.sign({ username: payload.username }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('refreshToken').json({ message: 'Logged out' });
};
