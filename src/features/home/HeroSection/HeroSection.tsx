import React from "react";
import Link from "next/link";
import { BookOpen, Users, Feather, ScrollText, BookMarked } from "lucide-react";
import styles from "./HeroSection.module.scss";

export const HeroSection: React.FC = () => {
  return (
    <section className={styles.heroWrapper} aria-label="مقدمة المنصة">
      {/* 1. Subtle Floating Ambient Elements (Books & Pens) */}
      <div className={styles.floatingLayer} aria-hidden="true">
        <div className={`${styles.floatingItem} ${styles.float1}`}>
          <Feather size={42} />
        </div>
        <div className={`${styles.floatingItem} ${styles.float2}`}>
          <BookOpen size={46} />
        </div>
        <div className={`${styles.floatingItem} ${styles.float3}`}>
          <ScrollText size={40} />
        </div>
        <div className={`${styles.floatingItem} ${styles.float4}`}>
          <Feather size={44} />
        </div>
        <div className={`${styles.floatingItem} ${styles.float5}`}>
          <BookMarked size={36} />
        </div>
        <div className={`${styles.floatingItem} ${styles.float6}`}>
          <BookOpen size={38} />
        </div>
      </div>

      <div className="container">
        <div className={styles.heroContainer}>
          {/* 2. Gentle Welcome Pill */}
          <div className={styles.welcomePill}>
            <Feather size={15} className={styles.pillIcon} />
            <span>منصة النشر والقراءة المسيحية</span>
          </div>

          {/* 3. Headline Title (Single Row on Desktop, Clean 2 Rows on Mobile) */}
          <h1 className={styles.heroTitle}>
            <span className={styles.titleLine1}>حيث تلتقي الكلمة العميقة</span>{" "}
            <span className={styles.titleLine2}>
              بـ <span className={styles.highlight}>أقلام مسيحية</span> أصيلة
            </span>
          </h1>

          {/* 4. Description */}
          <p className={styles.heroDescription}>
            تهدف منصة <strong>قَلَم</strong> إلى تشجيع الكُتاب والمفكرين وإثراء
            مكتبتنا العربية بمؤلفات جديدة في العلوم الروحية، واللاهوتية، والتاريخ
            الكنسي، وتوفيرها للقراءة المجانية المباشرة بكل يسر وهدوء.
          </p>

          {/* 5. Pleasant General Actions */}
          <div className={styles.actionsRow}>
            <Link href="/categories" className={styles.primaryBtn}>
              <BookOpen size={18} />
              <span className={styles.btnTextDesktop}>تصفح أقسام الكتب</span>
              <span className={styles.btnTextMobile}>تصفح الأقسام</span>
            </Link>
            <Link href="/authors" className={styles.secondaryBtn}>
              <Users size={18} />
              <span>دليل المؤلفين</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
