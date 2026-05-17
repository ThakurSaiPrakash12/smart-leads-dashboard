import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(2, 'Min 2 chars').max(50, 'Max 50 chars').trim(),
  email: z.string({ required_error: 'Email is required' }).email('Invalid email').trim(),
  password: z.string({ required_error: 'Password is required' }).min(6, 'Min 6 chars').max(100, 'Max 100 chars'),
});

export const loginSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Invalid email').trim(),
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
