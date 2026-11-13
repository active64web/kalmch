export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactApiResponse {
  success?: boolean;
  message?: string;
}

