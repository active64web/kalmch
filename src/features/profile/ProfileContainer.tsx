"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Bookmark,
  LogOut,
  Save,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Calendar,
  LogIn,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { User } from "@/server/types/auth.types";
import {
  getProfileAction,
  updateProfileAction,
  changePasswordAction,
} from "@/server/actions/profile.actions";
import styles from "./ProfileContainer.module.scss";

interface PasswordFieldConfig {
  id: string;
  key: "current" | "next" | "confirm";
  label: string;
  placeholder: string;
  autoComplete: string;
}

const PASSWORD_FIELDS: PasswordFieldConfig[] = [
  {
    id: "profile-current-password",
    key: "current",
    label: "كلمة المرور الحالية",
    placeholder: "أدخل كلمة المرور الحالية",
    autoComplete: "current-password",
  },
  {
    id: "profile-new-password",
    key: "next",
    label: "كلمة المرور الجديدة",
    placeholder: "8 أحرف على الأقل",
    autoComplete: "new-password",
  },
  {
    id: "profile-confirm-password",
    key: "confirm",
    label: "تأكيد كلمة المرور الجديدة",
    placeholder: "أعد كتابة كلمة المرور الجديدة",
    autoComplete: "new-password",
  },
];

function formatMemberDate(dateStr?: string): string | null {
  if (!dateStr) return null;
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface ProfileContentProps {
  user: User;
  token: string;
  updateUser: (updatedUser: User) => void;
  logout: () => Promise<void>;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  user,
  token,
  updateUser,
  logout,
}) => {
  const router = useRouter();

  // Sync state from GET /api/profile
  const [isSyncing, setIsSyncing] = useState(true);

  // Profile info form state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  // Password change form state
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    let active = true;

    const syncProfile = async () => {
      const res = await getProfileAction(token);
      if (!active) return;

      if (res.success && res.user) {
        setName(res.user.name);
        setEmail(res.user.email);
        updateUser(res.user);
      }
      setIsSyncing(false);
    };

    syncProfile();
    return () => {
      active = false;
    };
  }, [token, updateUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (!name.trim()) {
      setProfileError("يرجى إدخال الاسم الكامل");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setProfileError("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    setProfileSaving(true);
    const res = await updateProfileAction(
      { name: name.trim(), email: email.trim() },
      token
    );
    setProfileSaving(false);

    if (!res.success) {
      setProfileError(res.error || "تعذر تحديث بيانات الحساب");
      return;
    }

    if (res.user) {
      updateUser(res.user);
      setName(res.user.name);
      setEmail(res.user.email);
    }
    setProfileSuccess(res.message || "تم تحديث بيانات الحساب بنجاح");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwords.current) {
      setPasswordError("يرجى إدخال كلمة المرور الحالية");
      return;
    }
    if (passwords.next.length < 8) {
      setPasswordError("يجب ألا تقل كلمة المرور الجديدة عن 8 أحرف");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordError("كلمة المرور الجديدة وتأكيدها غير متطابقتين");
      return;
    }

    setPasswordSaving(true);
    const res = await changePasswordAction(
      {
        current_password: passwords.current,
        password: passwords.next,
        password_confirmation: passwords.confirm,
      },
      token
    );
    setPasswordSaving(false);

    if (!res.success) {
      setPasswordError(res.error || "تعذر تغيير كلمة المرور");
      return;
    }

    setPasswords({ current: "", next: "", confirm: "" });
    setPasswordSuccess(res.message || "تم تغيير كلمة المرور بنجاح");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  const avatarInitial = user.name.trim().charAt(0).toUpperCase() || "ق";
  const memberDate = formatMemberDate(user.created_at);
  const hasProfileChanges =
    name.trim() !== user.name.trim() || email.trim() !== user.email.trim();

  return (
    <div className={styles.profileGrid}>
      {/* 1. Summary Sidebar Card */}
      <aside className={styles.summaryCard} aria-label="ملخص الحساب">
        <div className={styles.avatarCircle} aria-hidden="true">
          {avatarInitial}
        </div>
        <h2 className={styles.userName}>{user.name}</h2>
        <p className={styles.userEmail} dir="ltr">
          {user.email}
        </p>

        <span className={styles.accountBadge}>
          <ShieldCheck size={14} />
          <span>{user.google_id ? "حساب مرتبط بـ Google" : "عضو في منصة قَلَم"}</span>
        </span>

        <div className={styles.metaList}>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>حالة الحساب</span>
            <span className={styles.metaValue}>نشط</span>
          </div>
          {memberDate && (
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>
                <Calendar size={14} />
                <span>تاريخ الانضمام</span>
              </span>
              <span className={styles.metaValue}>{memberDate}</span>
            </div>
          )}
        </div>

        <div className={styles.sidebarActions}>
          <Link href="/my-library" className={styles.libraryLinkBtn}>
            <Bookmark size={17} />
            <span>الانتقال إلى مكتبتي</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className={styles.logoutBtn}
          >
            <LogOut size={17} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* 2. Profile & Security Forms Column */}
      <div className={styles.formsColumn}>
        {/* Card A: Personal Info */}
        <section className={styles.formCard} aria-label="تعديل بيانات الحساب">
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleGroup}>
              <div className={styles.cardIconBox}>
                <UserIcon size={20} />
              </div>
              <div>
                <h2 className={styles.cardTitle}>البيانات الشخصية</h2>
                <p className={styles.cardSubtitle}>
                  حدّث اسمك وبريدك الإلكتروني المرتبط بحسابك
                </p>
              </div>
            </div>
            {isSyncing && (
              <span className={styles.syncBadge}>جاري المزامنة...</span>
            )}
          </div>

          <form onSubmit={handleUpdateProfile} className={styles.formBody}>
            {profileError && (
              <div className={styles.alertError} role="alert">
                <AlertCircle size={16} />
                <span>{profileError}</span>
              </div>
            )}
            {profileSuccess && (
              <div className={styles.alertSuccess} role="status">
                <CheckCircle2 size={16} />
                <span>{profileSuccess}</span>
              </div>
            )}

            <div className={styles.fieldsRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="profile-name" className={styles.inputLabel}>
                  الاسم الكامل
                </label>
                <div className={styles.inputWrapper}>
                  <UserIcon size={18} className={styles.inputIcon} />
                  <input
                    id="profile-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setProfileSuccess("");
                    }}
                    placeholder="أدخل اسمك الكامل"
                    className={styles.textInput}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="profile-email" className={styles.inputLabel}>
                  البريد الإلكتروني
                </label>
                <div className={styles.inputWrapper}>
                  <Mail size={18} className={styles.inputIcon} />
                  <input
                    id="profile-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setProfileSuccess("");
                    }}
                    placeholder="name@example.com"
                    className={styles.textInput}
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            <div className={styles.submitRow}>
              <button
                type="submit"
                disabled={profileSaving || !hasProfileChanges}
                className={styles.submitBtn}
              >
                <Save size={17} />
                <span>{profileSaving ? "جاري الحفظ..." : "حفظ التعديلات"}</span>
              </button>
            </div>
          </form>
        </section>

        {/* Card B: Change Password */}
        <section className={styles.formCard} aria-label="تغيير كلمة المرور">
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleGroup}>
              <div className={styles.cardIconBox}>
                <KeyRound size={20} />
              </div>
              <div>
                <h2 className={styles.cardTitle}>الأمان وكلمة المرور</h2>
                <p className={styles.cardSubtitle}>
                  حافظ على أمان حسابك بتحديث كلمة المرور بشكل دوري
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className={styles.formBody}>
            {passwordError && (
              <div className={styles.alertError} role="alert">
                <AlertCircle size={16} />
                <span>{passwordError}</span>
              </div>
            )}
            {passwordSuccess && (
              <div className={styles.alertSuccess} role="status">
                <CheckCircle2 size={16} />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {PASSWORD_FIELDS.map((field) => {
              const isVisible = showPasswords[field.key];
              return (
                <div key={field.id} className={styles.inputGroup}>
                  <label htmlFor={field.id} className={styles.inputLabel}>
                    {field.label}
                  </label>
                  <div className={styles.inputWrapper}>
                    <Lock size={18} className={styles.inputIcon} />
                    <input
                      id={field.id}
                      type={isVisible ? "text" : "password"}
                      required
                      autoComplete={field.autoComplete}
                      placeholder={field.placeholder}
                      value={passwords[field.key]}
                      onChange={(e) => {
                        setPasswords((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }));
                        setPasswordSuccess("");
                      }}
                      className={`${styles.textInput} ${styles.passwordInput}`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          [field.key]: !prev[field.key],
                        }))
                      }
                      className={styles.eyeBtn}
                      aria-label={
                        isVisible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                      }
                      tabIndex={-1}
                    >
                      {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              );
            })}

            <div className={styles.submitRow}>
              <button
                type="submit"
                disabled={passwordSaving}
                className={styles.submitBtn}
              >
                <Lock size={17} />
                <span>
                  {passwordSaving ? "جاري التحديث..." : "تغيير كلمة المرور"}
                </span>
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export const ProfileContainer: React.FC = () => {
  const { user, token, isAuthenticated, isLoading, updateUser, logout } =
    useAuth();

  if (isLoading) {
    return (
      <div className={styles.stateCard} aria-label="جاري تحميل بيانات الحساب">
        <div className={styles.spinner} />
        <p className={styles.stateDescription}>جاري تحميل بيانات حسابك...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user || !token) {
    return (
      <div className={styles.stateCard}>
        <div className={styles.stateIconCircle} aria-hidden="true">
          <UserIcon size={34} />
        </div>
        <h2 className={styles.stateTitle}>يجب تسجيل الدخول أولاً</h2>
        <p className={styles.stateDescription}>
          سجّل دخولك للوصول إلى صفحة حسابك الشخصي، تعديل بياناتك، وإدارة إعدادات
          الأمان الخاصة بك.
        </p>
        <Link href="/login" className={styles.submitBtn}>
          <LogIn size={17} />
          <span>تسجيل الدخول</span>
        </Link>
      </div>
    );
  }

  return (
    <ProfileContent
      key={user.id}
      user={user}
      token={token}
      updateUser={updateUser}
      logout={logout}
    />
  );
};

