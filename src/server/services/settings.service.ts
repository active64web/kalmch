import { apiClient } from "../config/api-client";
import {
  type SiteSettings,
  type SettingsApiResponse,
  DEFAULT_SETTINGS,
} from "../types/settings.types";

export const settingsService = {
  /**
   * Fetch site settings from GET /api/settings
   */
  async getSettings(): Promise<SiteSettings> {
    try {
      const response = await apiClient<SettingsApiResponse>("/api/settings", {
        method: "GET",
        cache: "no-store",
      });

      const map = response?.data?.map;
      if (map && typeof map === "object") {
        return {
          phone: map.phone || DEFAULT_SETTINGS.phone,
          whatsapp: map.whatsapp || DEFAULT_SETTINGS.whatsapp,
          email: map.email || DEFAULT_SETTINGS.email,
          address: map.address || DEFAULT_SETTINGS.address,
          facebook: map.facebook || DEFAULT_SETTINGS.facebook,
          instagram: map.instagram || DEFAULT_SETTINGS.instagram,
          youtube: map.youtube || DEFAULT_SETTINGS.youtube,
          twitter: map.twitter || DEFAULT_SETTINGS.twitter,
          telegram: map.telegram || DEFAULT_SETTINGS.telegram,
          tiktok: map.tiktok || DEFAULT_SETTINGS.tiktok,
          site_name: map.site_name || DEFAULT_SETTINGS.site_name,
          about_app: map.about_app || DEFAULT_SETTINGS.about_app,
          copyright: map.copyright || DEFAULT_SETTINGS.copyright,
        };
      }
    } catch {
      // Fallback to default settings
    }

    return DEFAULT_SETTINGS;
  },
};
