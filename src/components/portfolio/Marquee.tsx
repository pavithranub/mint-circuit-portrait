import { marqueeItems } from "@/data/portfolio";

export function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div
      className="relative overflow-hidden border-y border-border bg-mask-deep/60 py-5 mask-fade-edges"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
        {items.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground"
          >
            {t}
            <span className="h-1.5 w-1.5 rotate-45 bg-gold/70" />
          </span>
        ))}
      </div>
    </div>
  );
}
