"use server";

import { authService } from "../services/auth.service";
import {
  setAuthCookies,
  clearAuthCookies,
  getAuthTokenServer,
  getAuthUserServer,
} from "../config/cookies";
import { ApiError } from "../config/api-client";
import type {
  LoginCredentials,
  RegisterCredentials,
  GoogleAuthCredentials,
  AuthActionResult,
  ForgotPasswordPayload,
  VerifyResetCodePayload,
  ResetPasswordPayload,
  SimpleActionResult,
  VerifyResetCodeActionResult,
  User,
} from "../types/auth.types";

function extractActionError(err: unknown, fallbackMessage: string): SimpleActionResult {
  if (err instanceof ApiError) {
    return {
      success: false,
      error: err.message,
      errors: err.errors,
    };
  }
  return {
    success: false,
    error: err instanceof Error ? err.message : fallbackMessage,
  };
}

/**
 * Server action to log in user, authenticate with backend API, and store token in cookies
 */
export async function loginAction(
  credentials: LoginCredentials
): Promise<AuthActionResult> {
  try {
    const response = await authService.login(credentials);
    const { user, token } = response.data;

    // Save token and user in cookies
    await setAuthCookies(token, user, credentials.rememberMe ?? true);

    return {
      success: true,
      message: response.message || "تم تسجيل الدخول بنجاح",
      user,
      token,
    };
  } catch (err) {
    if (err instanceof ApiError) {
      return {
        success: false,
        error: err.message,
        errors: err.errors,
      };
    }
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "فشل تسجيل الدخول، يرجى المحاولة لاحقاً",
    };
  }
}

/**
 * Server action to register user with backend API, and store token in cookies
 */
export async function registerAction(
  data: RegisterCredentials
): Promise<AuthActionResult> {
  try {
    const response = await authService.register(data);
    const { user, token } = response.data;

    // Save token and user in cookies
    await setAuthCookies(token, user, true);

    return {
      success: true,
      message: response.message || "تم إنشاء الحساب بنجاح",
      user,
      token,
    };
  } catch (err) {
    if (err instanceof ApiError) {
      return {
        success: false,
        error: err.message,
        errors: err.errors,
      };
    }
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "فشل إنشاء الحساب، يرجى المحاولة لاحقاً",
    };
  }
}

/**
 * Server action for Google OAuth login with backend API, and store token in cookies
 */
export async function googleLoginAction(
  credentials: GoogleAuthCredentials
): Promise<AuthActionResult> {
  try {
    const response = await authService.googleLogin(credentials);
    const { user, token } = response.data;

    // Save token and user in cookies
    await setAuthCookies(token, user, true);

    return {
      success: true,
      message: response.message || "تم تسجيل الدخول بحساب Google بنجاح",
      user,
      token,
    };
  } catch (err) {
    if (err instanceof ApiError) {
      return {
        success: false,
        error: err.message,
        errors: err.errors,
      };
    }
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "فشل تسجيل الدخول بحساب Google",
    };
  }
}

/**
 * Server action to get current session from cookies
 */
export async function getSessionAction(): Promise<{
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}> {
  try {
    const [token, user] = await Promise.all([
      getAuthTokenServer(),
      getAuthUserServer(),
    ]);

    return {
      isAuthenticated: !!token && !!user,
      user,
      token,
    };
  } catch {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
    };
  }
}

/**
 * Server action to logout from backend API (POST /api/logout) and clear cookies
 */
export async function logoutAction(
  fallbackToken?: string
): Promise<{ success: boolean }> {
  try {
    const token = (await getAuthTokenServer()) || fallbackToken;
    if (token) {
      try {
        await authService.logout(token);
      } catch {
        // Proceed with clearing local cookies even if token already expired/revoked on server
      }
    }
    await clearAuthCookies();
    return { success: true };
  } catch {
    return { success: false };
  }
}

/**
 * Server action to send password reset OTP email
 * Endpoint: POST /api/forgot-password
 */
export async function forgotPasswordAction(
  payload: ForgotPasswordPayload
): Promise<SimpleActionResult> {
  try {
    const response = await authService.forgotPassword(payload);
    return {
      success: true,
      message: response.message || "تم إرسال رمز التحقق إلى بريدك الإلكتروني",
    };
  } catch (err) {
    return extractActionError(
      err,
      "تعذر إرسال رمز التحقق، يرجى التحقق من البريد الإلكتروني والمحاولة مرة أخرى"
    );
  }
}

/**
 * Server action to verify OTP code and obtain reset_token
 * Endpoint: POST /api/verify-reset-code
 */
export async function verifyResetCodeAction(
  payload: VerifyResetCodePayload
): Promise<VerifyResetCodeActionResult> {
  try {
    const response = await authService.verifyResetCode(payload);
    const resetToken =
      response.data?.reset_token ||
      response.reset_token ||
      response.data?.token;

    if (!resetToken) {
      return {
        success: false,
        error: "لم يتم استلام رمز إعادة التعيين من الخادم، يرجى المحاولة مجدداً",
      };
    }

    return {
      success: true,
      message: response.message || "تم التحقق من الرمز بنجاح",
      reset_token: resetToken,
    };
  } catch (err) {
    return extractActionError(
      err,
      "رمز التحقق غير صحيح أو منتهي الصلاحية"
    );
  }
}

/**
 * Server action to reset password using email + reset_token
 * Endpoint: POST /api/reset-password
 */
export async function resetPasswordAction(
  payload: ResetPasswordPayload
): Promise<SimpleActionResult> {
  try {
    const response = await authService.resetPassword(payload);
    return {
      success: true,
      message: response.message || "تم تعيين كلمة المرور الجديدة بنجاح",
    };
  } catch (err) {
    return extractActionError(
      err,
      "فشل إعادة تعيين كلمة المرور، يرجى المحاولة مرة أخرى"
    );
  }
}

