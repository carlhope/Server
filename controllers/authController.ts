import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client.js';


const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRY = '15m';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret';
const REFRESH_EXPIRY = '7d';

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        passwordHash
      }
    });

    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ username: user.username, userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    const refreshToken = jwt.sign({ username: user.username, userId: user.id }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });

    res
      .cookie('refreshToken', refreshToken, {
         httpOnly: true,
          secure: false,
           sameSite: 'strict'
           })
      .json({ accessToken });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const refreshToken2 = (req: Request, res: Response) => {//change back to refreshToken if other option doesn't work
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


export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  console.log("Received refresh token:", token);

  if (!token) {
    console.error("No refresh token provided");
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  try {
    const payload = jwt.verify(token, REFRESH_SECRET) as { userId: string };

    // Optional: verify user still exists
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      console.error("User not found for refresh token:", payload.userId);
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ Issue new access token
    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });

    // ✅ Optionally rotate refresh token
    // const newRefreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
    //   expiresIn: REFRESH_EXPIRY,
    // });
    // res.cookie('refreshToken', newRefreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'Strict',
    // });

    console.log("New access token issued for user:", user.id);
    return res.json({ accessToken });
  } catch (err) {
    console.error("Refresh token error:", err);
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
};
