import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { authorsService } from "@/server/services/authors.service";
import { PageHeader } from "@/components/common/PageHeader";
import { AuthorAvatar } from "./AuthorAvatar";
import { AuthorBooksList } from "./AuthorBooksList";
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
  const author = await authorsService.getAuthorByIdOrSlug(decoded);

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

  const authorImg = (author as { image_url?: string; avatar?: string }).image_url || author.avatar;

  return constructMetadata({
    title: `${author.name} - سيرته ومؤلفاته | قَلَم`,
    description: desc,
    path: `/authors/${author.slug || author.id}`,
    image: authorImg,
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
  const author = await authorsService.getAuthorByIdOrSlug(decoded);

  if (!author) {
    notFound();
  }

  // Fetch author books from GET /api/authors/{id}/books?page=1&per_page=15
  const booksResult = await authorsService.getAuthorBooks({
    authorId: author.id,
    page: 1,
    perPage: 15,
  });

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
      <section
        className={styles.authorSection}
        aria-label={`معلومات ${author.name}`}
      >
        <div className="container">
          <div className={styles.profileCard}>
            <AuthorAvatar
              imageUrl={
                (author as { image_url?: string; avatar?: string }).image_url ||
                author.avatar
              }
              name={author.name}
            />

            <h2 className={styles.authorName}>{author.name}</h2>

            {author.bio && <p className={styles.authorBio}>{author.bio}</p>}

            <div className={styles.badgesRow}>
              {author.country && (
                <div className={styles.countryBadge}>
                  <span>{author.country}</span>
                  {author.countryFlag && <span>{author.countryFlag}</span>}
                </div>
              )}
              {author.ageOrStatus && (
                <div className={styles.statusBadge}>{author.ageOrStatus}</div>
              )}
            </div>
          </div>

          {/* 3. Author's Books List (with API pagination) */}
          <AuthorBooksList
            authorId={author.id}
            authorName={author.name}
            initialBooks={booksResult.books}
            initialHasMore={booksResult.hasMore}
            total={booksResult.total}
          />
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
