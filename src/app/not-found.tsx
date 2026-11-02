import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Home, BookOpen, Compass } from "lucide-react";
import { constructMetadata } from "@/utils/seo";
import styles from "./NotFound.module.scss";

export const metadata: Metadata = constructMetadata({
  title: "404 - الصفحة غير موجودة | قَلَم",
  description: "عذراً، الصفحة التي تبحث عنها غير موجودة في منصة قَلَم.",
  noIndex: true,
});

export default function NotFound() {
  return (
    <section className={styles.notFoundWrapper} aria-label="الصفحة غير موجودة">
      <div className={styles.contentContainer}>
        <div className={styles.codeNumber} aria-hidden="true">
          404
        </div>

        <div className={styles.badgePill}>
          <Compass size={16} />
          <span>الصفحة مفقودة</span>
        </div>

        <h1 className={styles.title}>عذراً، لم نتمكن من العثور على هذه الصفحة</h1>

        <p className={styles.description}>
          يبدو أن الرابط الذي اتبعته غير صحيح أو ربما تم حذف هذا المحتوى أو نقله لمكان آخر في المكتبة.
        </p>

        <div className={styles.actionsGroup}>
          <Link href="/" className={styles.primaryBtn}>
            <Home size={18} />
            <span>العودة للرئيسية</span>
          </Link>

          <Link href="/categories" className={styles.secondaryBtn}>
            <BookOpen size={18} />
            <span>تصفح الأقسام</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
