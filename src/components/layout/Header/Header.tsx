"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  LogIn,
  X,
  Bookmark,
  User as UserIcon,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "./Header.module.scss";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "الاقسام", href: "/categories" },
  { label: "المؤلفين", href: "/authors" },
  { label: "المقالات", href: "/articles" },
  { label: "تواصل معنا", href: "/contact" },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Throttled scroll listener using requestAnimationFrame to eliminate scroll jank
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 15;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile search and user menu on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileSearchOpen(false);
    setIsUserMenuOpen(false);
  }

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Smooth mobile focus/blur without causing layout thrashing or keyboard animation stutter
  useEffect(() => {
    if (isMobileSearchOpen) {
      const timer = setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 200);
      return () => clearTimeout(timer);
    } else {
      mobileInputRef.current?.blur();
    }
  }, [isMobileSearchOpen]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchTerm.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        setIsMobileSearchOpen(false);
        mobileInputRef.current?.blur();
      }
    },
    [searchTerm, router]
  );

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <header
      className={`${styles.headerWrapper} ${
        isScrolled ? styles.scrolled : ""
      } ${isMobileSearchOpen ? styles.searchOpen : ""}`}
    >
      <div className={styles.headerContainer}>
        {/* 1. Brand Logo */}
        <Link href="/" className={styles.brandLink}>
          <div className={styles.logoImageWrapper}>
            <Image
              src="/logo.jpg"
              alt="شعار قلم"
              width={46}
              height={46}
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={styles.brandInfo}>
            <span className={styles.brandTitle}>
              قَلَم<span>.</span>
            </span>
            <span className={styles.brandSubtitle}>المكتبة المسيحية</span>
          </div>
        </Link>

        {/* 2. Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="التنقل الرئيسي">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.active : ""}`}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 3. Desktop Search Bar */}
        <form onSubmit={handleSearch} className={styles.searchContainer} role="search">
          <input
            type="search"
            placeholder="ابحث عن كتاب، مؤلف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            aria-label="البحث في الكتب"
          />
          <button type="submit" className={styles.searchSubmitBtn} aria-label="بحث">
            <Search size={18} />
          </button>
        </form>

        {/* 4. Action Buttons (Search Toggle on Mobile, User Menu / Login) */}
        <div className={styles.actionsGroup}>
          <button
            type="button"
            className={styles.mobileSearchBtn}
            onClick={toggleMobileSearch}
            aria-label={isMobileSearchOpen ? "إغلاق شريط البحث" : "فتح شريط البحث"}
            title="البحث"
          >
            {isMobileSearchOpen ? <X size={19} /> : <Search size={19} />}
          </button>

          {isAuthenticated && user ? (
            <div className={styles.userMenuWrapper} ref={userMenuRef}>
              <button
                type="button"
                className={`${styles.loginBtn} ${styles.userMenuTrigger} ${
                  isUserMenuOpen ? styles.menuOpen : ""
                }`}
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                title={`حساب ${user.name}`}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <UserIcon size={17} />
                <span className={styles.loginText}>
                  {user.name.split(" ")[0]}
                </span>
                <ChevronDown
                  size={14}
                  className={`${styles.menuChevron} ${
                    isUserMenuOpen ? styles.rotateChevron : ""
                  }`}
                />
              </button>

              {isUserMenuOpen && (
                <div className={styles.userDropdownMenu} role="menu">
                  <div className={styles.dropdownHeader}>
                    <span className={styles.dropdownUserName}>{user.name}</span>
                    <span className={styles.dropdownUserEmail}>{user.email}</span>
                  </div>

                  <div className={styles.dropdownDivider} />

                  <Link
                    href="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setIsUserMenuOpen(false)}
                    role="menuitem"
                  >
                    <UserIcon size={16} />
                    <span>حسابي</span>
                  </Link>

                  <Link
                    href="/my-library"
                    className={styles.dropdownItem}
                    onClick={() => setIsUserMenuOpen(false)}
                    role="menuitem"
                  >
                    <Bookmark size={16} />
                    <span>مكتبتي</span>
                  </Link>

                  <div className={styles.dropdownDivider} />

                  <button
                    type="button"
                    className={`${styles.dropdownItem} ${styles.logoutItem}`}
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    <LogOut size={16} />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className={styles.loginBtn}
              title="تسجيل الدخول"
              aria-label="تسجيل الدخول"
            >
              <LogIn size={17} />
              <span className={styles.loginText}>تسجيل الدخول</span>
            </Link>
          )}
        </div>
      </div>

      {/* 5. Mobile Expandable Search Bar */}
      <div
        className={`${styles.mobileSearchDrawer} ${
          isMobileSearchOpen ? styles.open : ""
        }`}
      >
        <div className={styles.mobileSearchInner}>
          <form onSubmit={handleSearch} className={styles.mobileSearchForm}>
            <input
              ref={mobileInputRef}
              type="search"
              placeholder="ابحث عن كتاب، مؤلف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.mobileSearchInputField}
              aria-label="البحث في الموبايل"
              autoComplete="off"
              enterKeyHint="search"
            />
            <button
              type="submit"
              className={styles.mobileSearchSubmitBtn}
              aria-label="تنفيذ البحث"
            >
              <Search size={18} />
            </button>
            {searchTerm && (
              <button
                type="button"
                className={styles.mobileSearchClose}
                onClick={() => setSearchTerm("")}
                aria-label="مسح النص"
              >
                <X size={14} />
              </button>
            )}
          </form>
        </div>
      </div>
    </header>
  );
};
