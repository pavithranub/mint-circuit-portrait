import { GraduationCap } from "lucide-react";
import { experience } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "./Reveal";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="exp-heading" className="relative py-28 sm:py-36">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            index="05"
            label="Experience"
            title={<span id="exp-heading">Where I've worked.</span>}
          />
          <Reveal className="rounded-3xl border border-border bg-card-gradient p-7 shadow-card">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/40 bg-gold/10 text-gold">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div id="education">
                <p className="eyebrow text-[0.62rem]">Education · 2022 – 2024</p>
                <h3 className="mt-1.5 text-lg font-semibold text-foreground">Master of Science</h3>
                <p className="text-sm text-muted-foreground">
                  Electronics &amp; Communication Systems
                </p>
                <p className="mt-2 text-sm text-gold">PSG Arts &amp; Science College, Coimbatore</p>
              </div>
            </div>
          </Reveal>
        </div>

        <ol className="relative space-y-5 before:absolute before:bottom-6 before:left-[1.15rem] before:top-6 before:w-px before:bg-gradient-to-b before:from-primary before:via-border before:to-transparent">
          {experience.map((e, i) => (
            <Reveal as="li" key={e.role} delay={i * 100} className="relative pl-14">
              <span
                className={cn(
                  "absolute left-2 top-7 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-background",
                  e.current ? "border-primary" : "border-border",
                )}
              >
                {e.current && <span className="h-2 w-2 rounded-full bg-primary shadow-glow" />}
              </span>
              <article className="rounded-3xl border border-border bg-card p-7 shadow-card transition-colors hover:border-primary/40">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.12em]",
                      e.current
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {e.meta}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-semibold text-foreground">{e.role}</h3>
                <p className="mt-1 text-sm text-gold">{e.company}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{e.body}</p>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
