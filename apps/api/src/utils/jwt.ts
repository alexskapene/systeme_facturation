import { Types } from 'mongoose';
import { Role } from '../types/user.types';
import jwt from 'jsonwebtoken';

// Génère un token valide pour une durée définie dans le .env
export const generateToken = (
  userId: Types.ObjectId | string,
  role: Role,
): string => {
  const secret = process.env.JWT_SECRET as string;

  const expireInValue = (process.env.JWT_EXPIRE_IN ||
    '1d') as jwt.SignOptions['expiresIn'];

  return jwt.sign({ id: userId.toString(), role }, secret, {
    expiresIn: expireInValue,
  });
};
