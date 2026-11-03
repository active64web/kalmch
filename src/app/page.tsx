import { Metadata } from "next";
import {
  HeroSection,
  CategoriesSection,
  BooksSection,
  ArticlesSection,
  AuthorsSection,
  VisitorsSection,
} from "@/features/home";
import { GlobalCTA } from "@/components/common/GlobalCTA";
import { constructMetadata } from "@/utils/seo";

export const metadata: Metadata = constructMetadata({
  title: "قَلَم | منصة الكتب والمؤلفات المسيحية",
  description:
    "استكشف واقرأ آلاف الكتب والدراسات الروحية واللاهوتية وتاريخ الكنيسة لنخبة من كبار الآباء والمؤلفين عبر منصة قَلَم.",
  path: "/",
  keywords: [
    "منصة قلم",
    "كتب مسيحية",
    "قراءة كتب اونلاين",
    "المكتبة القبطية الأرثوذكسية",
    "كتب البابا شنوده",
    "كتب متى المسكين",
    "تفاسير الكتاب المقدس",
  ],
});

export default function Home() {
  return (
    <div className="page-main-wrapper">
      <HeroSection imageSrc="/hero-artwork.jpg" />
      <CategoriesSection />
      <BooksSection />
      <ArticlesSection />
      <AuthorsSection />
      <VisitorsSection />
      <GlobalCTA
        badge="انضم إلى عائلة قَلَم"
        title="هل لديك مؤلفات أو دراسات مسيحية ترغب في نشرها؟"
        description="تسعى منصة قَلَم إلى احتضان الأقلام الواعدة وتوفير كل سبل الدعم لنشر الفكر المسيحي البنّاء ليصل إلى آلاف القراء في كل مكان."
        primaryAction={{
          label: "تواصل معنا",
          href: "/contact",
        }}
        secondaryAction={{
          label: "استكشف مكتبتي",
          href: "/my-library",
        }}
      />
    </div>
  );
}
