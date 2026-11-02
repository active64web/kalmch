"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  Send,
  User,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/common/SocialIcons";
import styles from "./ContactContainer.module.scss";

export const ContactContainer: React.FC = () => {
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

        {/* Channels List */}
        <div className={styles.channelsList}>
          {/* Phone */}
          <a href="tel:+201200000000" className={styles.channelItem}>
            <div className={styles.channelIconCircle}>
              <Phone size={20} />
            </div>
            <div className={styles.channelDetails}>
              <span className={styles.channelLabel}>رقم الهاتف المباشر</span>
              <span className={styles.channelValue} dir="ltr">
                +20 120 000 0000
              </span>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/201200000000"
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
                +20 120 000 0000
              </span>
            </div>
          </a>

          {/* Email */}
          <a href="mailto:info@kalmch.com" className={styles.channelItem}>
            <div className={styles.channelIconCircle}>
              <Mail size={20} />
            </div>
            <div className={styles.channelDetails}>
              <span className={styles.channelLabel}>البريد الإلكتروني</span>
              <span className={styles.channelValue} dir="ltr">
                info@kalmch.com
              </span>
            </div>
          </a>
        </div>

        {/* Social Media Row */}
        <div className={styles.socialSection}>
          <span className={styles.socialTitle}>تابعنا على منصات التواصل</span>
          <div className={styles.socialRow} aria-label="حسابات التواصل الاجتماعي">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialBtn}
              aria-label="فيسبوك"
            >
              <FacebookIcon size={19} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialBtn}
              aria-label="إنستغرام"
            >
              <InstagramIcon size={19} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialBtn}
              aria-label="لينكد إن"
            >
              <LinkedInIcon size={19} />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialBtn}
              aria-label="إكس"
            >
              <XIcon size={18} />
            </a>
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

        {errorMessage && (
          <div className={styles.alertError} role="alert">
            {errorMessage}
          </div>
        )}

        {isSuccess ? (
          <div className={styles.successState}>
            <div className={styles.successIconCircle}>
              <CheckCircle2 size={42} />
            </div>
            <h3 className={styles.successTitle}>شكراً لتواصلك معنا!</h3>
            <p className={styles.successText}>
              تم استلام رسالتك بنجاح، وسنتواصل معك عبر البريد الإلكتروني في غضون
              ساعات عمل قليلة.
            </p>
            <button
              type="button"
              onClick={() => setIsSuccess(false)}
              className={styles.sendAnotherBtn}
            >
              إرسال رسالة أخرى
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Name Field */}
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.inputLabel}>
                الاسم بالكامل
              </label>
              <div className={styles.inputWrapper}>
                <User size={18} className={styles.inputIcon} />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="مثال: بيشوي ميخائيل"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.textInput}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.inputLabel}>
                البريد الإلكتروني
              </label>
              <div className={styles.inputWrapper}>
                <Mail size={18} className={styles.inputIcon} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.textInput}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.inputLabel}>
                رقم الهاتف (اختياري)
              </label>
              <div className={styles.inputWrapper}>
                <Phone size={18} className={styles.inputIcon} />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="01234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.textInput}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Message Field */}
            <div className={styles.inputGroup}>
              <label htmlFor="message" className={styles.inputLabel}>
                الرسالة
              </label>
              <div className={styles.textareaWrapper}>
                <MessageSquare size={18} className={styles.textareaIcon} />
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="اكتب رسالتك أو استفسارك هنا..."
                  value={formData.message}
                  onChange={handleChange}
                  className={styles.textareaInput}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitBtn}
            >
              <Send size={18} />
              <span>{isLoading ? "جاري الإرسال..." : "إرسال الرسالة"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

