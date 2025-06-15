
import React from "react";
import { useI18n } from "@/i18n/I18nContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <button
        className={`px-2 py-1 rounded ${lang === "en" ? "bg-muted text-primary" : ""}`}
        onClick={() => setLang("en")}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        className={`px-2 py-1 rounded ${lang === "ar" ? "bg-muted text-primary" : ""}`}
        onClick={() => setLang("ar")}
        aria-label="التبديل إلى العربية"
        style={{ fontFamily: "inherit" }}
      >
        AR
      </button>
    </div>
  );
}
