
import { useEffect, useState } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const fromLs = localStorage.getItem("theme");
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (fromLs === "dark" || (!fromLs && prefersDark)) {
      html.classList.add("dark");
      setIsDark(true);
    } else {
      html.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    const nowDark = !isDark;
    html.classList.toggle("dark", nowDark);
    setIsDark(nowDark);
    localStorage.setItem("theme", nowDark ? "dark" : "light");
  };

  return { isDark, toggle };
}
