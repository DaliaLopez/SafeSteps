import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'student' | 'accessibility';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  session: { access_token: string; refresh_token: string };
  user: AuthUser;
}

// ── Auth calls ───────────────────────────────────────────────────────────────

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

export default api;
