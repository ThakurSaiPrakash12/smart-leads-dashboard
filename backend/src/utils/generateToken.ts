import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { UserRole } from '../constants/enums';
import { JwtPayload } from '../interfaces';
import { ENV } from '../config/env';

export const generateToken = (userId: Types.ObjectId, role: UserRole): string => {
  const payload: JwtPayload = { id: userId.toString(), role };
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};
