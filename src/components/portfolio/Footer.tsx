import { profile } from "@/data/portfolio";

export function Footer() {
  return (
    <footer className="border-t border-border bg-mask-deep">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 font-mono text-xs text-muted-foreground sm:flex-row sm:px-8">
        <span>
          © {new Date().getFullYear()} {profile.name} — {profile.role} · Coimbatore
        </span>
        <span className="flex items-center gap-2 text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
          SYSTEM RUNNING
        </span>
        <span className="flex items-center gap-4">
          <span className="hidden md:inline">
            press <kbd className="rounded border border-border px-1.5 py-0.5 text-foreground">`</kbd> for terminal
          </span>
          <a href={profile.source} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            Source on GitHub
          </a>
        </span>
      </div>
    </footer>
  );
}
