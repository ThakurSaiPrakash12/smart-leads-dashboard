import { ENV } from '../config/env';

export { LeadStatus, LeadSource, UserRole } from './enums';
export { HTTP_STATUS } from './httpStatus';

export const SALT_ROUNDS = ENV.SALT_ROUNDS;
export const JWT_COOKIE_NAME = ENV.JWT_COOKIE_NAME;
export const PAGE_LIMIT = ENV.PAGE_LIMIT;
export const EXPORT_LIMIT = ENV.EXPORT_LIMIT;
