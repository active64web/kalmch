import React from "react";
import Image from "next/image";
import styles from "./Loading.module.scss";

export default function Loading() {
  return (
    <div className={styles.loadingOverlay} aria-label="جاري التحميل" role="status">
      <div className={styles.loadingCard}>
        {/* Animated Brand Emblem */}
        <div className={styles.emblemContainer}>
          <div className={styles.pulseRing} aria-hidden="true" />
          <div className={styles.iconCircle}>
            <div className={styles.logoWrapper}>
              <Image
                src="/logo.jpg"
                alt="شعار قلم"
                width={52}
                height={52}
                priority
                className={styles.logoImg}
              />
            </div>
          </div>
        </div>

        {/* Brand Text */}
        <div className={styles.brandGroup}>
          <span className={styles.brandTitle}>
            قَلَم<span>.</span>
          </span>
          <span className={styles.brandSubtitle}>المكتبة المسيحية</span>
        </div>

        {/* Progress Bar & Status Text */}
        <div className={styles.progressTrack}>
          <div className={styles.progressBar} />
        </div>

        <p className={styles.statusText}>جاري تحميل صفحات ومحتوى المكتبة...</p>
      </div>
    </div>
  );
}
