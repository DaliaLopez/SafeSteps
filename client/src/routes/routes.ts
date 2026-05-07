import type { UserRole } from '../types/authType'

export const DEFAULT_POST_LOGIN_REDIRECT = '/admin/dashboard'

export const roleToRedirectPath: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  student: '/student/dashboard',
  accessibility: '/accessibility/dashboard',
}

export function getRedirectPathForRole(role: unknown): string {
  if (role === 'admin' || role === 'student' || role === 'accessibility') {
    return roleToRedirectPath[role]
  }
  return DEFAULT_POST_LOGIN_REDIRECT
}

