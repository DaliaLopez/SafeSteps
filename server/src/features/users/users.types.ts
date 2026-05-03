export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface CreateUserDBDTO {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface UpdateUserDTO {
    id: string;
    name: string;
}