import { FilterQuery, Types } from 'mongoose';
import type { ILead } from '../interfaces';
import type { IPaginatedResponse } from '../interfaces/pagination.interface';
import { Lead } from '../models/Lead.model';
import { ApiError } from '../utils/ApiError';
import { buildPaginationMeta } from '../utils/paginationHelper';
import { PAGE_LIMIT, EXPORT_LIMIT } from '../constants';
import { UserRole } from '../constants/enums';
import type {
  CreateLeadInput,
  UpdateLeadInput,
  LeadQuery,
} from '../validators/lead.validators';

export class LeadService {
  private static escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private static buildQuery(
    filters: LeadQuery,
    userId: string,
    role: UserRole
  ): FilterQuery<ILead> {
    const query: FilterQuery<ILead> = {};

    if (role === UserRole.SALES) {
      query.createdBy = new Types.ObjectId(userId);
    }

    if (filters.status) query.status = filters.status;
    if (filters.source) query.source = filters.source;

    const search = filters.search?.trim();
    if (search) {
      const pattern = new RegExp(LeadService.escapeRegex(search), 'i');
      query.$or = [{ name: pattern }, { email: pattern }];
    }

    return query;
  }

  static async getLeads(
    filters: LeadQuery,
    userId: string,
    role: UserRole
  ): Promise<IPaginatedResponse<ILead>> {
    const query = LeadService.buildQuery(filters, userId, role);
    const sortOrder = filters.sort === 'oldest' ? 1 : -1;
    const page = filters.page ?? 1;
    const skip = (page - 1) * PAGE_LIMIT;

    const [leads, total] = await Promise.all([
      Lead.find(query).sort({ createdAt: sortOrder }).skip(skip).limit(PAGE_LIMIT),
      Lead.countDocuments(query),
    ]);

    return {
      data: leads,
      pagination: buildPaginationMeta(page, PAGE_LIMIT, total),
    };
  }

  static async createLead(input: CreateLeadInput, userId: string): Promise<ILead> {
    return Lead.create({ ...input, createdBy: userId });
  }

  static async getLeadById(id: string, userId: string, role: UserRole): Promise<ILead> {
    const lead = await Lead.findById(id);

    if (!lead) throw ApiError.notFound('Lead not found');

    if (role === UserRole.SALES && lead.createdBy.toString() !== userId) {
      throw ApiError.forbidden('You do not have access to this lead');
    }

    return lead;
  }

  static async updateLead(
    id: string,
    input: UpdateLeadInput,
    userId: string,
    role: UserRole
  ): Promise<ILead> {
    // Single atomic query — ownership check is embedded in the filter
    const ownerFilter = role === UserRole.SALES ? { createdBy: userId } : {};
    const updated = await Lead.findOneAndUpdate(
      { _id: id, ...ownerFilter },
      input,
      { new: true, runValidators: true }
    );

    if (!updated) {
      // Distinguish 403 from 404 for sales users
      if (role === UserRole.SALES && await Lead.exists({ _id: id })) {
        throw ApiError.forbidden('You do not have access to this lead');
      }
      throw ApiError.notFound('Lead not found');
    }

    return updated;
  }

  static async deleteLead(id: string): Promise<void> {
    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) throw ApiError.notFound('Lead not found');
  }

  static async getLeadsForExport(
    filters: LeadQuery,
    userId: string,
    role: UserRole
  ): Promise<ILead[]> {
    const query = LeadService.buildQuery(filters, userId, role);
    return Lead.find(query).sort({ createdAt: -1 }).limit(EXPORT_LIMIT);
  }
}
