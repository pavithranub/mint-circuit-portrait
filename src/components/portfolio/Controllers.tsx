import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import chipImg from "@/assets/chip-qfp.webp.asset.json";
import { alsoWorkedWith, controllers } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "./Reveal";

export function Controllers() {
  const [activeId, setActiveId] = useState(controllers[0].id);
  const active = controllers.find((c) => c.id === activeId) ?? controllers[0];

  return (
    <section
      id="controllers"
      aria-labelledby="controllers-heading"
      className="relative border-t border-border bg-mask-deep/50 py-28 sm:py-36"
    >
      <div className="absolute inset-0 bg-pcb-grid opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="02"
          label="Controllers bench"
          title={<span id="controllers-heading">The hardware I speak to.</span>}
        />

        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="relative lg:sticky lg:top-28">
            <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
              <img
                src={chipImg.url}
                alt=""
                width={1000}
                height={1000}
                loading="lazy"
                className="h-full w-full object-cover transition-[filter] duration-700"
                style={{ filter: active.hue }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mask-deep/90 via-transparent to-transparent" />
              <div className="absolute left-5 top-5 rounded-full border border-primary/40 bg-mask-deep/80 px-3 py-1 font-mono text-xs text-primary backdrop-blur">
                {active.badge}
              </div>
              <div className="absolute inset-x-5 bottom-5 grid grid-cols-3 gap-2 font-mono text-[0.65rem]">
                {[
                  ["ARCH", active.arch],
                  ["IO", `${active.protocols.length} buses`],
                  ["STATUS", "ONLINE"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-border bg-mask-deep/80 px-3 py-2 backdrop-blur">
                    <p className="text-muted-foreground">{k}</p>
                    <p className="truncate text-foreground">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div>
            <div
              role="tablist"
              aria-label="Microcontroller families"
              className="mb-6 inline-flex flex-wrap gap-1 rounded-full border border-border bg-card/70 p-1"
            >
              {controllers.map((c) => (
                <button
                  key={c.id}
                  role="tab"
                  id={`tab-${c.id}`}
                  aria-selected={c.id === activeId}
                  aria-controls={`panel-${c.id}`}
                  onClick={() => setActiveId(c.id)}
                  className={cn(
                    "rounded-full px-5 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-all",
                    c.id === activeId
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div
              key={active.id}
              id={`panel-${active.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${active.id}`}
              className="animate-in fade-in slide-in-from-bottom-2 rounded-3xl border border-border bg-card-gradient p-8 shadow-card duration-500 sm:p-10"
            >
              <p className="eyebrow">{active.arch}</p>
              <h3 className="mt-2 font-display text-4xl text-foreground">{active.name}</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{active.description}</p>
              {active.cert && (
                <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-sm text-gold">
                  <BadgeCheck className="h-4 w-4" /> {active.cert}
                </p>
              )}
              <div className="mt-7">
                <p className="eyebrow mb-3 text-[0.65rem]">Peripherals &amp; protocols</p>
                <div className="flex flex-wrap gap-2">
                  {active.protocols.map((p, i) => (
                    <span
                      key={p}
                      className="flex items-center gap-2 rounded-lg border border-border bg-mask-deep/60 px-3 py-1.5 font-mono text-xs text-foreground"
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          i % 2 === 0 ? "bg-primary" : "bg-gold",
                        )}
                      />
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-dashed border-border p-6">
              <p className="eyebrow mb-3 text-[0.65rem]">Also worked with</p>
              <div className="flex flex-wrap gap-2">
                {alsoWorkedWith.map((m) => (
                  <span
                    key={m}
                    className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
