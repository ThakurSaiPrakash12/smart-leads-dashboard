import type { LeadFilters } from '../types/lead.types';
import type { AxiosError } from 'axios';

interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function buildQueryString(filters: LeadFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params.append(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const validationErrors = axiosError?.response?.data?.errors;
  if (validationErrors?.length) {
    return validationErrors.join('\n');
  }
  if (axiosError?.response?.data?.message) {
    return axiosError.response.data.message;
  }
  if (axiosError?.message) {
    return axiosError.message;
  }
  return 'Something went wrong';
}
