"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, LogIn, X, Bookmark } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);

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

  // Close mobile search on route change without triggering cascading effect renders
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileSearchOpen(false);
  }

  // Smooth mobile focus/blur without causing layout thrashing or keyboard animation stutter
  useEffect(() => {
    if (isMobileSearchOpen) {
      // Delay focus slightly (200ms) so drawer animation slides down at 60fps first
      // before virtual keyboard pops up and causes viewport resize
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

        {/* 4. Action Buttons (Search Toggle on Mobile, My Library Icon, Login) */}
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

          <Link
            href="/my-library"
            className={`${styles.libraryBtn} ${
              pathname.startsWith("/my-library") ? styles.active : ""
            }`}
            title="مكتبتي"
            aria-label="مكتبتي"
          >
            <Bookmark size={18} />
          </Link>

          <Link
            href="/login"
            className={styles.loginBtn}
            title="تسجيل الدخول"
            aria-label="تسجيل الدخول"
          >
            <LogIn size={17} />
            <span className={styles.loginText}>تسجيل الدخول</span>
          </Link>
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
