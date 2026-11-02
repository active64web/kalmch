"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import styles from "./ScrollToTop.module.scss";

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial position
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`${styles.scrollToTopBtn} ${isVisible ? styles.visible : ""}`}
      aria-label="العودة إلى أعلى الصفحة"
      title="العودة لأعلى"
    >
      <ArrowUp size={20} strokeWidth={2.4} className={styles.icon} />
    </button>
  );
};

