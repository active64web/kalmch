import { apiClient } from "../config/api-client";
import {
  type SiteSettings,
  type SettingsApiResponse,
  type HeroSettings,
  type HeroSettingsApiResponse,
  DEFAULT_SETTINGS,
} from "../types/settings.types";

export const settingsService = {
  /**
   * Fetch hero section settings from GET /api/settings/hero
   */
  async getHeroSettings(): Promise<HeroSettings | null> {
    try {
      const response = await apiClient<HeroSettingsApiResponse>(
        "/api/settings/hero",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const d = response?.data;
      if (d) {
        return {
          hero_badge: d.hero_badge || d.map?.hero_badge || "",
          hero_title: d.hero_title || d.map?.hero_title || d.title || "",
          hero_description:
            d.hero_description ||
            d.map?.hero_description ||
            d.title_descr ||
            "",
          hero_image:
            d.hero_image ||
            d.hero_image_url ||
            d.map?.hero_image ||
            d.map?.hero_image_url ||
            "",
        };
      }
    } catch {
      try {
        const response = await apiClient<HeroSettingsApiResponse>(
          "/settings/hero",
          {
            method: "GET",
            cache: "no-store",
          }
        );
        const d = response?.data;
        if (d) {
          return {
            hero_badge: d.hero_badge || d.map?.hero_badge || "",
            hero_title: d.hero_title || d.map?.hero_title || d.title || "",
            hero_description:
              d.hero_description ||
              d.map?.hero_description ||
              d.title_descr ||
              "",
            hero_image:
              d.hero_image ||
              d.hero_image_url ||
              d.map?.hero_image ||
              d.map?.hero_image_url ||
              "",
          };
        }
      } catch (err) {
        console.error("[settingsService] Error fetching hero settings:", err);
      }
    }

    return null;
  },

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

