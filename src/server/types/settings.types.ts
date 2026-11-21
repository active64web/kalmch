export interface HeroSettings {
  hero_badge?: string;
  hero_title?: string;
  hero_description?: string;
  hero_image?: string;
  hero_image_url?: string;
}

export interface HeroSettingsApiResponse {
  success?: boolean;
  message?: string;
  data?: HeroSettings & {
    title?: string;
    title_descr?: string;
    hero_image_url?: string;
    map?: HeroSettings;
    settings?: Array<{
      id: number;
      key: string;
      value: string;
      raw_value?: string;
      display_name?: string;
      group?: string;
      type?: string;
    }>;
  };
}

export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube: string;
  twitter: string;
  telegram: string;
  tiktok: string;
  site_name: string;
  about_app: string;
  copyright: string;
}

export interface SettingsApiResponse {
  success?: boolean;
  message?: string;
  data?: {
    map?: Partial<SiteSettings>;
    settings?: Array<{
      id: number;
      key: string;
      value: string;
      display_name: string;
      group: string;
      type: string;
    }>;
  };
}

export const DEFAULT_SETTINGS: SiteSettings = {
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  facebook: "",
  instagram: "",
  youtube: "",
  twitter: "",
  telegram: "",
  tiktok: "",
  site_name: "قَلَم",
  about_app:
    "قَلَم - منصة رقمية متخصصة في نشر وقراءة الكتب والمقالات والدراسات الروحية واللاهوتية المسيحية الموثوقة.",
  copyright: "جميع الحقوق محفوظة لمنصة قَلَم © 2026",
};

