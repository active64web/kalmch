import React from "react";
import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import styles from "./BreadcrumbBar.module.scss";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbBarProps {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
}

export const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({
  items,
  showHomeIcon = true,
}) => {
  return (
    <nav className={styles.breadcrumbWrapper} aria-label="مسار التصفح">
      <div className={styles.breadcrumbContainer}>
        {/* Home root link */}
        <Link href="/" className={styles.itemLink}>
          {showHomeIcon && <Home size={15} />}
          <span>الرئيسية</span>
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              <span className={styles.separator} aria-hidden="true">
                <ChevronLeft size={14} />
              </span>
              {isLast || !item.href ? (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className={styles.itemLink}>
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};

