import { useEffect, useState } from "react";
import { Menu, Terminal, X } from "lucide-react";
import { navLinks } from "@/data/portfolio";
import { Scope } from "./Scope";
import { cn } from "@/lib/utils";

export function Nav({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    navLinks.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) obs.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav
        aria-label="Main navigation"
        className={cn(
          "relative mx-auto flex max-w-6xl items-center justify-between gap-4 overflow-hidden rounded-full border px-4 py-2 transition-all duration-500 sm:px-5",
          scrolled ? "glass border-border shadow-card" : "border-transparent bg-transparent",
        )}
      >
        <a href="#hero" className="flex items-center gap-2 font-mono text-sm tracking-wider">
          <span className="relative flex h-7 w-7 items-center justify-center rounded-md border border-primary/40 bg-primary/10 text-[0.65rem] font-bold text-primary">
            PUB
          </span>
          <span className="hidden text-foreground sm:inline">
            pavithran<span className="text-gold">_dev</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] transition-colors",
                  active === l.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Scope className="hidden h-8 w-28 rounded-full border border-border bg-mask-deep/60 sm:block" />
          <button
            onClick={onOpenTerminal}
            aria-label="Open serial terminal (or press backtick)"
            className="flex h-8 items-center gap-1.5 rounded-full border border-border px-3 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">terminal</span>
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-primary to-gold transition-[width] duration-150"
          style={{ width: `${progress * 100}%`, opacity: scrolled ? 1 : 0 }}
        />
      </nav>

      {open && (
        <div className="glass mx-auto mt-2 max-w-6xl animate-in fade-in slide-in-from-top-2 rounded-3xl border border-border p-3 lg:hidden">
          <ul className="grid grid-cols-2 gap-1">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground hover:bg-primary/10 hover:text-primary"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
