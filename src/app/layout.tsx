import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { VisitorTracker } from "@/components/common/VisitorTracker";
import { LibraryProvider } from "@/context/LibraryContext";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { settingsService } from "@/server/services/settings.service";
import { BASE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/utils/seo";
import "@/styles/global.scss";

// Revalidate static pages hourly for top performance and instant TTFB
export const revalidate = 3600;

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["400", "700", "800"],
  variable: "--font-ar",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "قَلَم | منصة الكتب والمؤلفات المسيحية",
    template: "%s | قَلَم",
  },
  description:
    "قَلَم هي منصة النشر والقراءة للكتب والمؤلفات المسيحية، تهدف لتوفير التراث الفكري والروحي والكنسي للقراءة المباشرة بكل يسر وهدوء.",
  keywords: [
    "كتب مسيحية",
    "قراءة كتب مسيحية",
    "منصة قلم",
    "كتب لاهوتية",
    "كتب روحية",
    "تفاسير الكتاب المقدس",
    "تاريخ الكنيسة",
    "أقوال الآباء",
    "سير القديسين",
  ],
  authors: [{ name: "فريق قَلَم", url: BASE_URL }],
  creator: "قَلَم",
  publisher: "قَلَم",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "قَلَم | منصة الكتب والمؤلفات المسيحية",
    description:
      "قَلَم هي منصة النشر والقراءة للكتب والمؤلفات المسيحية، تهدف لتوفير التراث الفكري والروحي والكنسي للقراءة المباشرة.",
    url: BASE_URL,
    siteName: SITE_NAME,
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 800,
        height: 800,
        alt: "شعار منصة قَلَم للمكتبة المسيحية",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "قَلَم | منصة الكتب والمؤلفات المسيحية",
    description: "قَلَم هي منصة النشر والقراءة للكتب والمؤلفات المسيحية.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "geo.region": "EG",
    "geo.placename": "Cairo",
    "geo.position": "30.0444;31.2357",
    "ICBM": "30.0444, 31.2357",
    "content-language": "ar",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await settingsService.getSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        "name": "قَلَم - المكتبة المسيحية الرقمية",
        "url": BASE_URL,
        "logo": `${BASE_URL}/logo.jpg`,
        "description":
          "منصة قَلَم هي المكتبة الرقمية المسيحية الموثوقة لقراءة أمهات الكتب والدراسات الكنسية واللاهوتية والآبائية وتفاسير الكتاب المقدس بدون تحميل مجاناً وبأعلى درجات الوقار والبساطة.",
        "sameAs": [
          settings.facebook,
          settings.youtube,
          settings.instagram,
          settings.telegram,
        ].filter(Boolean),
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": ["Arabic"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        "url": BASE_URL,
        "name": "قَلَم",
        "alternateName": "منصة قَلَم للمكتبة المسيحية",
        "description":
          "المكتبة المسيحية الإلكترونية الشاملة لقراءة أمهات الكتب والدراسات الروحية والكنسية والآبائية.",
        "publisher": {
          "@id": `${BASE_URL}/#organization`,
        },
        "inLanguage": "ar-EG",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${BASE_URL}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang="ar" dir="rtl" className={almarai.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={almarai.className}>
        <AuthProvider>
          <SettingsProvider initialSettings={settings}>
            <LibraryProvider>
              <VisitorTracker />
              <Header />
              <main>{children}</main>
              <Footer />
              <ScrollToTop />
              <BottomNav />
            </LibraryProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
