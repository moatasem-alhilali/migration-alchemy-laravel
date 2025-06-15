
import { useDarkMode } from "@/hooks/useDarkMode";

export default function DarkModeToggle() {
  const { isDark, toggle } = useDarkMode();
  return (
    <button
      className="rounded p-1 hover:bg-muted border transition-colors"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      title={isDark ? "Light Mode" : "Dark Mode"}
    >
      <span className="sr-only">Dark Mode</span>
      {isDark ? (
        // Sun icon
        <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M17.36 17.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M17.36 6.64l1.42-1.42"/>
        </svg>
      ) : (
        // Moon icon
        <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}
