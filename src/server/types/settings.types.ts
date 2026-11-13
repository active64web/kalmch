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
  phone: "+201234567890",
  whatsapp: "+201234567890",
  email: "contact@qalam-library.com",
  address: "القاهرة، مصر",
  facebook: "https://facebook.com/qalamlibrary",
  instagram: "https://instagram.com/qalamlibrary",
  youtube: "https://youtube.com/@qalamlibrary",
  twitter: "https://x.com/qalamlibrary",
  telegram: "https://t.me/qalamlibrary",
  tiktok: "https://tiktok.com/@qalamlibrary",
  site_name: "مكتبة قلم CH",
  about_app:
    "مكتبة قلم CH - منصة رقمية متخصصة في الكتب والمقالات والدراسات الروحية واللاهوتية المسيحية الموثوقة.",
  copyright: "جميع الحقوق محفوظة لمكتبة قلم CH © 2026",
};

