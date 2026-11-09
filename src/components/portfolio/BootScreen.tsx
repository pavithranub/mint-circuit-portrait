import { useEffect, useState } from "react";

const lines = [
  { prefix: "[0x00]", text: "reset released" },
  { prefix: "[0x01]", text: "clocks configured — 72 MHz AHB" },
  { prefix: "[0x02]", text: "peripherals ready — UART GPIO SPI" },
  { prefix: "[0x03]", text: "loading portfolio — pavithran.ub" },
  { prefix: "[0x04]", text: "system running" },
];

export function BootScreen() {
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sessionStorage.getItem("booted") || reduce) return;
    setShow(true);
    const timers: number[] = [];
    lines.forEach((_, i) => timers.push(window.setTimeout(() => setCount(i + 1), 120 + i * 260)));
    timers.push(window.setTimeout(() => finish(), 120 + lines.length * 260 + 300));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    sessionStorage.setItem("booted", "1");
    setLeaving(true);
    window.setTimeout(() => setShow(false), 450);
  }

  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Page loading"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-mask-deep p-6 transition-opacity duration-500 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-pcb-grid opacity-40" aria-hidden="true" />
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card/80 p-8 font-mono shadow-glow">
        <div className="mb-6 flex items-center justify-between text-[0.7rem] tracking-[0.18em] text-muted-foreground">
          <span>PUB DEV BOARD v3.0 — UART</span>
          <span className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-destructive/70" />
            <span className="h-2 w-2 rounded-full bg-gold/70" />
            <span className="h-2 w-2 rounded-full bg-primary" />
          </span>
        </div>
        <div className="min-h-[10rem] space-y-1.5 text-sm">
          {lines.slice(0, count).map((l, i) => (
            <p key={l.prefix} className="animate-in fade-in slide-in-from-left-2 text-primary">
              <span className="text-gold">{l.prefix}</span> {l.text}
              {i === lines.length - 1 && (
                <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-primary" />
              )}
            </p>
          ))}
        </div>
        <div className="mt-6 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(count / lines.length) * 100}%` }}
          />
        </div>
        <button
          onClick={finish}
          className="mt-5 text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          skip →
        </button>
      </div>
    </div>
  );
}
