import { apiClient } from "../config/api-client";
import type {
    AuthSuccessResponse,
    LoginCredentials,
    RegisterCredentials,
    GoogleAuthCredentials,
    ForgotPasswordPayload,
    VerifyResetCodePayload,
    ResetPasswordPayload,
    ApiMessageResponse,
    VerifyResetCodeResponse,
} from "../types/auth.types";

export const authService = {
    /**
     * Login user with email & password
     * Endpoint: POST /api/login
     */
    async login(credentials: LoginCredentials): Promise<AuthSuccessResponse> {
        return apiClient<AuthSuccessResponse>("/api/login", {
            method: "POST",
            body: JSON.stringify({
                email: credentials.email.trim(),
                password: credentials.password,
            }),
        });
    },

    /**
     * Register new user
     * Endpoint: POST /api/register
     */
    async register(data: RegisterCredentials): Promise<AuthSuccessResponse> {
        return apiClient<AuthSuccessResponse>("/api/register", {
            method: "POST",
            body: JSON.stringify({
                name: data.name.trim(),
                email: data.email.trim(),
                password: data.password,
                password_confirmation: data.password_confirmation || data.password,
            }),
        });
    },

    /**
     * Google OAuth login with Google Access Token
     * Endpoint: POST /api/auth/google
     */
    async googleLogin(
        credentials: GoogleAuthCredentials
    ): Promise<AuthSuccessResponse> {
        return apiClient<AuthSuccessResponse>("/api/auth/google", {
            method: "POST",
            body: JSON.stringify({
                token: credentials.token,
            }),
        });
    },

    /**
     * Logout user from current device
     * Endpoint: POST /api/logout
     */
    async logout(token: string): Promise<ApiMessageResponse> {
        return apiClient<ApiMessageResponse>("/api/logout", {
            method: "POST",
            token,
        });
    },

    /**
     * Send password reset OTP to user email
     * Endpoint: POST /api/forgot-password
     */
    async forgotPassword(
        payload: ForgotPasswordPayload
    ): Promise<ApiMessageResponse> {
        return apiClient<ApiMessageResponse>("/api/forgot-password", {
            method: "POST",
            body: JSON.stringify({
                email: payload.email.trim(),
            }),
        });
    },

    /**
     * Verify OTP code and retrieve reset_token
     * Endpoint: POST /api/verify-reset-code
     */
    async verifyResetCode(
        payload: VerifyResetCodePayload
    ): Promise<VerifyResetCodeResponse> {
        return apiClient<VerifyResetCodeResponse>("/api/verify-reset-code", {
            method: "POST",
            body: JSON.stringify({
                email: payload.email.trim(),
                code: payload.code.trim(),
            }),
        });
    },

    /**
     * Reset password using reset_token
     * Endpoint: POST /api/reset-password
     */
    async resetPassword(
        payload: ResetPasswordPayload
    ): Promise<ApiMessageResponse> {
        return apiClient<ApiMessageResponse>("/api/reset-password", {
            method: "POST",
            body: JSON.stringify({
                email: payload.email.trim(),
                reset_token: payload.reset_token,
                password: payload.password,
                password_confirmation: payload.password_confirmation,
            }),
        });
    },
};
