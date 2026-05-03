export const UserRole = {
    ADMIN: 'admin',
    STUDENT: 'student',
    ACCESSIBILITY: 'accessibility',
} as const;


export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface CreateUserDTO {
    email: string;
    name: string;
    password: string;
    role: UserRole;
}

export interface AuthenticateUserDTO {
    email: string;
    password: string;
}