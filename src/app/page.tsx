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
  title: "قَلَم | منصة الكتب والمؤلفات والدراسات المسيحية",
  description:
    "المنصة الرقمية الأولى لقراءة أمهات الكتب والمؤلفات والدراسات المسيحية، تفاسير الكتاب المقدس، تاريخ الكنيسة وسير الآباء والقديسين مجاناً وبدون تحميل وبأعلى درجات الوقار والبساطة.",
  path: "/",
  keywords: [
    "منصة قلم",
    "كتب مسيحية",
    "المكتبة المسيحية الإلكترونية",
    "قراءة كتب مسيحية أونلاين",
    "المكتبة القبطية الأرثوذكسية",
    "كتب البابا شنوده الثالث",
    "كتب الأب متى المسكين",
    "كتب القمص تادرس يعقوب ملطي",
    "تفاسير الكتاب المقدس",
    "كتب لاهوت وعقيدة",
    "كتابات الآباء الأولين",
    "أبحاث ومقالات مسيحية",
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
