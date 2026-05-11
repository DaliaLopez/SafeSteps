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