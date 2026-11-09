import { useEffect, useState } from "react";
import { Menu, Terminal, Volume2, VolumeX, X, Cpu } from "lucide-react";
import { navLinks } from "@/data/portfolio";
import { Scope } from "./Scope";
import { cn } from "@/lib/utils";
import { isSoundEnabled, playRelayClick, setSoundEnabled } from "@/lib/sound";

export function Nav({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    setSound(isSoundEnabled());
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
      { rootMargin: "-40% 0px -50% 0px" },
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

  const toggleSoundState = () => {
    const next = !sound;
    setSound(next);
    setSoundEnabled(next);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav
        aria-label="Main navigation"
        className={cn(
          "relative mx-auto flex max-w-6xl items-center justify-between gap-3 overflow-hidden rounded-full border px-4 py-2 transition-all duration-500 sm:px-5",
          scrolled ? "glass border-primary/30 shadow-glow" : "border-border/60 bg-card/60 backdrop-blur-md",
        )}
      >
        {/* Brand / Logo */}
        <a
          href="#hero"
          onClick={() => playRelayClick()}
          className="flex items-center gap-2.5 font-mono text-sm tracking-wider group"
        >
          <span className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-[0.7rem] font-bold text-primary group-hover:shadow-glow transition-all">
            <Cpu className="h-4 w-4" />
          </span>
          <span className="text-foreground font-semibold flex items-center gap-1">
            <span>PAVITHRAN</span>
            <span className="text-gold text-xs font-mono font-normal">.DEV</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-1 lg:flex" role="list">
          {navLinks.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={() => playRelayClick()}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] transition-all",
                  active === l.id
                    ? "bg-primary/15 text-primary font-bold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                {l.label}
                {active === l.id && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary shadow-glow" />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* Action Widgets: Oscilloscope + Sound + Terminal */}
        <div className="flex items-center gap-2">
          {/* Live mini oscilloscope */}
          <Scope className="hidden h-8 w-28 rounded-full border border-border/80 bg-mask-deep/80 sm:block cursor-pointer" />

          {/* Sound Toggle */}
          <button
            onClick={toggleSoundState}
            title={sound ? "Mute audio synthesizer" : "Enable tactile synthesizer sound"}
            aria-label={sound ? "Mute sound" : "Enable sound"}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border transition-all",
              sound
                ? "border-primary/50 text-primary bg-primary/10 shadow-glow"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Terminal button */}
          <button
            onClick={() => {
              playRelayClick();
              onOpenTerminal();
            }}
            aria-label="Open serial terminal console (or press backtick `)"
            title="Open serial terminal (`)"
            className="flex h-8 items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-3 font-mono text-xs text-muted-foreground transition-all hover:border-primary hover:text-primary hover:bg-primary/5"
          >
            <Terminal className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">console</span>
            <kbd className="hidden rounded bg-muted px-1.5 py-0.2 text-[0.6rem] text-muted-foreground md:inline border border-border">
              `
            </kbd>
          </button>

          {/* Mobile hamburger */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4 text-primary" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Top scroll progress indicator wire */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary via-gold to-primary transition-[width] duration-150"
          style={{ width: `${progress * 100}%`, opacity: scrolled ? 1 : 0 }}
        />
      </nav>

      {/* Mobile navigation drop-down menu */}
      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-border/90 bg-card/95 p-4 shadow-card backdrop-blur-xl lg:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="grid grid-cols-2 gap-2" role="list">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={() => {
                    playRelayClick();
                    setOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors",
                    active === l.id
                      ? "bg-primary/20 text-primary font-bold border border-primary/30"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {l.label}
                  {active === l.id && <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
