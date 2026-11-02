import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "./GlobalCTA.module.scss";

export interface GlobalCTAProps {
  title: string;
  description: string;
  badge?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export const GlobalCTA: React.FC<GlobalCTAProps> = ({
  title,
  description,
  badge,
  primaryAction,
  secondaryAction,
}) => {
  return (
    <section className={styles.ctaWrapper} aria-label="دعوة للتفاعل">
      <div className="container">
        <div className={styles.ctaCard}>
          {badge && <span className={styles.badge}>{badge}</span>}
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>

          {(primaryAction || secondaryAction) && (
            <div className={styles.actionsGroup}>
              {primaryAction && (
                <Link href={primaryAction.href} className={styles.primaryBtn}>
                  <span>{primaryAction.label}</span>
                  <ArrowLeft size={16} />
                </Link>
              )}
              {secondaryAction && (
                <Link href={secondaryAction.href} className={styles.secondaryBtn}>
                  <span>{secondaryAction.label}</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

