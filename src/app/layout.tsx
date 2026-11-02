import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { LibraryProvider } from "@/context/LibraryContext";
import "@/styles/global.scss";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-ar",
  display: "swap",
});

export const metadata: Metadata = {
  title: "قلم | منصة الكتب والمؤلفات المسيحية",
  description:
    "قلم هي منصة النشر والقراءة للكتب الدينية المسيحية، تهدف لدعم والتعريف بالأقلام المسيحية وتشجيعهم لإثراء مكتبتنا العربية.",
  icons: {
    icon: "/logo.jpg",
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
