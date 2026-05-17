import type { IUser } from '../interfaces';
import { User } from '../models/User.model';
import { ApiError } from '../utils/ApiError';
import { generateToken } from '../utils/generateToken';
import type { RegisterInput, LoginInput } from '../validators/auth.validators';

/** Plain serializable user safe to return in API responses */
export type SafeUser = Omit<IUser, 'password' | 'comparePassword'>;

/** Pick only the safe, serializable fields from a Mongoose document */
function toSafeUser(doc: {
  _id: IUser['_id'];
  name: IUser['name'];
  email: IUser['email'];
  role: IUser['role'];
  createdAt: IUser['createdAt'];
  updatedAt: IUser['updatedAt'];
}): SafeUser {
  return {
    _id: doc._id,
    name: doc.name,
    email: doc.email,
    role: doc.role,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class AuthService {
  static async register(input: RegisterInput): Promise<SafeUser> {
    const exists = await User.findOne({ email: input.email });
    if (exists) throw ApiError.conflict('Email is already registered');
    const user = await User.create(input);
    return toSafeUser(user);
  }

  static async login(input: LoginInput): Promise<{ user: SafeUser; token: string }> {
    const user = await User.findOne({ email: input.email }).select('+password');
    const invalidErr = ApiError.unauthorized('Invalid credentials');
    if (!user) throw invalidErr;
    const passwordMatch = await user.comparePassword(input.password);
    if (!passwordMatch) throw invalidErr;
    const token = generateToken(user._id, user.role);
    return { user: toSafeUser(user), token };
  }
}
