import { useEffect, useState } from "react";
import { playBootBeep, playKeyClick } from "@/lib/sound";

const bootLogs = [
  { addr: "0x08000000", tag: "PWR_OK", text: "Core power rails stabilized — VDD: 3.31V, VDDA: 3.30V" },
  { addr: "0x08000040", tag: "RCC_CFG", text: "HSE crystal 8.0 MHz PLL locked -> SYSCLK: 72.0 MHz, AHB: 72 MHz" },
  { addr: "0x08000080", tag: "PERIPH", text: "Peripherals mapped: USART1 (115200 8N1), SPI1 (18MHz), I2C1 (400kHz)" },
  { addr: "0x080000C0", tag: "BOOT_LDR", text: "Custom bootloader verified — Flash Sector 0 CRC32: 0x9E4B210A [PASS]" },
  { addr: "0x08000100", tag: "DEV_PUB", text: "Mounting portfolio firmware: Pavithran U B — Embedded Developer" },
  { addr: "0x08000140", tag: "SYS_RUN", text: "Interrupts unmasked. Main superloop executing — Welcome aboard." },
];

export function BootScreen() {
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sessionStorage.getItem("pub_booted") || reduce) return;
    setShow(true);

    const timers: number[] = [];
    bootLogs.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          setCount(i + 1);
          playKeyClick();
          if (i === bootLogs.length - 1) {
            playBootBeep();
          }
        }, 140 + i * 240),
      );
    });

    timers.push(window.setTimeout(() => finish(), 140 + bootLogs.length * 240 + 400));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        finish();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  function finish() {
    sessionStorage.setItem("pub_booted", "1");
    setLeaving(true);
    window.setTimeout(() => setShow(false), 450);
  }

  if (!show) return null;

  const pct = Math.round((count / bootLogs.length) * 100);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="UART bootloader preloader"
      className={`fixed inset-0 z-[150] flex items-center justify-center bg-mask-deep p-4 transition-all duration-500 ${
        leaving ? "opacity-0 scale-[0.98] pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      <div className="absolute inset-0 bg-pcb-grid opacity-35" aria-hidden="true" />
      <div className="absolute inset-0 bg-radial-gradient from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative w-full max-w-xl rounded-2xl border border-primary/40 bg-card/95 p-6 sm:p-8 font-mono shadow-glow backdrop-blur-md">
        {/* Top header bar */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4 text-[0.72rem] tracking-[0.16em] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary animate-pulse" />
            <span className="font-semibold text-foreground">STM32F103 UART CONSOLE</span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[0.65rem] text-primary">115200 8N1</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[0.65rem] text-gold font-medium">SYSCLK 72MHz</span>
            <span className="flex gap-1.5" aria-label="LED status indicators">
              <span className="h-2 w-2 rounded-full bg-destructive/80 animate-ping" title="ERR" />
              <span className="h-2 w-2 rounded-full bg-gold/90" title="TX" />
              <span className="h-2 w-2 rounded-full bg-primary shadow-glow" title="RUN" />
            </span>
          </div>
        </div>

        {/* Boot sequence logs */}
        <div className="min-h-[12.5rem] space-y-2 text-xs sm:text-sm">
          {bootLogs.slice(0, count).map((log, i) => (
            <div
              key={log.addr}
              className="flex items-start gap-2.5 animate-in fade-in slide-in-from-left-2 duration-200"
            >
              <span className="text-muted-foreground/70 shrink-0 text-[0.7rem] pt-0.5">{log.addr}</span>
              <span className="rounded bg-primary/10 border border-primary/20 px-1 py-0.2 text-[0.68rem] text-primary shrink-0">
                {log.tag}
              </span>
              <span className="text-foreground/90 leading-tight">
                {log.text}
                {i === count - 1 && (
                  <span className="ml-1 inline-block h-3.5 w-2 translate-y-0.5 animate-blink bg-primary" />
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar and memory indicator */}
        <div className="mt-6 pt-4 border-t border-border/60">
          <div className="mb-2 flex items-center justify-between text-[0.7rem] text-muted-foreground">
            <span>FLASH SECTORS [0..4] VERIFIED</span>
            <span className="text-primary font-bold">{pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-mask">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-gold transition-all duration-200"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Footer controls */}
        <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
          <span className="text-[0.7rem] text-muted-foreground/80">Press [ESC] or click to skip</span>
          <button
            onClick={finish}
            className="rounded-lg border border-border px-3 py-1 font-mono text-xs text-primary transition-all hover:border-primary hover:bg-primary/10"
          >
            skip boot →
          </button>
        </div>
      </div>
    </div>
  );
}
