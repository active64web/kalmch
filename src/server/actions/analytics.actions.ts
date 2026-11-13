"use server";

import { analyticsService } from "../services/analytics.service";

/**
 * Server action to record visitor's country: POST /api/track-visit
 */
export async function trackVisitAction(countryCode: string) {
  try {
    await analyticsService.trackVisit(countryCode);
    return { success: true };
  } catch {
    return { success: false };
  }
}

