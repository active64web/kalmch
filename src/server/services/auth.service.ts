import { LoginCredentials, RegisterCredentials, UserProfile } from "../types/auth.types";

export const authService = {
    async login(credentials: LoginCredentials): Promise<{ user: UserProfile; token: string }> {
        // Will be connected to backend API
        return {
            user: {
                id: "user-1",
                fullName: "Guest User",
                email: credentials.email,
                role: "patient",
                createdAt: new Date().toISOString()
            },
            token: "mock-jwt-token"
        };
    },

    async register(data: RegisterCredentials): Promise<{ user: UserProfile; token: string }> {
        // Will be connected to backend API
        return {
            user: {
                id: "user-new",
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                role: "patient",
                createdAt: new Date().toISOString()
            },
            token: "mock-jwt-token"
        };
    },

    async forgotPassword(email: string): Promise<{ success: boolean }> {
        // Will trigger password reset email via server action or API
        if (!email) throw new Error("Email is required");
        return { success: true };
    }
};
