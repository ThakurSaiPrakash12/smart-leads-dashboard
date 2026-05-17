import { IPaginationMeta } from '../interfaces';

export const buildPaginationMeta = (
  page: number,
  limit: number,
  total: number
): IPaginationMeta => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
