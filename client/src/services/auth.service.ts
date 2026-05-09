import api from './api';
import type { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from '../types/auth.types';

export const loginService = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  localStorage.setItem('token', data.session.access_token);
  return data;
};

export const registerService = async (payload: RegisterPayload): Promise<AuthUser> => {
  const { data } = await api.post<AuthUser>('/auth/register', payload);
  return data;
};

export const logoutService = () => {
  localStorage.removeItem('token');
};
