"use client";

import React, { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ForgotPasswordFlow } from "./ForgotPasswordFlow";
import styles from "./AuthContainer.module.scss";

export type AuthTab = "login" | "register";

interface AuthContainerProps {
  initialTab?: AuthTab;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  initialTab = "login",
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authContent}>
        {/* Tab Switcher (Visible only when not in forgot password flow) */}
        {!isForgotPassword && (
          <div className={styles.tabsSwitcher} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "login"}
              onClick={() => setActiveTab("login")}
              className={`${styles.tabBtn} ${
                activeTab === "login" ? styles.activeTab : ""
              }`}
            >
              <LogIn size={18} />
              <span>تسجيل الدخول</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "register"}
              onClick={() => setActiveTab("register")}
              className={`${styles.tabBtn} ${
                activeTab === "register" ? styles.activeTab : ""
              }`}
            >
              <UserPlus size={18} />
              <span>إنشاء حساب جديد</span>
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className={styles.formBody}>
          {isForgotPassword ? (
            <ForgotPasswordFlow
              onBackToLogin={() => {
                setIsForgotPassword(false);
                setActiveTab("login");
              }}
            />
          ) : activeTab === "login" ? (
            <LoginForm
              onForgotPassword={() => setIsForgotPassword(true)}
              onSwitchToRegister={() => setActiveTab("register")}
            />
          ) : (
            <RegisterForm onSwitchToLogin={() => setActiveTab("login")} />
          )}
        </div>
      </div>
    </div>
  );
};

