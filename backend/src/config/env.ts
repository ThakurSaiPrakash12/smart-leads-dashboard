import 'dotenv/config';

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

const requiredNumber = (key: string): number => {
  const value = required(key);
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`Invalid numeric value for environment variable: ${key}`);
  return parsed;
};

export const ENV = {
  PORT: requiredNumber('PORT'),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  MONGODB_URI: required('MONGODB_URI'),
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: required('JWT_EXPIRES_IN'),
  CLIENT_URL: required('CLIENT_URL'),
  JWT_COOKIE_NAME: required('JWT_COOKIE_NAME'),
  SALT_ROUNDS: requiredNumber('SALT_ROUNDS'),
  PAGE_LIMIT: requiredNumber('PAGE_LIMIT'),
  EXPORT_LIMIT: requiredNumber('EXPORT_LIMIT'),
  COOKIE_MAX_AGE_DAYS: requiredNumber('COOKIE_MAX_AGE_DAYS'),
  LOGIN_RATE_WINDOW_MIN: requiredNumber('LOGIN_RATE_WINDOW_MIN'),
  LOGIN_RATE_MAX: requiredNumber('LOGIN_RATE_MAX'),
  REGISTER_RATE_WINDOW_MIN: requiredNumber('REGISTER_RATE_WINDOW_MIN'),
  REGISTER_RATE_MAX: requiredNumber('REGISTER_RATE_MAX'),
  JSON_BODY_LIMIT: required('JSON_BODY_LIMIT'),
} as const;
