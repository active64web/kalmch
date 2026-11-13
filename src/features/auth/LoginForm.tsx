"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { GoogleIcon } from "./GoogleIcon";
import { useAuth } from "@/context/AuthContext";
import { promptGoogleAccessToken } from "@/utils/google-auth";
import styles from "./AuthContainer.module.scss";

interface LoginFormProps {
  onForgotPassword: () => void;
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onForgotPassword,
  onSwitchToRegister,
}) => {
  const router = useRouter();
  const { login, googleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({
        email: email.trim(),
        password,
        rememberMe,
      });

      if (result.success) {
        setSuccessMessage(
          result.message || "مرحباً بك مجدداً! جاري الدخول إلى حسابك..."
        );
        setTimeout(() => {
          router.push("/my-library");
          router.refresh();
        }, 600);
      } else {
        setErrorMessage(
          result.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة"
        );
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "حدث خطأ غير متوقع أثناء تسجيل الدخول"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const googleToken = await promptGoogleAccessToken();
      const result = await googleLogin(googleToken);

      if (result.success) {
        setSuccessMessage(
          result.message || "تم تسجيل الدخول بنجاح عبر حساب Google!"
        );
        setTimeout(() => {
          router.push("/my-library");
          router.refresh();
        }, 600);
      } else {
        setErrorMessage(result.error || "فشل تسجيل الدخول عبر حساب Google");
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "تعذر إكمال تسجيل الدخول عبر Google"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLoginSubmit} className={styles.formContainer}>
      {/* 1. Quick Google Login */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className={styles.googleOAuthBtn}
      >
        <GoogleIcon size={20} />
        <span>الدخول السريع بحساب Google</span>
      </button>

      {/* 2. Visual Divider */}
      <div className={styles.dividerRow}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>أو بالبريد الإلكتروني</span>
        <span className={styles.dividerLine} />
      </div>

      {errorMessage && (
        <div className={styles.alertError} role="alert">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className={styles.alertSuccess} role="status">
          {successMessage}
        </div>
      )}

      {/* 3. Email Input */}
      <div className={styles.inputGroup}>
        <label htmlFor="login-email" className={styles.inputLabel}>
          البريد الإلكتروني
        </label>
        <div className={styles.inputWrapper}>
          <Mail size={18} className={styles.inputIcon} />
          <input
            id="login-email"
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.textInput}
            dir="ltr"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* 4. Password Input */}
      <div className={styles.inputGroup}>
        <div className={styles.labelRow}>
          <label htmlFor="login-password" className={styles.inputLabel}>
            كلمة المرور
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className={styles.forgotPassBtn}
          >
            نسيت كلمة السر؟
          </button>
        </div>
        <div className={styles.inputWrapper}>
          <Lock size={18} className={styles.inputIcon} />
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.textInput}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.eyeBtn}
            tabIndex={-1}
            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* 5. Remember Me Checkbox */}
      <div className={styles.rememberRow}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className={styles.checkboxInput}
            disabled={isLoading}
          />
          <span className={styles.checkboxCustom} />
          <span className={styles.checkboxText}>
            تذكر تسجيل دخولي على هذا الجهاز
          </span>
        </label>
      </div>

      {/* 6. Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={styles.submitBtn}
      >
        <LogIn size={18} />
        <span>{isLoading ? "جاري التحقق..." : "تسجيل الدخول"}</span>
      </button>

      {/* 7. Switch to Register */}
      <div className={styles.switchAuthRow}>
        <span>ليس لديك حساب بعد؟</span>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className={styles.switchLinkBtn}
        >
          إنشاء حساب جديد
        </button>
      </div>
    </form>
  );
};
