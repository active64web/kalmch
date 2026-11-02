import {
  HeroSection,
  CategoriesSection,
  BooksSection,
  AuthorsSection,
} from "@/features/home";
import { GlobalCTA } from "@/components/common/GlobalCTA";

export default function Home() {
  return (
    <div className="page-main-wrapper">
      <HeroSection />
      <CategoriesSection />
      <BooksSection />
      <AuthorsSection />
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
