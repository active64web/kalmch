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
import { settingsService } from "@/server/services/settings.service";

export const dynamic = "force-dynamic";

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

export default async function Home() {
  const heroData = await settingsService.getHeroSettings();

  return (
    <div className="page-main-wrapper">
      <HeroSection
        hero_badge={heroData?.hero_badge}
        hero_title={heroData?.hero_title}
        hero_description={heroData?.hero_description}
        hero_image={heroData?.hero_image}
      />
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
