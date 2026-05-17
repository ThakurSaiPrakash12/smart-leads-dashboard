import { Schema, model, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../interfaces';
import { UserRole } from '../constants/enums';
import { SALT_ROUNDS } from '../constants';

type UserModel = Model<IUser>;

const userSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.SALES },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = model<IUser, UserModel>('User', userSchema);
