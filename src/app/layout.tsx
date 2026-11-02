import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { LibraryProvider } from "@/context/LibraryContext";
import "@/styles/global.scss";

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
    <html lang="ar" dir="rtl">
      <body>
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
