export interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    role: "patient" | "partner" | "admin";
    avatarUrl?: string;
    createdAt: string;
}

export interface LoginCredentials {
    email: string;
    password?: string;
    rememberMe?: boolean;
}

export interface RegisterCredentials {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
}
