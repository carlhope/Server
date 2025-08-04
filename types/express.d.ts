import type { User } from '../models/User';

type SafeUser = Omit<User, 'passwordHash'>;

declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
    }
  }
}

export {}; // 👈 Required to treat this as a module
