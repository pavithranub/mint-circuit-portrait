import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, Download, Mail, Activity, Terminal, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero-board.webp.asset.json";
import { Button } from "@/components/ui/button";
import { profile, resolveAssetUrl } from "@/data/portfolio";
import { playRelayClick } from "@/lib/sound";

export function Hero() {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [activeProbe, setActiveProbe] = useState<string | null>(null);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = ((e.clientX - centerX) / (window.innerWidth / 2)) * 12;
      const y = ((e.clientY - centerY) / (window.innerHeight / 2)) * 10;
      el.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg)`;
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const heroBoardSrc = resolveAssetUrl(heroImg, "hero-board.webp");

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28"
    >
      {/* Background grids and glowing traces */}
      <div className="absolute inset-0 -z-10 bg-pcb-grid opacity-60 mask-fade-bottom" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-hero-glow" aria-hidden="true" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr]">
        {/* Left Column: Headline and Overview */}
        <div className="relative z-10">
          {/* Status Chip */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-primary/40 bg-primary/10 py-1.5 pl-2.5 pr-4 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-primary shadow-glow">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-primary" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            <span>SYSTEM ACTIVE · 72 MHz PLL LOCK</span>
          </div>

          <h1
            id="hero-heading"
            className="font-display text-[clamp(3.5rem,9.5vw,7.2rem)] leading-[0.92] tracking-tight text-foreground"
          >
            Pavithran
            <br />
            <span className="italic text-gradient-signal">U B</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-muted-foreground sm:text-xl font-normal leading-relaxed">
            Embedded firmware engineer who{" "}
            <span className="text-foreground font-semibold">thinks in registers</span> — architecting
            STM32, ESP32 &amp; PIC systems with reliable bare-metal C, custom bootloaders, and zero-downtime FOTA.
          </p>

          <blockquote className="mt-6 max-w-lg border-l-2 border-gold/70 pl-4 font-mono text-xs leading-relaxed text-muted-foreground/90 bg-card/40 py-2 rounded-r-lg">
            "Code is like humor. When you have to explain it, it's bad. But embedded systems? They
            speak in voltages and logic."
          </blockquote>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="signal" size="lg" onClick={() => playRelayClick()}>
              <a href="#projects" className="font-mono text-xs uppercase tracking-wider">
                Explore Work <ArrowDownRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="trace" size="lg" onClick={() => playRelayClick()}>
              <a href="#fota-sim" className="font-mono text-xs uppercase tracking-wider text-primary border-primary/40 hover:bg-primary/10">
                <Activity className="mr-1 h-4 w-4 text-primary" /> Live FOTA Sim
              </a>
            </Button>
            <Button asChild variant="trace" size="lg" onClick={() => playRelayClick()}>
              <a href={profile.resume} download aria-label="Download resume (Word document)" className="font-mono text-xs uppercase tracking-wider">
                <Download className="mr-1 h-4 w-4 text-gold" /> Resume
              </a>
            </Button>
          </div>

          {/* Quick Hardware Specs Ribbon */}
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border/80 bg-border/60 shadow-card">
            {[
              ["Employer", "Xpert Automatix"],
              ["MCUs", "STM32 · ESP32 · PIC"],
              ["Focus", "Firmware · IoT · FOTA"],
            ].map(([k, v]) => (
              <div key={k} className="bg-card/90 px-4 py-3">
                <dt className="eyebrow text-[0.62rem] text-muted-foreground">{k}</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right Column: Interactive 3D/Parallax Circuit Board with Test Points */}
        <div className="relative" aria-hidden="true">
          <div className="absolute -inset-10 rounded-full bg-primary/15 blur-3xl" />

          <div
            ref={boardRef}
            className="relative transition-transform duration-300 ease-out will-change-transform"
          >
            {/* The Circuit Board Frame */}
            <div className="relative overflow-hidden rounded-[2.2rem] border border-primary/30 shadow-glow bg-card">
              <img
                src={heroBoardSrc}
                alt="Pavithran UB Embedded Dev Board"
                width={1600}
                height={1195}
                fetchPriority="high"
                className="h-full w-full object-cover"
              />

              {/* Laser scanline overlay */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="h-1/5 w-full animate-scan bg-gradient-to-b from-transparent via-primary/15 to-transparent" />
              </div>

              {/* Animated Copper Signal Traces */}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 800 600"
                fill="none"
              >
                <path
                  className="animate-trace stroke-primary"
                  d="M60 320 Q200 200 400 290 T760 250"
                  strokeWidth="2"
                  opacity="0.8"
                />
                <path
                  className="animate-trace stroke-gold"
                  style={{ animationDelay: "0.3s" }}
                  d="M40 430 Q300 380 520 430 T780 400"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
                <circle cx="400" cy="290" r="4" fill="#6fe3c1" className="animate-ping" />
              </svg>

              {/* Interactive Test Point Pads on Board */}
              <div
                className="absolute left-[38%] top-[42%] flex items-center justify-center cursor-pointer pointer-events-auto"
                onMouseEnter={() => {
                  playRelayClick();
                  setActiveProbe("TP1: SYSCLK = 72.000 MHz (PLL ×9)");
                }}
                onMouseLeave={() => setActiveProbe(null)}
              >
                <span className="relative flex h-4 w-4">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative h-4 w-4 rounded-full border border-primary bg-primary/30 text-[0.55rem] font-mono text-primary flex items-center justify-center font-bold">
                    TP1
                  </span>
                </span>
              </div>

              <div
                className="absolute right-[28%] bottom-[35%] flex items-center justify-center cursor-pointer pointer-events-auto"
                onMouseEnter={() => {
                  playRelayClick();
                  setActiveProbe("TP2: USART1_TX = 115200 8N1 OK");
                }}
                onMouseLeave={() => setActiveProbe(null)}
              >
                <span className="relative flex h-4 w-4">
                  <span className="absolute inset-0 animate-ping rounded-full bg-gold opacity-75" />
                  <span className="relative h-4 w-4 rounded-full border border-gold bg-gold/30 text-[0.55rem] font-mono text-gold flex items-center justify-center font-bold">
                    TP2
                  </span>
                </span>
              </div>

              {/* Probe Readout Pill */}
              {activeProbe && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 glass border border-primary/60 px-3 py-1.5 rounded-full font-mono text-xs text-primary shadow-glow animate-in fade-in zoom-in-95">
                  {activeProbe}
                </div>
              )}
            </div>

            {/* Floating Hardware Readout Widgets */}
            <div className="glass absolute -left-5 top-10 hidden animate-float rounded-2xl border border-primary/30 px-4 py-3 font-mono text-xs shadow-card sm:block backdrop-blur-md">
              <p className="text-[0.65rem] text-muted-foreground uppercase tracking-wider">TARGET MCU</p>
              <p className="text-primary font-bold">STM32F103 · 72 MHz</p>
              <p className="text-[0.65rem] text-gold mt-0.5">ARM Cortex-M3 32-bit</p>
            </div>

            <div
              className="glass absolute -right-4 bottom-8 hidden animate-float rounded-2xl border border-gold/40 px-4 py-3 font-mono text-xs shadow-card sm:block backdrop-blur-md"
              style={{ animationDelay: "-3s" }}
            >
              <p className="text-[0.65rem] text-muted-foreground uppercase tracking-wider">FIRMWARE PIPELINE</p>
              <p className="text-gold font-bold">UART 115200 · CRC32</p>
              <p className="text-[0.65rem] text-primary mt-0.5">FOTA Stream Ready</p>
            </div>
          </div>
        </div>
      </div>

      {/* Down scroll hint */}
      <a
        href="#about"
        onClick={() => playRelayClick()}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors md:flex"
      >
        <span>scroll signal</span>
        <span className="h-8 w-px bg-gradient-to-b from-primary to-transparent" />
      </a>
    </section>
  );
}
