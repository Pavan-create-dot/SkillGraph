import bcrypt from 'bcryptjs';
import { env } from '../config/env';

export const hashPassword = async (plainText: string): Promise<string> => {
  return bcrypt.hash(plainText, env.BCRYPT_SALT_ROUNDS);
};

export const comparePassword = async (plainText: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plainText, hashed);
};
