export interface ApiCountryVisitor {
  country_id: string | number;
  code: string;
  country_name_ar: string;
  country_name_en: string;
  flag?: string;
  flag_url?: string;
  unique_visitors: number;
  total_visits: string | number;
}

export interface ApiVisitorsSummary {
  total_unique_visitors: number;
  total_page_views: number;
}

export interface VisitorsApiResponse {
  success?: boolean;
  message?: string;
  data?: {
    summary?: ApiVisitorsSummary;
    by_country?: ApiCountryVisitor[];
  };
}

export interface TrackVisitPayload {
  country_code: string;
}

export interface TrackVisitResponse {
  success?: boolean;
  message?: string;
}

