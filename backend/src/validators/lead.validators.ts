import { z } from 'zod';
import { LeadStatus, LeadSource } from '../constants/enums';

export const createLeadSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(2, 'Min 2 chars').max(100, 'Max 100 chars').trim(),
  email: z.string({ required_error: 'Email is required' }).email('Invalid email').trim(),
  status: z.nativeEnum(LeadStatus, { message: 'Invalid status' }).optional().default(LeadStatus.NEW),
  source: z.nativeEnum(LeadSource, { message: 'Invalid source' }),
});

export const updateLeadSchema = createLeadSchema.partial();

export const leadQuerySchema = z.object({
  page: z.coerce.number().min(1, 'Page must be at least 1').optional().default(1),
  status: z.nativeEnum(LeadStatus, { message: 'Invalid status' }).optional(),
  source: z.nativeEnum(LeadSource, { message: 'Invalid source' }).optional(),
  search: z.string().optional(),
  sort: z.enum(['latest', 'oldest']).optional().default('latest'),
});

export const leadIdParamSchema = z.object({
  id: z.string({ required_error: 'ID is required' }).regex(/^[a-fA-F0-9]{24}$/, 'Invalid ID format'),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadQuery = z.infer<typeof leadQuerySchema>;
export type LeadIdParams = z.infer<typeof leadIdParamSchema>;
