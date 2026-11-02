import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "./SectionHeader.module.scss";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: {
    label: string;
    href: string;
  };
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  action,
}) => {
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.textGroup}>
        {badge && <span className={styles.badge}>{badge}</span>}
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      {action && (
        <Link href={action.href} className={styles.actionBtn}>
          <span>{action.label}</span>
          <ArrowLeft size={16} className={styles.arrow} />
        </Link>
      )}
    </div>
  );
};
