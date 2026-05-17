import api from './axios';
import type { ApiResponse } from '../types/api.types';
import type { User, LoginInput, RegisterInput } from '../types/auth.types';

export async function register(data: RegisterInput): Promise<ApiResponse<User>> {
  const response = await api.post<ApiResponse<User>>('/auth/register', data);
  return response.data;
}

export async function login(data: LoginInput): Promise<ApiResponse<{ user: User }>> {
  const response = await api.post<ApiResponse<{ user: User }>>('/auth/login', data);
  return response.data;
}

export async function logout(): Promise<ApiResponse<null>> {
  const response = await api.post<ApiResponse<null>>('/auth/logout');
  return response.data;
}

export async function getMe(): Promise<ApiResponse<User>> {
  const response = await api.get<ApiResponse<User>>('/auth/me');
  return response.data;
}
