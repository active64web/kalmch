declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: {
              access_token?: string;
              error?: string;
              error_description?: string;
            }) => void;
          }) => { requestAccessToken: () => void };
        };
      };
    };
  }
}

/**
 * Helper to request Google OAuth Access Token using Google Identity Services (GIS)
 */
export async function promptGoogleAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error(
      "معرّف عميل Google غير محدد. يرجى إضافة NEXT_PUBLIC_GOOGLE_CLIENT_ID في ملف .env"
    );
  }

  // Load Google Identity Services script if not present
  if (typeof window !== "undefined" && !window.google?.accounts?.oauth2) {
    await new Promise<void>((resolve, reject) => {
      const existing = document.getElementById("google-gsi-client");
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () =>
          reject(new Error("فشل تحميل مكتبة تسجيل الدخول بحساب Google"))
        );
        return;
      }
      const script = document.createElement("script");
      script.id = "google-gsi-client";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("فشل تحميل مكتبة تسجيل الدخول بحساب Google"));
      document.head.appendChild(script);
    });
  }

  return new Promise((resolve, reject) => {
    try {
      if (!window.google?.accounts?.oauth2) {
        throw new Error("مكتبة Google غير متاحة حالياً، يرجى إعادة المحاولة");
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "email profile openid",
        callback: (response) => {
          if (response.error) {
            reject(
              new Error(
                response.error_description ||
                  `خطأ في تسجيل الدخول عبر Google: ${response.error}`
              )
            );
          } else if (response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error("لم يتم استلام تصريح الدخول من Google"));
          }
        },
      });

      client.requestAccessToken();
    } catch (err) {
      reject(err);
    }
  });
}

