import { useEffect, useRef } from "react";
import { ArrowDownRight, Download, Mail } from "lucide-react";
import heroImg from "@/assets/hero-board.webp.asset.json";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/portfolio";

export function Hero() {
  const boardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      el.style.transform = `perspective(1200px) rotateX(${-y}deg) rotateY(${x}deg)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28"
    >
      <div className="absolute inset-0 -z-10 bg-pcb-grid opacity-60 mask-fade-bottom" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-hero-glow" aria-hidden="true" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10">
          <div className="mb-8 inline-flex animate-in fade-in slide-in-from-bottom-2 items-center gap-2.5 rounded-full border border-primary/30 bg-primary/5 py-1.5 pl-2 pr-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-primary duration-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-primary" />
              <span className="relative h-2 w-2 rounded-full bg-primary" />
            </span>
            System running · {profile.location}
          </div>

          <h1
            id="hero-heading"
            className="font-display text-[clamp(3.5rem,10vw,7.5rem)] leading-[0.92] tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000"
          >
            Pavithran
            <br />
            <span className="italic text-gradient-signal">U B</span>
          </h1>

          <p className="mt-6 max-w-md text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-4 delay-150 duration-1000 fill-mode-both sm:text-xl">
            Embedded firmware engineer who{" "}
            <span className="text-foreground">thinks in registers</span> — building STM32, ESP32
            &amp; PIC systems that ship.
          </p>

          <blockquote className="mt-6 max-w-md border-l-2 border-gold/60 pl-4 font-mono text-xs leading-relaxed text-muted-foreground/90">
            "Code is like humor. When you have to explain it, it's bad. But embedded systems? They
            speak in voltages and logic."
          </blockquote>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild variant="signal" size="lg">
              <a href="#projects">
                View work <ArrowDownRight />
              </a>
            </Button>
            <Button asChild variant="trace" size="lg">
              <a href="#contact">
                <Mail /> Get in touch
              </a>
            </Button>
            <Button asChild variant="trace" size="lg">
              <a href={profile.resume} download aria-label="Download resume (Word document)">
                <Download /> Resume
              </a>
            </Button>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {[
              ["Employer", "Xpert Automatix"],
              ["MCUs", "STM32 · ESP32 · PIC"],
              ["Focus", "Firmware · IoT · FOTA"],
            ].map(([k, v]) => (
              <div key={k} className="bg-card/80 px-4 py-3">
                <dt className="eyebrow text-[0.62rem]">{k}</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative" aria-hidden="true">
          <div className="absolute -inset-10 rounded-full bg-primary/10 blur-3xl" />
          <div
            ref={boardRef}
            className="relative transition-transform duration-300 ease-out will-change-transform"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-glow">
              <img
                src={heroImg.url}
                alt=""
                width={1600}
                height={1195}
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="h-1/4 w-full animate-scan bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
              </div>
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 800 600"
                fill="none"
              >
                <path
                  className="animate-trace stroke-primary"
                  d="M60 320 Q200 200 400 290 T760 250"
                  strokeWidth="1.5"
                  opacity="0.7"
                />
                <path
                  className="animate-trace stroke-gold"
                  style={{ animationDelay: "0.3s" }}
                  d="M40 430 Q300 380 520 430 T780 400"
                  strokeWidth="1"
                  opacity="0.5"
                />
              </svg>
            </div>

            {/* floating readouts */}
            <div className="glass absolute -left-4 top-8 hidden animate-float rounded-2xl border border-border px-4 py-3 font-mono text-xs shadow-card sm:block">
              <p className="text-muted-foreground">MCU</p>
              <p className="text-primary">STM32F103 · 72 MHz</p>
            </div>
            <div
              className="glass absolute -right-3 bottom-10 hidden animate-float rounded-2xl border border-border px-4 py-3 font-mono text-xs shadow-card sm:block"
              style={{ animationDelay: "-3s" }}
            >
              <p className="text-muted-foreground">UART</p>
              <p className="text-gold">115200 · 8N1 · OK</p>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary md:flex"
      >
        scroll
        <span className="h-10 w-px bg-gradient-to-b from-primary to-transparent" />
      </a>
    </section>
  );
}
