import type { Request, Response } from 'express';
import { LeadService } from '../services/lead.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { exportLeadsToCSV } from '../utils/csvExporter';
import { HTTP_STATUS } from '../constants';
import { ApiError } from '../utils/ApiError';
import type { AuthenticatedUser } from '../interfaces/auth.interface';
import {
  createLeadSchema,
  updateLeadSchema,
  leadQuerySchema,
  leadIdParamSchema,
} from '../validators/lead.validators';

const requireUser = (req: Request): AuthenticatedUser => {
  if (!req.user) throw ApiError.unauthorized('Authentication required');
  return req.user;
};

export const getLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const filters = leadQuerySchema.parse(req.query);
  const { id, role } = requireUser(req);
  const result = await LeadService.getLeads(filters, id, role);
  res.status(HTTP_STATUS.OK).json(ApiResponse.paginated(result.data, result.pagination));
});

export const createLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = requireUser(req);
  const input = createLeadSchema.parse(req.body);
  const lead = await LeadService.createLead(input, id);
  res.status(HTTP_STATUS.CREATED).json(ApiResponse.ok(lead, 'Lead created successfully'));
});

export const getLeadById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id, role } = requireUser(req);
  const params = leadIdParamSchema.parse(req.params);
  const lead = await LeadService.getLeadById(params.id, id, role);
  res.status(HTTP_STATUS.OK).json(ApiResponse.ok(lead, 'Lead retrieved successfully'));
});

export const updateLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id, role } = requireUser(req);
  const params = leadIdParamSchema.parse(req.params);
  const input = updateLeadSchema.parse(req.body);
  const lead = await LeadService.updateLead(params.id, input, id, role);
  res.status(HTTP_STATUS.OK).json(ApiResponse.ok(lead, 'Lead updated successfully'));
});

export const deleteLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const params = leadIdParamSchema.parse(req.params);
  await LeadService.deleteLead(params.id);
  res.status(HTTP_STATUS.OK).json(ApiResponse.ok(null, 'Lead deleted successfully'));
});

export const exportLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const filters = leadQuerySchema.parse(req.query);
  const { id, role } = requireUser(req);

  const leads = await LeadService.getLeadsForExport(filters, id, role);
  const csv = exportLeadsToCSV(leads);

  const date = new Date().toISOString().split('T')[0];
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="leads-${date}.csv"`);
  res.status(HTTP_STATUS.OK).send(csv);
});
