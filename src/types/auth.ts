import { Role } from '@prisma/client'

// JWT Payload interface
export interface JWTPayload {
    userId: string
    email: string
    role: Role
    iat: number
    exp: number
}

// Authenticated user interface
export interface AuthUser {
    userId: string
    email: string
    role: Role
}

// Login credentials
export interface LoginCredentials {
    email: string
    password: string
}

// Registration data
export interface RegisterData extends LoginCredentials {
    name: string
    phone?: string
}

// Auth response
export interface AuthResponse {
    user: {
        id: string
        email: string
        name: string
        role: Role
    }
    token: string
}
