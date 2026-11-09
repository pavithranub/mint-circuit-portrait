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

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Column: Headline and Overview */}
        <div className="relative z-10">
          {/* Eyebrow matching Slide 1 */}
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-primary font-medium">
            EMBEDDED DEVELOPER · COIMBATORE, TAMIL NADU
          </p>

          <h1
            id="hero-heading"
            className="font-display text-[clamp(3.2rem,8.5vw,6rem)] leading-[0.94] tracking-tight text-foreground"
          >
            Pavithran
            <br />
            <span className="text-[#d6b266]">UB</span>
          </h1>

          <p className="mt-5 text-xl text-foreground/90 sm:text-2xl font-normal leading-snug">
            Embedded Electronics Engineer | <br />
            <span className="text-primary font-medium">Firmware &amp; Hardware Integration</span>
          </p>

          <blockquote className="mt-6 max-w-lg border-l-2 border-[#d6b266] pl-4 font-sans text-sm italic leading-relaxed text-muted-foreground bg-card/40 py-2 rounded-r-lg">
            "Designing reliable embedded solutions by bridging firmware, electronics and real-world systems."
          </blockquote>

          {/* Action CTAs matching Slide 1 */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="signal" size="lg" onClick={() => playRelayClick()}>
              <a href="#projects" className="font-mono text-xs uppercase tracking-wider font-semibold">
                View Work <ArrowDownRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="trace" size="lg" onClick={() => playRelayClick()}>
              <a href="#contact" className="font-mono text-xs uppercase tracking-wider border-primary/40 hover:bg-primary/10">
                <Mail className="mr-1.5 h-4 w-4 text-primary" /> Get in Touch
              </a>
            </Button>
            <Button asChild variant="trace" size="lg" onClick={() => playRelayClick()}>
              <a href={profile.resume} download aria-label="Download Pavithran UB resume" className="font-mono text-xs uppercase tracking-wider">
                <Download className="mr-1.5 h-4 w-4 text-[#d6b266]" /> Resume
              </a>
            </Button>
          </div>

          {/* Quick Hardware Specs Ribbon */}
          <dl className="mt-8 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border/80 bg-border/60 shadow-card">
            {[
              ["Employer", "INGLO / Xpert Automatix"],
              ["MCUs", "STM32 · ESP32 · PIC"],
              ["Focus", "Firmware · IoT · FOTA"],
            ].map(([k, v]) => (
              <div key={k} className="bg-card/90 px-4 py-3">
                <dt className="eyebrow text-[0.62rem] text-muted-foreground uppercase tracking-wider">{k}</dt>
                <dd className="mt-1 text-xs sm:text-sm font-medium text-foreground">{v}</dd>
              </div>
            ))}
          </dl>

          {/* System Running Status Chip */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 py-1 pl-2.5 pr-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-primary" />
            </span>
            <span>SYSTEM RUNNING</span>
          </div>
        </div>

        {/* Right Column: Oscilloscope Circuit Board with Test Points */}
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
                  className="animate-trace stroke-[#d6b266]"
                  style={{ animationDelay: "0.3s" }}
                  d="M40 430 Q300 380 520 430 T780 400"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
                <circle cx="400" cy="290" r="4" fill="#00ffb2" className="animate-ping" />
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
                <span className="relative flex h-5 w-5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative h-5 w-5 rounded-full border border-primary bg-background/90 text-[0.6rem] font-mono text-primary flex items-center justify-center font-bold shadow-glow">
                    TP1
                  </span>
                </span>
              </div>

              <div
                className="absolute right-[28%] bottom-[35%] flex items-center justify-center cursor-pointer pointer-events-auto"
                onMouseEnter={() => {
                  playRelayClick();
                  setActiveProbe("TP2: USART1_TX = 115200 8N1 PASS");
                }}
                onMouseLeave={() => setActiveProbe(null)}
              >
                <span className="relative flex h-5 w-5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative h-5 w-5 rounded-full border border-primary bg-background/90 text-[0.6rem] font-mono text-primary flex items-center justify-center font-bold shadow-glow">
                    TP2
                  </span>
                </span>
              </div>

              {/* Floating Real-time Test Point Probe Readout */}
              {activeProbe && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 rounded-full border border-primary bg-background/95 px-4 py-1.5 font-mono text-xs text-primary shadow-glow pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                  {activeProbe}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
