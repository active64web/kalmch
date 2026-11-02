import type { Metadata } from "next";

export const BASE_URL = "https://kalmch.com";
export const SITE_NAME = "قَلَم | المكتبة المسيحية";
export const DEFAULT_OG_IMAGE = `${BASE_URL}/logo.jpg`;

export interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  keywords?: string | string[];
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description,
  path = "",
  keywords,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  const canonicalUrl = `${BASE_URL}${cleanPath}`;

  const formattedTitle =
    title.includes("قَلَم") || title.includes("قلم")
      ? title
      : `${title} | قَلَم`;

  const keywordsString = Array.isArray(keywords)
    ? keywords.join(", ")
    : keywords ||
      "كتب مسيحية, قراءة كتب مسيحية, منصة قلم, كتب روحية, تفاسير الكتاب المقدس, تاريخ الكنيسة, دراسات آبائية, سير القديسين";

  const ogImage = image.startsWith("http")
    ? image
    : `${BASE_URL}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    title: formattedTitle,
    description,
    keywords: keywordsString,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: formattedTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "ar_EG",
      type,
      images: [
        {
          url: ogImage,
          width: 800,
          height: 800,
          alt: formattedTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: formattedTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

