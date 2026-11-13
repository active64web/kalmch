"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  Send,
  User,
  MessageSquare,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  XIcon,
  YouTubeIcon,
  TelegramIcon,
  TikTokIcon,
} from "@/components/common/SocialIcons";
import { useSettings } from "@/context/SettingsContext";
import styles from "./ContactContainer.module.scss";

export const ContactContainer: React.FC = () => {
  const settings = useSettings();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("يرجى ملء الحقول الأساسية (الاسم، البريد، الرسالة)");
      return;
    }

    setIsLoading(true);
    // Simulate sending message
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 700);
  };

  const cleanWhatsapp = (settings.whatsapp || "").replace(/[^\d]/g, "");

  return (
    <div className={styles.contactGrid}>
      {/* 1. Contact Information Column */}
      <div className={styles.infoCard}>
        <div className={styles.infoHeader}>
          <span className={styles.infoBadge}>معلومات التواصل</span>
          <h2 className={styles.infoTitle}>يسعدنا دائماً سماع صوتك</h2>
          <p className={styles.infoSubtitle}>
            سواء كان لديك استفسار عن كتاب، اقتراح لإثراء المنصة، أو ترغب في نشر
            مؤلفاتك معنا، فريق عمل <strong>قَلَم</strong> متاح ومستعد للتواصل
            معك.
          </p>
        </div>

        {/* Channels List from API Settings */}
        <div className={styles.channelsList}>
          {/* Phone */}
          {settings.phone && (
            <a href={`tel:${settings.phone}`} className={styles.channelItem}>
              <div className={styles.channelIconCircle}>
                <Phone size={20} />
              </div>
              <div className={styles.channelDetails}>
                <span className={styles.channelLabel}>رقم الهاتف المباشر</span>
                <span className={styles.channelValue} dir="ltr">
                  {settings.phone}
                </span>
              </div>
            </a>
          )}

          {/* WhatsApp */}
          {settings.whatsapp && (
            <a
              href={`https://wa.me/${cleanWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.channelItem}
            >
              <div className={`${styles.channelIconCircle} ${styles.whatsappIcon}`}>
                <WhatsAppIcon size={20} color="#25D366" />
              </div>
              <div className={styles.channelDetails}>
                <span className={styles.channelLabel}>محادثة واتساب سريعة</span>
                <span className={styles.channelValue} dir="ltr">
                  {settings.whatsapp}
                </span>
              </div>
            </a>
          )}

          {/* Email */}
          {settings.email && (
            <a href={`mailto:${settings.email}`} className={styles.channelItem}>
              <div className={styles.channelIconCircle}>
                <Mail size={20} />
              </div>
              <div className={styles.channelDetails}>
                <span className={styles.channelLabel}>البريد الإلكتروني</span>
                <span className={styles.channelValue} dir="ltr">
                  {settings.email}
                </span>
              </div>
            </a>
          )}

          {/* Address */}
          {settings.address && (
            <div className={styles.channelItem}>
              <div className={styles.channelIconCircle}>
                <MapPin size={20} />
              </div>
              <div className={styles.channelDetails}>
                <span className={styles.channelLabel}>المقر والعنوان</span>
                <span className={styles.channelValue}>
                  {settings.address}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Social Media Row from Settings */}
        <div className={styles.socialSection}>
          <span className={styles.socialTitle}>تابعنا على منصات التواصل</span>
          <div className={styles.socialRow} aria-label="حسابات التواصل الاجتماعي">
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="فيسبوك"
              >
                <FacebookIcon size={19} />
              </a>
            )}

            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="إنستغرام"
              >
                <InstagramIcon size={19} />
              </a>
            )}

            {settings.youtube && (
              <a
                href={settings.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="يوتيوب"
              >
                <YouTubeIcon size={19} />
              </a>
            )}

            {settings.twitter && (
              <a
                href={settings.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="إكس"
              >
                <XIcon size={18} />
              </a>
            )}

            {settings.telegram && (
              <a
                href={settings.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="تيليجرام"
              >
                <TelegramIcon size={19} />
              </a>
            )}

            {settings.tiktok && (
              <a
                href={settings.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="تيك توك"
              >
                <TikTokIcon size={19} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. Contact Form Column */}
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>أرسل لنا رسالة مباشرة</h2>
          <p className={styles.formSubtitle}>
            املأ البيانات وسيقوم فريقنا بمراجعة رسالتك والرد عليك في أقرب وقت.
          </p>
        </div>

        {isSuccess ? (
          <div className={styles.successBox}>
            <CheckCircle2 size={48} className={styles.successIcon} />
            <h3 className={styles.successTitle}>تم استلام رسالتك بنجاح!</h3>
            <p className={styles.successText}>
              نشكرك على تواصلك معنا، سيتولى أحد مسؤولي المنصة مراجعة رسالتك
              والتواصل معك عبر البريد الإلكتروني.
            </p>
            <button
              type="button"
              onClick={() => setIsSuccess(false)}
              className={styles.resetBtn}
            >
              إرسال رسالة أخرى
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.formElement}>
            {errorMessage && (
              <div className={styles.errorAlert}>{errorMessage}</div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.inputLabel}>
                الاسم الكامل <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <User size={18} className={styles.fieldIcon} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="مثال: بيشوي سمير"
                  className={styles.textInput}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.inputLabel}>
                البريد الإلكتروني <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <Mail size={18} className={styles.fieldIcon} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={styles.textInput}
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.inputLabel}>
                رقم الهاتف (اختياري)
              </label>
              <div className={styles.inputWrapper}>
                <Phone size={18} className={styles.fieldIcon} />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+20 120 000 0000"
                  className={styles.textInput}
                  dir="ltr"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="message" className={styles.inputLabel}>
                نص الرسالة أو الاستفسار <span className={styles.required}>*</span>
              </label>
              <div className={`${styles.inputWrapper} ${styles.textareaWrapper}`}>
                <MessageSquare size={18} className={styles.fieldIconTextarea} />
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="اكتب استفسارك، مقترحك، أو تفاصيل المخطوطة/الكتاب الذي ترغب في نشره..."
                  rows={5}
                  className={styles.textareaInput}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitBtn}
            >
              {isLoading ? (
                <span>جاري إرسال الرسالة...</span>
              ) : (
                <>
                  <span>إرسال الرسالة الآن</span>
                  <Send size={16} className={styles.sendIcon} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
