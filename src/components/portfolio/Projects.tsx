import { useState } from "react";
import { ArrowUpRight, Cpu, Layers, Terminal, Wrench, X, Sparkles, Activity } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { projects, type Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "./Reveal";
import { playRelayClick } from "@/lib/sound";

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState<"all" | "firmware" | "iot" | "industrial">("all");

  const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  const openProject = (p: Project) => {
    playRelayClick();
    setSelected(p);
  };

  return (
    <section id="projects" aria-labelledby="projects-heading" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border/60 pb-8">
          <SectionHeading
            index="03"
            label="Engineering Portfolio"
            className="mb-0"
            title={<span id="projects-heading">Real firmware. Real hardware. Real deployments.</span>}
          />

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 rounded-full border border-border/80 bg-card/80 p-1.5 backdrop-blur font-mono text-xs">
            {[
              { id: "all", label: `All Builds (${projects.length})` },
              { id: "firmware", label: "Firmware / OTA" },
              { id: "iot", label: "IoT & Wireless" },
              { id: "industrial", label: "Industrial & Products" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playRelayClick();
                  setFilter(tab.id as typeof filter);
                }}
                className={cn(
                  "rounded-full px-3.5 py-1.5 transition-all",
                  filter === tab.id
                    ? "bg-primary text-primary-foreground font-bold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-6">
          {filtered.map((p, i) => (
            <Reveal
              key={p.slug}
              delay={(i % 3) * 80}
              className={cn(i < 2 ? "lg:col-span-3" : "lg:col-span-2")}
            >
              <button
                onClick={() => openProject(p)}
                aria-label={`Inspect ${p.title} engineering dossier`}
                className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-border/80 bg-card text-left shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-glow"
              >
                {/* PCB Silk registration crosshair in corner */}
                <span className="absolute top-3 right-3 text-muted-foreground/30 font-mono text-[0.65rem] pointer-events-none group-hover:text-primary transition-colors">
                  + U{i + 1}
                </span>

                <div
                  className={cn(
                    "relative overflow-hidden w-full",
                    i < 2 ? "aspect-[16/9]" : "aspect-[4/3]",
                  )}
                >
                  <img
                    src={p.img}
                    alt={p.imgAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/15 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="rounded-full border border-border bg-mask-deep/85 px-2.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground backdrop-blur">
                      0{i + 1}
                    </span>
                    {p.slug === "fota" && (
                      <span className="rounded-full border border-primary/40 bg-primary/20 px-2 py-0.5 font-mono text-[0.62rem] text-primary backdrop-blur flex items-center gap-1">
                        <Activity className="h-3 w-3" /> SIM AVAILABLE
                      </span>
                    )}
                  </div>

                  <span className="absolute right-4 bottom-4 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-mask-deep/80 text-foreground opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100 group-hover:text-primary">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-gold font-medium">
                    {p.tag}
                  </p>
                  <h3 className="mt-1.5 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {p.summary}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                    {p.stack.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[0.65rem] text-muted-foreground group-hover:border-primary/30 group-hover:text-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Comprehensive Project Engineering Modal */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto rounded-3xl border border-primary/30 bg-card p-0 shadow-glow sm:rounded-3xl">
          {selected && (
            <div>
              {/* Header Image banner */}
              <div className="relative h-60 overflow-hidden sm:h-80">
                <img
                  src={selected.img}
                  alt={selected.imgAlt}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="rounded-full border border-gold/40 bg-mask-deep/85 px-3 py-1 font-mono text-xs text-gold backdrop-blur">
                    {selected.tag}
                  </span>
                </div>
              </div>

              {/* Content body */}
              <div className="relative -mt-8 px-6 pb-8 sm:px-10">
                <DialogTitle className="font-display text-3xl sm:text-4xl font-normal text-foreground">
                  {selected.title}
                </DialogTitle>

                {/* Measurable metrics ribbon */}
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 font-mono text-xs">
                  {selected.metrics.map((m, idx) => (
                    <div key={idx} className="rounded-xl border border-border/80 bg-muted/30 p-2.5">
                      <span className="text-primary font-bold block">✓ SPEC</span>
                      <span className="text-[0.68rem] text-muted-foreground leading-tight">{m}</span>
                    </div>
                  ))}
                </div>

                {/* Problem vs Hardware vs Firmware breakdown */}
                <div className="mt-8 space-y-5 text-sm">
                  <div className="rounded-2xl border border-border/80 bg-mask-deep/50 p-5">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-gold flex items-center gap-1.5">
                      <Layers className="h-4 w-4" /> The Engineering Problem
                    </h4>
                    <p className="mt-2 text-muted-foreground leading-relaxed">
                      {selected.problem}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border/80 bg-mask-deep/50 p-5">
                      <h4 className="font-mono text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
                        <Cpu className="h-4 w-4" /> Hardware &amp; Transceivers
                      </h4>
                      <p className="mt-2 text-muted-foreground leading-relaxed text-xs">
                        {selected.hardware}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border/80 bg-mask-deep/50 p-5">
                      <h4 className="font-mono text-xs uppercase tracking-wider text-gold flex items-center gap-1.5">
                        <Terminal className="h-4 w-4" /> Firmware Architecture
                      </h4>
                      <p className="mt-2 text-muted-foreground leading-relaxed text-xs">
                        {selected.firmware}
                      </p>
                    </div>
                  </div>

                  {/* Architecture Flow Diagram */}
                  <div className="rounded-2xl border border-primary/30 bg-mask-deep p-5">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" /> Signal Flow &amp; Protocol Pipeline
                    </h4>
                    <pre className="mt-3 overflow-x-auto rounded-lg bg-card/60 p-3 font-mono text-xs text-primary/90 leading-normal">
                      <code>{selected.architecture}</code>
                    </pre>
                  </div>

                  {/* Bill of Materials (BOM) */}
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                      <Wrench className="h-3.5 w-3.5" /> Component BOM
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.bom.map((b) => (
                        <span
                          key={b}
                          className="rounded-lg border border-border bg-card/80 px-2.5 py-1 font-mono text-xs text-foreground/90"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Outcome */}
                  <div className="rounded-2xl border border-primary/40 bg-primary/5 p-4 flex items-center justify-between">
                    <div>
                      <p className="eyebrow text-[0.62rem] text-primary">Outcome &amp; Production Verification</p>
                      <p className="mt-1 text-sm font-medium text-foreground">{selected.outcome}</p>
                    </div>
                    {selected.slug === "fota" && (
                      <a
                        href="#fota-sim"
                        onClick={() => setSelected(null)}
                        className="rounded-full bg-primary px-4 py-2 font-mono text-xs text-primary-foreground font-bold hover:bg-primary/90 shadow-glow"
                      >
                        Run Live Sim →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
