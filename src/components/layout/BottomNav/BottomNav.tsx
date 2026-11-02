"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bookmark, Grid3X3, Users, MessageSquare } from "lucide-react";
import styles from "./BottomNav.module.scss";

const bottomItems = [
  { label: "الرئيسية", href: "/", icon: Home },
  { label: "مكتبتى", href: "/my-library", icon: Bookmark },
  { label: "الاقسام", href: "/categories", icon: Grid3X3 },
  { label: "المؤلفين", href: "/authors", icon: Users },
  { label: "تواصل معنا", href: "/contact", icon: MessageSquare },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.bottomNavWrapper} aria-label="شريط التنقل السفلي للموبايل">
      {bottomItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
          >
            <Icon size={20} className={styles.icon} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
