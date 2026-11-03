import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { User, BookOpen } from "lucide-react";
import { authorsData } from "@/data/authors.data";
import { booksData } from "@/data/books.data";
import { PageHeader } from "@/components/common/PageHeader";
import { BookCard } from "@/components/common/BookCard";
import { GlobalCTA } from "@/components/common/GlobalCTA";
import styles from "./AuthorDetails.module.scss";

import { constructMetadata } from "@/utils/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface AuthorDetailsPageProps {
  params: Promise<{
    authorId: string;
  }>;
}

export async function generateMetadata({
  params,
}: AuthorDetailsPageProps): Promise<Metadata> {
  const { authorId } = await params;
  const decoded = decodeURIComponent(authorId);
  const author = authorsData.find((a) => a.slug === decoded || a.id === decoded);

  if (!author) {
    return constructMetadata({
      title: "المؤلف غير موجود | قَلَم",
      description: "عذراً، لم نتمكن من العثور على هذا المؤلف في منصة قَلَم.",
      noIndex: true,
    });
  }

  const desc =
    author.bio ||
    `تصفح سيرة ومؤلفات وكتب ${author.name} في منصة قَلَم للمكتبة المسيحية.`;

  return constructMetadata({
    title: `${author.name} - سيرته ومؤلفاته | قَلَم`,
    description: desc,
    path: `/authors/${author.slug || author.id}`,
    image: author.avatar,
    keywords: [
      author.name,
      `مؤلفات ${author.name}`,
      `كتب ${author.name}`,
      author.country,
      "آباء الكنيسة",
      "منصة قلم",
    ],
  });
}

export default async function AuthorDetailsPage({
  params,
}: AuthorDetailsPageProps) {
  const { authorId } = await params;
  const decoded = decodeURIComponent(authorId);
  const author = authorsData.find((a) => a.slug === decoded || a.id === decoded);

  if (!author) {
    notFound();
  }

  // Filter books related to this author
  const cleanName = author.name
    .replace(/^(قداسة|نيافة|الأنبا|القمص|الأب|القديس|الشماس)\s+/g, "")
    .trim();

  const authorBooks = booksData.filter(
    (b) =>
      (b.authorId && b.authorId === author.id) ||
      b.author.includes(author.name) ||
      author.name.includes(b.author) ||
      (cleanName.length > 2 && b.author.includes(cleanName))
  );

  return (
    <div className="page-main-wrapper">
      {/* 1. Page Header */}
      <PageHeader
        badge="سيرة ومؤلفات"
        title={author.name}
        subtitle="تصفح كافة مؤلفات وأعمال الكاتب المتوفرة للقراءة في منصة قَلَم"
        breadcrumbs={[
          { label: "المؤلفون", href: "/authors" },
          { label: author.name },
        ]}
      />

      {/* 2. Author Profile Card */}
      <section className={styles.authorSection} aria-label={`معلومات ${author.name}`}>
        <div className="container">
          <div className={styles.profileCard}>
            <div className={styles.avatarBox}>
              {author.avatar ? (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  sizes="96px"
                  className={styles.avatarImg}
                />
              ) : (
                <User size={40} color="var(--main_color)" />
              )}
            </div>

            <h2 className={styles.authorName}>{author.name}</h2>

            {author.bio && (
              <p className={styles.authorBio}>{author.bio}</p>
            )}

            <div className={styles.statusBadge}>{author.ageOrStatus}</div>
          </div>

          {/* 3. Author's Books List */}
          <div className={styles.booksSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>مؤلفات {author.name}</h3>
              <div className={styles.countBadge}>
                <span>{authorBooks.length}</span> كتاب متاح
              </div>
            </div>

            {authorBooks.length > 0 ? (
              <div className={styles.booksGrid}>
                {authorBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyCard}>
                <div style={{ marginBottom: "12px", color: "var(--main_color)" }}>
                  <BookOpen size={36} />
                </div>
                <h4 className={styles.emptyTitle}>لا توجد كتب مفهرسة حالياً</h4>
                <p className={styles.emptyDesc}>
                  يعمل فريق التوثيق على رقمنة وإضافة مؤلفات {author.name} في أقرب وقت.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Global CTA */}
      <GlobalCTA
        badge="مكتبة قَلَم"
        title="استكشف المزيد من أمهات الكتب المسيحية"
        description="آلاف العناوين والمؤلفات لآباء الكنيسة واللاهوتيين المعاصرين بانتظارك لتثري معرفتك الروحية والكنسية."
        primaryAction={{
          label: "تصفح المؤلفين",
          href: "/authors",
        }}
        secondaryAction={{
          label: "أقسام المكتبة",
          href: "/categories",
        }}
      />
    </div>
  );
}
