
"use client";
import { Github } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 w-full bg-background/95 border-b shadow-sm flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="font-mono font-bold text-lg tracking-tight">Migration Master</span>
        <span className="ml-2 px-2 py-0.5 text-xs font-mono rounded bg-muted text-muted-foreground">
          for Laravel
        </span>
      </div>
      <div className="flex items-center gap-2">
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
