
import DarkModeToggle from "./DarkModeToggle";
import IconGithub from "./IconGithub";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="font-mono font-bold text-lg tracking-tight">Migration Master</span>
        <span className="ml-2 px-2 py-0.5 text-xs font-mono rounded bg-muted text-muted-foreground">for Laravel</span>
      </div>
      <div className="flex items-center gap-2">
        <a
          href="https://github.com/yourrepo/migration-master"
          className="hover-scale"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Repository"
        >
          <IconGithub size={22} />
        </a>
        <DarkModeToggle />
      </div>
    </header>
  );
}
