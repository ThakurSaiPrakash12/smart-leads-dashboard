import { Types } from 'mongoose';
import { UserRole } from '../constants/enums';

export interface IUser {
  readonly _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}
