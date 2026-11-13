"use server";

import { ApiError } from "../config/api-client";
import {
  getAuthTokenServer,
  getAuthUserServer,
  setAuthCookies,
} from "../config/cookies";
import {
  extractUserFromProfileResponse,
  profileService,
} from "../services/profile.service";
import type { SimpleActionResult } from "../types/auth.types";
import type {
  ChangePasswordPayload,
  ProfileActionResult,
  UpdateProfilePayload,
} from "../types/profile.types";

function extractProfileError(err: unknown, fallbackMessage: string) {
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
 * Server action to fetch current user profile from GET /api/profile
 */
export async function getProfileAction(
  fallbackToken?: string
): Promise<ProfileActionResult> {
  try {
    const token = (await getAuthTokenServer()) || fallbackToken;
    if (!token) {
      return {
        success: false,
        error: "يجب تسجيل الدخول للوصول إلى بيانات الحساب",
      };
    }

    const response = await profileService.getProfile(token);
    const user = extractUserFromProfileResponse(response);

    if (user) {
      await setAuthCookies(token, user, true);
    }

    return {
      success: true,
      message: response.message,
      user,
    };
  } catch (err) {
    return extractProfileError(err, "تعذر تحميل بيانات الحساب");
  }
}

/**
 * Server action to update user profile (name & email) via /api/profile
 */
export async function updateProfileAction(
  payload: UpdateProfilePayload,
  fallbackToken?: string
): Promise<ProfileActionResult> {
  try {
    const token = (await getAuthTokenServer()) || fallbackToken;
    if (!token) {
      return {
        success: false,
        error: "انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى",
      };
    }

    const response = await profileService.updateProfile(token, payload);
    const currentUser = await getAuthUserServer();
    const apiUser = extractUserFromProfileResponse(response);

    const updatedUser =
      apiUser ||
      (currentUser
        ? {
            ...currentUser,
            name: payload.name.trim(),
            email: payload.email.trim(),
          }
        : undefined);

    if (updatedUser) {
      await setAuthCookies(token, updatedUser, true);
    }

    return {
      success: true,
      message: response.message || "تم تحديث بيانات الحساب بنجاح",
      user: updatedUser,
    };
  } catch (err) {
    return extractProfileError(err, "فشل تحديث بيانات الحساب، يرجى المحاولة لاحقاً");
  }
}

/**
 * Server action to change user password via /api/profile/password
 */
export async function changePasswordAction(
  payload: ChangePasswordPayload,
  fallbackToken?: string
): Promise<SimpleActionResult> {
  try {
    const token = (await getAuthTokenServer()) || fallbackToken;
    if (!token) {
      return {
        success: false,
        error: "انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى",
      };
    }

    const response = await profileService.changePassword(token, payload);
    return {
      success: true,
      message: response.message || "تم تغيير كلمة المرور بنجاح",
    };
  } catch (err) {
    return extractProfileError(err, "تعذر تغيير كلمة المرور، يرجى التحقق من كلمة المرور الحالية");
  }
}

