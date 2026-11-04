import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { LibraryProvider } from "@/context/LibraryContext";
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
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={almarai.variable}>
      <body className={almarai.className}>
        <LibraryProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <ScrollToTop />
          <BottomNav />
        </LibraryProvider>
      </body>
    </html>
  );
}
