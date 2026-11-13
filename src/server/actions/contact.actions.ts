"use server";

import { contactService } from "../services/contact.service";
import type { ContactPayload } from "../types/contact.types";

export async function sendContactMessageAction(payload: ContactPayload) {
  try {
    const res = await contactService.sendMessage(payload);
    return {
      success: true,
      message: res.message || "تم إرسال رسالتك بنجاح، سنتواصل معك قريباً.",
    };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      message:
        err.message ||
        "حدث خطأ أثناء إرسال الرسالة، يرجى التأكد من البيانات والمحاولة مرة أخرى.",
    };
  }
}

