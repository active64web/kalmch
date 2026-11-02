"use client";

import React, { useState } from "react";
import { User, Phone, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { GoogleIcon } from "./GoogleIcon";
import styles from "./AuthContainer.module.scss";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
}) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!fullName.trim() || !phone.trim() || !email.trim() || !password) {
      setErrorMessage("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("يجب أن تتكون كلمة المرور من 8 أحرف على الأقل");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("كلمتا المرور غير متطابقتين");
      return;
    }

    setIsLoading(true);
    // Simulate register
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(
        "تم إنشاء الحساب بنجاح! مرحباً بك في عائلة قَلَم، جاري الدخول..."
      );
    }, 900);
  };

  const handleGoogleRegister = () => {
    setIsLoading(true);
    setErrorMessage("");
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("تم إنشاء الحساب والربط بنجاح عبر حساب Google!");
    }, 800);
  };

  return (
    <form onSubmit={handleRegisterSubmit} className={styles.formContainer}>
      {/* 1. Quick Google Register */}
      <button
        type="button"
        onClick={handleGoogleRegister}
        disabled={isLoading}
        className={styles.googleOAuthBtn}
      >
        <GoogleIcon size={20} />
        <span>التسجيل السريع بحساب Google</span>
      </button>

      {/* 2. Visual Divider */}
      <div className={styles.dividerRow}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>أو ببيانات حساب جديد</span>
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

      {/* 3. Full Name */}
      <div className={styles.inputGroup}>
        <label htmlFor="reg-name" className={styles.inputLabel}>
          الاسم بالكامل
        </label>
        <div className={styles.inputWrapper}>
          <User size={18} className={styles.inputIcon} />
          <input
            id="reg-name"
            type="text"
            required
            placeholder="مثال: يوسف ميخائيل"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={styles.textInput}
          />
        </div>
      </div>

      {/* 4. Phone Number */}
      <div className={styles.inputGroup}>
        <label htmlFor="reg-phone" className={styles.inputLabel}>
          رقم الهاتف
        </label>
        <div className={styles.inputWrapper}>
          <Phone size={18} className={styles.inputIcon} />
          <input
            id="reg-phone"
            type="tel"
            required
            placeholder="01234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={styles.textInput}
            dir="ltr"
          />
        </div>
      </div>

      {/* 5. Email */}
      <div className={styles.inputGroup}>
        <label htmlFor="reg-email" className={styles.inputLabel}>
          البريد الإلكتروني
        </label>
        <div className={styles.inputWrapper}>
          <Mail size={18} className={styles.inputIcon} />
          <input
            id="reg-email"
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.textInput}
            dir="ltr"
          />
        </div>
      </div>

      {/* 6. Password */}
      <div className={styles.inputGroup}>
        <label htmlFor="reg-password" className={styles.inputLabel}>
          كلمة السر
        </label>
        <div className={styles.inputWrapper}>
          <Lock size={18} className={styles.inputIcon} />
          <input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="8 أحرف على الأقل"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.textInput}
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

      {/* 7. Confirm Password */}
      <div className={styles.inputGroup}>
        <label htmlFor="reg-confirm-password" className={styles.inputLabel}>
          تأكيد كلمة السر
        </label>
        <div className={styles.inputWrapper}>
          <Lock size={18} className={styles.inputIcon} />
          <input
            id="reg-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            required
            placeholder="أعد كتابة كلمة السر"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.textInput}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={styles.eyeBtn}
            tabIndex={-1}
            aria-label={
              showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
            }
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={styles.submitBtn}
      >
        <UserPlus size={18} />
        <span>{isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب جديد"}</span>
      </button>

      {/* 10. Switch to Login */}
      <div className={styles.switchAuthRow}>
        <span>لديك حساب بالفعل؟</span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className={styles.switchLinkBtn}
        >
          تسجيل الدخول
        </button>
      </div>
    </form>
  );
};

