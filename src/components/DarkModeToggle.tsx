
"use client";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const dark = localStorage.getItem("theme") === "dark"
      || (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  function toggle() {
    setIsDark(d => {
      document.documentElement.classList.toggle("dark", !d);
      localStorage.setItem("theme", !d ? "dark" : "light");
      return !d;
    });
  }

  return (
    <button
      className="rounded p-1 hover:bg-muted border transition-colors"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light Mode" : "Dark Mode"}
    >
      <span className="sr-only">Dark Mode</span>
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
