import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { projects, type Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "./Reveal";

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" aria-labelledby="projects-heading" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            index="03"
            label="Projects"
            className="mb-0"
            title={<span id="projects-heading">Things I've built.</span>}
          />
          <p className="max-w-xs pb-2 text-sm text-muted-foreground">
            Six builds across firmware, networking and IoT. Open any card for the full breakdown.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          {projects.map((p, i) => (
            <Reveal
              key={p.slug}
              delay={(i % 3) * 80}
              className={cn(i < 2 ? "lg:col-span-3" : "lg:col-span-2")}
            >
              <button
                onClick={() => setSelected(p)}
                aria-label={`Open ${p.title} project details`}
                className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-border bg-card text-left shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
              >
                <div
                  className={cn(
                    "relative overflow-hidden",
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
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-border bg-mask-deep/80 px-3 py-1 font-mono text-[0.65rem] text-muted-foreground backdrop-blur">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-mask-deep/80 text-foreground opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100 group-hover:text-primary">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-gold">
                    {p.tag}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                    {p.stack.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-muted px-2 py-0.5 font-mono text-[0.65rem] text-muted-foreground"
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

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-3xl border-border bg-card p-0 sm:rounded-3xl">
          {selected && (
            <>
              <div className="relative aspect-[16/8] overflow-hidden">
                <img
                  src={selected.img}
                  alt={selected.imgAlt}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>
              <div className="px-7 pb-8 sm:px-10">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-gold">
                  {selected.tag}
                </p>
                <DialogTitle className="mt-2 font-display text-4xl font-normal text-foreground">
                  {selected.title}
                </DialogTitle>
                <DialogDescription className="mt-2 text-muted-foreground">
                  {selected.summary}
                </DialogDescription>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {(
                    [
                      ["Problem", selected.problem],
                      ["Hardware", selected.hardware],
                      ["Firmware / software", selected.firmware],
                      ["Outcome", selected.outcome],
                    ] as const
                  ).map(([k, v]) => (
                    <div key={k} className="rounded-2xl border border-border bg-mask-deep/50 p-5">
                      <p className="eyebrow mb-2 text-[0.62rem] text-primary">{k}</p>
                      <p className="text-sm leading-relaxed text-foreground/90">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {selected.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
