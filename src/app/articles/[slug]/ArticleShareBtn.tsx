"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";
import styles from "./ArticleDetails.module.scss";

interface ArticleShareBtnProps {
  title: string;
  author: string;
}

export const ArticleShareBtn: React.FC<ArticleShareBtnProps> = ({
  title,
  author,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title,
          text: `مقال "${title}" بقلم ${author} على منصة قَلَم`,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`${styles.shareBtn} ${copied ? styles.copied : ""}`}
      title={copied ? "تم نسخ الرابط!" : "مشاركة المقال"}
      aria-label="مشاركة المقال"
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      <span>{copied ? "تم النسخ" : "مشاركة"}</span>
    </button>
  );
};

