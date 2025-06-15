"use client";
import { Github } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "@/i18n/I18nContext";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  const { t, dir } = useI18n();
  return (
    <header className={`sticky top-0 z-30 w-full bg-background/95 border-b shadow-sm flex items-center justify-between px-2 py-2 sm:px-4 sm:py-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
      <div className="flex items-center gap-2">
        <span className="font-mono font-bold text-lg sm:text-xl tracking-tight">{t("Migration Master")}</span>
        <span className="ml-2 px-2 py-0.5 text-xs font-mono rounded bg-muted text-muted-foreground">{t("for Laravel")}</span>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <a
          href="https://github.com/yourrepo/migration-master"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="hover:scale-105 transition-transform"
        >
          <Github size={22} />
        </a>
        <DarkModeToggle />
      </div>
    </header>
  );
}
