import { apiClient } from "../config/api-client";
import { visitorsData, type CountryVisitorItem } from "@/data/visitors.data";
import type {
  ApiCountryVisitor,
  VisitorsApiResponse,
  TrackVisitResponse,
} from "../types/analytics.types";

export function mapApiCountryVisitorToItem(
  apiCountry: ApiCountryVisitor,
  totalUnique: number = 1
): CountryVisitorItem {
  const visitorsCount = Number(
    apiCountry.unique_visitors || apiCountry.total_visits || 0
  );
  const codeLower = (apiCountry.code || "").toLowerCase();
  const share =
    totalUnique > 0
      ? Math.round((visitorsCount / totalUnique) * 100)
      : 0;

  return {
    id: String(apiCountry.country_id || apiCountry.code),
    code: codeLower,
    name: apiCountry.country_name_ar || apiCountry.country_name_en,
    flagEmoji: apiCountry.flag || "🌍",
    visitorsCount,
    displayCount: `${visitorsCount.toLocaleString("en-US")} زائر`,
    sharePercent: share,
    flagUrl: apiCountry.flag_url || undefined,
  };
}

export const analyticsService = {
  /**
   * Fetch visitor statistics by country from GET /api/analytics/visitors
   */
  async getVisitorsAnalytics(): Promise<{
    countries: CountryVisitorItem[];
    totalUniqueVisitors: number;
    totalPageViews: number;
  }> {
    try {
      const response = await apiClient<VisitorsApiResponse>(
        "/api/analytics/visitors",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const rawCountries = response?.data?.by_country;
      const summary = response?.data?.summary;

      if (Array.isArray(rawCountries) && rawCountries.length > 0) {
        const totalUnique =
          summary?.total_unique_visitors ||
          rawCountries.reduce(
            (acc, c) => acc + Number(c.unique_visitors || 0),
            0
          ) ||
          1;

        const countries = rawCountries.map((c) =>
          mapApiCountryVisitorToItem(c, totalUnique)
        );

        return {
          countries,
          totalUniqueVisitors: summary?.total_unique_visitors || totalUnique,
          totalPageViews: summary?.total_page_views || 0,
        };
      }
    } catch {
      // Fallback below
    }

    // Fallback to static visitorsData
    return {
      countries: visitorsData,
      totalUniqueVisitors: 250000,
      totalPageViews: 850000,
    };
  },

  /**
   * Track visitor from country: POST /api/track-visit
   */
  async trackVisit(countryCode: string): Promise<void> {
    const cleanCode = (countryCode || "").trim().toUpperCase();
    if (!cleanCode) return;

    try {
      await apiClient<TrackVisitResponse>(
        "/api/track-visit",
        {
          method: "POST",
          body: JSON.stringify({ country_code: cleanCode }),
        }
      );
    } catch {
      // Silent catch
    }
  },
};
