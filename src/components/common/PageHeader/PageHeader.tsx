import React from "react";
import { Feather, BookOpen, ScrollText } from "lucide-react";
import { BreadcrumbBar, BreadcrumbItem } from "@/components/common/BreadcrumbBar";
import styles from "./PageHeader.module.scss";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  breadcrumbs,
}) => {
  return (
    <section className={`page-header ${styles.headerWrapper}`} aria-label={title}>
      {/* Floating Ambient Elements */}
      <div className={styles.floatingLayer} aria-hidden="true">
        <div className={`${styles.floatingItem} ${styles.float1}`}>
          <Feather size={32} />
        </div>
        <div className={`${styles.floatingItem} ${styles.float2}`}>
          <BookOpen size={36} />
        </div>
        <div className={`${styles.floatingItem} ${styles.float3}`}>
          <ScrollText size={30} />
        </div>
      </div>

      <div className="container">
        <div className={styles.contentWrapper}>
          {badge && (
            <div className={styles.badgePill}>
              <Feather size={14} className={styles.badgeIcon} />
              <span>{badge}</span>
            </div>
          )}

          <h1 className={styles.pageTitle}>{title}</h1>

          {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}

          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className={styles.breadcrumbsWrapper}>
              <BreadcrumbBar items={breadcrumbs} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

