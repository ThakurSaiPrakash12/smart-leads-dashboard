import { UserRole } from '../constants/enums';

export interface JwtPayload {
  readonly id: string;
  readonly role: UserRole;
}

export interface AuthenticatedUser {
  readonly id: string;
  readonly role: UserRole;
}
