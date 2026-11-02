"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  RotateCcw,
} from "lucide-react";
import styles from "./AuthContainer.module.scss";

interface ForgotPasswordFlowProps {
  onBackToLogin: () => void;
}

type ForgotStage = "email" | "otp" | "reset" | "success";

export const ForgotPasswordFlow: React.FC<ForgotPasswordFlowProps> = ({
  onBackToLogin,
}) => {
  const [stage, setStage] = useState<ForgotStage>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(59);
  const [isResendActive, setIsResendActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (stage === "otp" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsResendActive(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [stage, countdown]);

  // Stage 1: Send OTP
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStage("otp");
      setCountdown(59);
      setIsResendActive(false);
    }, 600);
  };

  // Stage 2: OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const enteredCode = otp.join("");
    if (enteredCode.length < 4) {
      setErrorMsg("يرجى إدخال رمز التحقق كاملاً المكون من 4 أرقام");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStage("reset");
    }, 600);
  };

  const handleResendCode = () => {
    if (!isResendActive) return;
    setIsResendActive(false);
    setCountdown(59);
    setOtp(["", "", "", ""]);
    setErrorMsg("");
    otpInputsRef.current[0]?.focus();
  };

  // Stage 3: Reset Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (newPassword.length < 8) {
      setErrorMsg("يجب ألا تقل كلمة المرور عن 8 أحرف");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("كلمتا المرور غير متطابقتين");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStage("success");
    }, 600);
  };

  return (
    <div className={styles.forgotWrapper}>
      {/* Back button */}
      {stage !== "success" && (
        <button
          type="button"
          onClick={() => {
            if (stage === "otp") setStage("email");
            else if (stage === "reset") setStage("otp");
            else onBackToLogin();
          }}
          className={styles.backBtn}
        >
          <ArrowRight size={18} />
          <span>
            {stage === "email" ? "العودة لتسجيل الدخول" : "الخطوة السابقة"}
          </span>
        </button>
      )}

      {/* Progress Dots */}
      {stage !== "success" && (
        <div className={styles.stageIndicator} aria-label="مراحل استعادة الحساب">
          <span
            className={`${styles.stageDot} ${
              stage === "email" || stage === "otp" || stage === "reset"
                ? styles.activeDot
                : ""
            }`}
          />
          <span
            className={`${styles.stageLine} ${
              stage === "otp" || stage === "reset" ? styles.activeLine : ""
            }`}
          />
          <span
            className={`${styles.stageDot} ${
              stage === "otp" || stage === "reset" ? styles.activeDot : ""
            }`}
          />
          <span
            className={`${styles.stageLine} ${
              stage === "reset" ? styles.activeLine : ""
            }`}
          />
          <span
            className={`${styles.stageDot} ${
              stage === "reset" ? styles.activeDot : ""
            }`}
          />
        </div>
      )}

      {/* STAGE 1: ENTER EMAIL */}
      {stage === "email" && (
        <form onSubmit={handleSendEmail} className={styles.formContainer}>
          <div className={styles.formHeader}>
            <div className={styles.iconCircle}>
              <KeyRound size={24} />
            </div>
            <h2 className={styles.formTitle}>استعادة كلمة المرور</h2>
            <p className={styles.formSubtitle}>
              أدخل بريدك الإلكتروني المسجل وسنرسل لك رمز تحقق لإعادة تعيين كلمة
              المرور الخاصة بك.
            </p>
          </div>

          {errorMsg && <div className={styles.alertError}>{errorMsg}</div>}

          <div className={styles.inputGroup}>
            <label htmlFor="forgot-email" className={styles.inputLabel}>
              البريد الإلكتروني
            </label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                id="forgot-email"
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

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}
          >
            {isLoading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
          </button>
        </form>
      )}

      {/* STAGE 2: ENTER OTP */}
      {stage === "otp" && (
        <form onSubmit={handleVerifyOtp} className={styles.formContainer}>
          <div className={styles.formHeader}>
            <div className={styles.iconCircle}>
              <Mail size={24} />
            </div>
            <h2 className={styles.formTitle}>رمز التحقق</h2>
            <p className={styles.formSubtitle}>
              أرسلنا رمز تحقق مكوّن من 4 أرقام إلى بريدك:
              <br />
              <strong className={styles.highlightEmail}>{email}</strong>
            </p>
          </div>

          {errorMsg && <div className={styles.alertError}>{errorMsg}</div>}

          <div className={styles.otpBoxesRow} dir="ltr">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  otpInputsRef.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                className={styles.otpBox}
                autoFocus={idx === 0}
              />
            ))}
          </div>

          <div className={styles.resendRow}>
            {isResendActive ? (
              <button
                type="button"
                onClick={handleResendCode}
                className={styles.resendBtn}
              >
                <RotateCcw size={15} />
                <span>إعادة إرسال الرمز</span>
              </button>
            ) : (
              <span className={styles.timerText}>
                يمكنك طلب رمز جديد بعد:{" "}
                <strong>00:{countdown < 10 ? `0${countdown}` : countdown}</strong>
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}
          >
            {isLoading ? "جاري التحقق..." : "تأكيد الرمز والمتابعة"}
          </button>
        </form>
      )}

      {/* STAGE 3: SET NEW PASSWORD */}
      {stage === "reset" && (
        <form onSubmit={handleResetPassword} className={styles.formContainer}>
          <div className={styles.formHeader}>
            <div className={styles.iconCircle}>
              <Lock size={24} />
            </div>
            <h2 className={styles.formTitle}>كلمة مرور جديدة</h2>
            <p className={styles.formSubtitle}>
              قم بتعيين كلمة مرور قوية وجديدة لحسابك لا تقل عن 8 خانات.
            </p>
          </div>

          {errorMsg && <div className={styles.alertError}>{errorMsg}</div>}

          <div className={styles.inputGroup}>
            <label htmlFor="new-pass" className={styles.inputLabel}>
              كلمة المرور الجديدة
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="new-pass"
                type={showNewPassword ? "text" : "password"}
                required
                placeholder="أدخل 8 أحرف على الأقل"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.textInput}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className={styles.eyeBtn}
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirm-pass" className={styles.inputLabel}>
              تأكيد كلمة المرور الجديدة
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="confirm-pass"
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="أعد كتابة كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.textInput}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.eyeBtn}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}
          >
            {isLoading ? "جاري الحفظ..." : "حفظ كلمة المرور الجديدة"}
          </button>
        </form>
      )}

      {/* STAGE 4: SUCCESS */}
      {stage === "success" && (
        <div className={styles.successState}>
          <div className={styles.successIconCircle}>
            <CheckCircle2 size={44} />
          </div>
          <h2 className={styles.formTitle}>تم تعيين كلمة المرور بنجاح!</h2>
          <p className={styles.formSubtitle}>
            لقد تم تحديث بيانات أمان حسابك. يمكنك الآن استخدام كلمة المرور
            الجديدة لتسجيل الدخول إلى مكتبتك بكل سهولة.
          </p>
          <button
            type="button"
            onClick={onBackToLogin}
            className={styles.submitBtn}
          >
            تسجيل الدخول الآن
          </button>
        </div>
      )}
    </div>
  );
};

