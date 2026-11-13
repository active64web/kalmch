import { apiClient } from "../config/api-client";
import type { ContactPayload, ContactApiResponse } from "../types/contact.types";

export const contactService = {
  /**
   * Submit contact form to POST /api/contact
   */
  async sendMessage(payload: ContactPayload): Promise<ContactApiResponse> {
    return apiClient<ContactApiResponse>("/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: payload.name.trim(),
        email: payload.email.trim(),
        phone: payload.phone?.trim() || "",
        message: payload.message.trim(),
      }),
    });
  },
};

