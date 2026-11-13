"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Feather, BookOpen, ScrollText, BookMarked } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YouTubeIcon,
  TelegramIcon,
  TikTokIcon,
} from "@/components/common/SocialIcons";
import { useSettings } from "@/context/SettingsContext";
import styles from "./Footer.module.scss";

export const Footer: React.FC = () => {
  const settings = useSettings();

  return (
    <footer className={styles.footerWrapper} aria-label="تذييل الصفحة">
      {/* 1. Subtle Floating Ambient Elements (Books & Pens) */}
      <div className={styles.floatingLayer} aria-hidden="true">
        <div className={`${styles.floatingItem} ${styles.float1}`}>
          <Feather size={38} />
        </div>
        <div className={`${styles.floatingItem} ${styles.float2}`}>
          <BookOpen size={42} />
        </div>
        <div className={`${styles.floatingItem} ${styles.float3}`}>
          <ScrollText size={36} />
        </div>
        <div className={`${styles.floatingItem} ${styles.float4}`}>
          <BookMarked size={34} />
        </div>
        <div className={`${styles.floatingItem} ${styles.float5}`}>
          <Feather size={36} />
        </div>
      </div>

      <div className="container">
        <div className={styles.footerContent}>
          {/* 2. Brand Logo */}
          <Link href="/" className={styles.brandLink}>
            <div className={styles.logoBadge}>
              <Image
                src="/logo.jpg"
                alt={settings.site_name || "شعار قلم"}
                width={46}
                height={46}
                className={styles.logoImg}
              />
            </div>
            <div className={styles.brandTitleRow}>
              <span className={styles.brandName}>
                {settings.site_name ? "قَلَم" : "قَلَم"}
              </span>
              <Feather size={20} className={styles.featherIcon} />
            </div>
          </Link>

          {/* 3. Platform Description */}
          <p className={styles.footerDescription}>
            {settings.about_app ||
              "ألف حياة في انتظارك لتعيشها.. رحلة في عمق الكلمة الروحية والفكر الكنسي، نجمع من خلالها نفائس الكتب والمؤلفات المسيحية لتكون بين يديك بكل يسر وهدوء."}
          </p>

          {/* 4. Social Media Links from Settings */}
          <div className={styles.socialRow} aria-label="قنوات التواصل الاجتماعي">
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="فيسبوك"
              >
                <FacebookIcon size={19} className={styles.socialIcon} />
              </a>
            )}

            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="إنستغرام"
              >
                <InstagramIcon size={19} className={styles.socialIcon} />
              </a>
            )}

            {settings.youtube && (
              <a
                href={settings.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="يوتيوب"
              >
                <YouTubeIcon size={19} className={styles.socialIcon} />
              </a>
            )}

            {settings.twitter && (
              <a
                href={settings.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="إكس"
              >
                <XIcon size={18} className={styles.socialIcon} />
              </a>
            )}

            {settings.telegram && (
              <a
                href={settings.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="تيليجرام"
              >
                <TelegramIcon size={19} className={styles.socialIcon} />
              </a>
            )}

            {settings.tiktok && (
              <a
                href={settings.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="تيك توك"
              >
                <TikTokIcon size={19} className={styles.socialIcon} />
              </a>
            )}
          </div>

          {/* 5. Copyright */}
          <div className={styles.copyrightRow}>
            <span>
              {settings.copyright ||
                "جميع الحقوق محفوظة لمكتبة قلم CH © 2026"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
