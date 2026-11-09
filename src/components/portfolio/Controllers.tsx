import { useState } from "react";
import { BadgeCheck, Check, Code, Cpu, ExternalLink, Layers, Terminal } from "lucide-react";
import chipImg from "@/assets/chip-qfp.webp.asset.json";
import { alsoWorkedWith, controllers, resolveAssetUrl, type Controller, type PinInfo } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "./Reveal";
import { playRelayClick } from "@/lib/sound";

export function Controllers() {
  const first = controllers[0] as Controller;
  const [activeId, setActiveId] = useState(first.id);
  const [selectedPin, setSelectedPin] = useState<PinInfo | null>(first.keyPins[0] ?? null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [viewTab, setViewTab] = useState<"specs" | "pinout" | "code">("specs");

  const active = controllers.find((c) => c.id === activeId) ?? first;
  const chipSrc = resolveAssetUrl(chipImg, "chip-qfp.webp");

  const switchController = (id: string) => {
    playRelayClick();
    setActiveId(id);
    const target = controllers.find((c) => c.id === id);
    if (target?.keyPins && target.keyPins.length > 0) {
      setSelectedPin(target.keyPins[0] ?? null);
    }
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(active.codeSnippet.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section
      id="controllers"
      aria-labelledby="controllers-heading"
      className="relative border-t border-border/80 bg-mask-deep/70 py-24 sm:py-32"
    >
      <div className="absolute inset-0 bg-pcb-grid opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="02"
          label="Silicon & Controllers Bench"
          title={<span id="controllers-heading">The silicon I program at register level.</span>}
        />

        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left Column: Interactive IC Package Visualizer */}
          <Reveal className="relative lg:sticky lg:top-28">
            <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-[2.2rem] border border-primary/30 bg-card shadow-glow">
              <img
                src={chipSrc}
                alt={active.badge}
                width={1000}
                height={1000}
                loading="lazy"
                className="h-full w-full object-cover transition-all duration-700"
                style={{ filter: active.hue }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mask-deep via-mask-deep/30 to-transparent" />

              {/* IC Identification Badges */}
              <div className="absolute left-5 top-5 flex items-center gap-2">
                <span className="rounded-full border border-primary/50 bg-mask-deep/90 px-3.5 py-1 font-mono text-xs font-bold text-primary backdrop-blur shadow-sm">
                  {active.badge}
                </span>
                <span className="rounded-full border border-gold/40 bg-mask-deep/80 px-2.5 py-1 font-mono text-[0.68rem] text-gold backdrop-blur">
                  {active.clockSpeed}
                </span>
              </div>

              {/* Pin Inspection Overlay when Pinout tab or pin is active */}
              {selectedPin && (
                <div className="absolute inset-x-5 bottom-24 rounded-2xl border border-primary/40 bg-card/95 p-3.5 backdrop-blur-md shadow-card">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-primary flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      PIN {selectedPin.pin}: {selectedPin.name}
                    </span>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[0.65rem] text-muted-foreground uppercase">
                      {selectedPin.type}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground font-mono">{selectedPin.desc}</p>
                </div>
              )}

              {/* Bottom Real-time Telemetry Metrics */}
              <div className="absolute inset-x-5 bottom-5 grid grid-cols-3 gap-2 font-mono text-[0.68rem]">
                {[
                  ["CORE", active.arch.split(" ")[0]],
                  ["FLASH", active.flash],
                  ["SRAM", active.sram],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-border/80 bg-mask-deep/90 px-3 py-2 backdrop-blur">
                    <p className="text-muted-foreground text-[0.6rem]">{k}</p>
                    <p className="truncate text-foreground font-semibold">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right Column: Controller Selector, Specs, Pinout & Register Code */}
          <div>
            {/* Microcontroller Family Selector Tabs */}
            <div
              role="tablist"
              aria-label="Microcontroller families"
              className="mb-6 inline-flex flex-wrap gap-1.5 rounded-full border border-border/80 bg-card/80 p-1.5 backdrop-blur"
            >
              {controllers.map((c) => (
                <button
                  key={c.id}
                  role="tab"
                  id={`tab-${c.id}`}
                  aria-selected={c.id === activeId}
                  aria-controls={`panel-${c.id}`}
                  onClick={() => switchController(c.id)}
                  className={cn(
                    "rounded-full px-5 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-all",
                    c.id === activeId
                      ? "bg-primary text-primary-foreground font-bold shadow-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Active Controller Card */}
            <div
              key={active.id}
              id={`panel-${active.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${active.id}`}
              className="rounded-3xl border border-border/80 bg-card/90 p-7 shadow-card backdrop-blur duration-300 sm:p-9"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-4">
                <div>
                  <p className="eyebrow text-xs text-gold">{active.arch}</p>
                  <h3 className="mt-1 font-display text-3xl sm:text-4xl text-foreground font-normal">
                    {active.name} <span className="text-sm font-mono text-muted-foreground">({active.badge})</span>
                  </h3>
                </div>
                {active.cert && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-xs text-gold">
                    <BadgeCheck className="h-4 w-4" /> {active.cert}
                  </span>
                )}
              </div>

              <p className="mt-4 leading-relaxed text-muted-foreground text-sm sm:text-base">
                {active.description}
              </p>

              {/* Sub-tabs: Specs vs Key Pinout vs Bare-Metal Code */}
              <div className="mt-6 flex items-center gap-2 border-b border-border/60 pb-3">
                {[
                  { id: "specs", label: "Hardware Specs", icon: Layers },
                  { id: "pinout", label: "Interactive Pinout", icon: Cpu },
                  { id: "code", label: "Bare-Metal C Code", icon: Code },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      playRelayClick();
                      setViewTab(t.id as "specs" | "pinout" | "code");
                    }}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs transition-colors",
                      viewTab === t.id
                        ? "bg-primary/15 text-primary border border-primary/30 font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    <t.icon className="h-3.5 w-3.5" />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Sub-tab 1: Hardware Specs & Protocols */}
              {viewTab === "specs" && (
                <div className="mt-5 space-y-4 animate-in fade-in duration-200">
                  <div>
                    <p className="eyebrow mb-2 text-[0.65rem] text-muted-foreground">Supported Protocols &amp; Interfaces</p>
                    <div className="flex flex-wrap gap-1.5">
                      {active.protocols.map((p) => (
                        <span
                          key={p}
                          className="rounded-lg border border-border/80 bg-mask-deep/60 px-3 py-1 font-mono text-xs text-foreground/90 transition-colors hover:border-primary hover:text-primary"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4 font-mono text-xs">
                    <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                      <span className="text-[0.62rem] text-muted-foreground block">CLOCK FREQ</span>
                      <span className="font-semibold text-primary">{active.clockSpeed}</span>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                      <span className="text-[0.62rem] text-muted-foreground block">FLASH ROM</span>
                      <span className="font-semibold text-foreground">{active.flash}</span>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                      <span className="text-[0.62rem] text-muted-foreground block">INTERNAL SRAM</span>
                      <span className="font-semibold text-foreground">{active.sram}</span>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                      <span className="text-[0.62rem] text-muted-foreground block">IO CAPABILITY</span>
                      <span className="font-semibold text-gold">{active.keyPins.length}+ Mapped</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: Interactive Pinout Grid */}
              {viewTab === "pinout" && (
                <div className="mt-5 space-y-3 animate-in fade-in duration-200">
                  <p className="text-xs text-muted-foreground font-mono">
                    Click any pin to inspect its hardware mapping and register alternate function:
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {active.keyPins.map((pin) => (
                      <button
                        key={pin.pin}
                        onClick={() => {
                          playRelayClick();
                          setSelectedPin(pin);
                        }}
                        className={cn(
                          "flex flex-col items-start rounded-xl border p-2.5 text-left font-mono transition-all",
                          selectedPin?.pin === pin.pin
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border/70 bg-card/60 hover:border-primary/50",
                        )}
                      >
                        <span className="text-[0.68rem] font-bold text-primary">{pin.pin}</span>
                        <span className="text-xs font-semibold text-foreground truncate w-full">{pin.name}</span>
                        <span className="text-[0.6rem] text-muted-foreground/80 mt-1 uppercase">{pin.type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Bare-Metal C Register Code */}
              {viewTab === "code" && (
                <div className="mt-5 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>{active.codeSnippet.title}</span>
                    <button
                      onClick={copySnippet}
                      className="flex items-center gap-1 text-primary hover:underline text-xs"
                    >
                      {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Code className="h-3.5 w-3.5" />}
                      <span>{copiedCode ? "Copied" : "Copy C Code"}</span>
                    </button>
                  </div>
                  <pre className="overflow-x-auto rounded-xl border border-border/80 bg-mask-deep p-4 font-mono text-xs text-primary/95 leading-relaxed">
                    <code>{active.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Additional Controllers worked with pill cloud */}
            <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="eyebrow text-[0.65rem] text-muted-foreground">Also programmed:</span>
              {alsoWorkedWith.map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-border/70 bg-card/70 px-3 py-1 text-foreground/80 text-[0.72rem]"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
