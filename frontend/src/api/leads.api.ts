import api from './axios';
import type { ApiResponse, PaginatedResponse } from '../types/api.types';
import type { Lead, CreateLeadInput, UpdateLeadInput, LeadFilters } from '../types/lead.types';
import { buildQueryString } from '../utils/helpers';

export async function getLeads(filters: LeadFilters): Promise<PaginatedResponse<Lead>> {
  const response = await api.get<PaginatedResponse<Lead>>(`/leads${buildQueryString(filters)}`);
  return response.data;
}

export async function getLeadById(id: string): Promise<ApiResponse<Lead>> {
  const response = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
  return response.data;
}

export async function createLead(data: CreateLeadInput): Promise<ApiResponse<Lead>> {
  const response = await api.post<ApiResponse<Lead>>('/leads', data);
  return response.data;
}

export async function updateLead(id: string, data: UpdateLeadInput): Promise<ApiResponse<Lead>> {
  const response = await api.put<ApiResponse<Lead>>(`/leads/${id}`, data);
  return response.data;
}

export async function deleteLead(id: string): Promise<ApiResponse<null>> {
  const response = await api.delete<ApiResponse<null>>(`/leads/${id}`);
  return response.data;
}

export async function exportLeadsCSV(filters: Omit<LeadFilters, 'page'>): Promise<void> {
  const response = await api.get(`/leads/export${buildQueryString(filters)}`, {
    responseType: 'blob',
  });

  const blob = new Blob([response.data as BlobPart], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const today = new Date().toISOString().split('T')[0];
  const link = document.createElement('a');
  link.href = url;
  link.download = `leads-${today}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
