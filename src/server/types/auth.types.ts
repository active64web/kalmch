export interface User {
  id: number | string;
  name: string;
  email: string;
  google_id?: string | null;
  email_verified_at?: string | null;
  phone?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface AuthSuccessResponse {
  success: true;
  message: string;
  data: AuthResponseData;
}

export interface AuthErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type AuthResponse = AuthSuccessResponse;

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  phone?: string;
}

export interface GoogleAuthCredentials {
  token: string;
}

export interface AuthActionResult {
  success: boolean;
  message?: string;
  error?: string;
  user?: User;
  token?: string;
  errors?: Record<string, string[]>;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyResetCodePayload {
  email: string;
  code: string;
}

export interface ResetPasswordPayload {
  email: string;
  reset_token: string;
  password: string;
  password_confirmation: string;
}

export interface ApiMessageResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export interface VerifyResetCodeResponse {
  success: boolean;
  message: string;
  reset_token?: string;
  data?: {
    reset_token?: string;
    token?: string;
  };
}

export interface SimpleActionResult {
  success: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface VerifyResetCodeActionResult extends SimpleActionResult {
  reset_token?: string;
}
