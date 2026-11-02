"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, LogIn, X } from "lucide-react";
import { useLibrary } from "@/context/LibraryContext";
import styles from "./Header.module.scss";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "مكتبتى", href: "/my-library" },
  { label: "الاقسام", href: "/categories" },
  { label: "المؤلفين", href: "/authors" },
  { label: "تواصل معنا", href: "/contact" },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { totalSavedCount, isLoaded } = useLibrary();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Detect scroll to toggle transparent vs solid background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile search on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileSearchOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Focus mobile input when opened
  useEffect(() => {
    if (isMobileSearchOpen) {
      mobileInputRef.current?.focus();
    }
  }, [isMobileSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/categories?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsMobileSearchOpen(false);
    }
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
                {link.href === "/my-library" && isLoaded && totalSavedCount > 0 && (
                  <span className={styles.navCountBadge}>{totalSavedCount}</span>
                )}
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
          <button type="submit" className={styles.searchBtn} aria-label="بحث">
            <Search size={18} />
          </button>
        </form>

        {/* 4. Action Buttons (Auth & Mobile Search Toggle) */}
        <div className={styles.actionGroup}>
          <button
            type="button"
            className={styles.mobileSearchBtn}
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            aria-label="فتح شريط البحث"
          >
            {isMobileSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          <Link href="/login" className={styles.loginBtn}>
            <LogIn size={17} />
            <span>تسجيل الدخول</span>
          </Link>
        </div>
      </div>

      {/* 5. Mobile Expandable Search Bar */}
      <div
        className={`${styles.mobileSearchDrawer} ${
          isMobileSearchOpen ? styles.open : ""
        }`}
      >
        <form onSubmit={handleSearch} className={styles.mobileSearchForm}>
          <input
            ref={mobileInputRef}
            type="search"
            placeholder="ابحث عن كتاب، مؤلف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.mobileSearchInputField}
            aria-label="البحث في الموبايل"
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
    </header>
  );
};
