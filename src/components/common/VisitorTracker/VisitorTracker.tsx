"use client";

import { useEffect, useRef } from "react";
import { trackVisitAction } from "@/server/actions/analytics.actions";

const STORAGE_IP_KEY = "kalmch_visited_ip";
const STORAGE_COUNTRY_KEY = "kalmch_visited_country";

interface GeoResult {
  ip: string;
  countryCode: string;
}

async function fetchClientGeo(): Promise<GeoResult | null> {
  // 1. Try api.country.is (fastest, lightweight Cloudflare edge)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch("https://api.country.is/", {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.country) {
        return {
          ip: data.ip || "unknown",
          countryCode: String(data.country).trim().toUpperCase(),
        };
      }
    }
  } catch {
    // Continue to next provider
  }

  // 2. Fallback: ipapi.co
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch("https://ipapi.co/json/", {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.country_code) {
        return {
          ip: data.ip || "unknown",
          countryCode: String(data.country_code).trim().toUpperCase(),
        };
      }
    }
  } catch {
    // Continue to next provider
  }

  // 3. Fallback: ipwho.is
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch("https://ipwho.is/", {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.country_code) {
        return {
          ip: data.ip || "unknown",
          countryCode: String(data.country_code).trim().toUpperCase(),
        };
      }
    }
  } catch {
    // All geo providers exhausted
  }

  return null;
}

export function VisitorTracker() {
  const isRunningRef = useRef(false);

  useEffect(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    try {
      // 1. Check if this device/IP has already been recorded
      const existingIp = localStorage.getItem(STORAGE_IP_KEY);
      if (existingIp) {
        // Device already recorded - prevent fake repeated visits
        return;
      }

      // 2. Fetch IP and country code from client
      fetchClientGeo()
        .then((geo) => {
          if (!geo || !geo.countryCode) return;

          // Double check storage
          if (localStorage.getItem(STORAGE_IP_KEY)) return;

          // Send to /api/track-visit via server action
          trackVisitAction(geo.countryCode)
            .then(() => {
              // Store IP so subsequent loads/refreshes never track again
              localStorage.setItem(STORAGE_IP_KEY, geo.ip);
              localStorage.setItem(STORAGE_COUNTRY_KEY, geo.countryCode);
            })
            .catch(() => {
              // Silent catch
            });
        })
        .catch(() => {
          // Silent catch
        });
    } catch {
      // In case localStorage is blocked by user browser settings
    }
  }, []);

  return null;
}

export default VisitorTracker;

