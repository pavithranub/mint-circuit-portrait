import { Award, Code2, Cpu, Plug, Wrench, Hammer } from "lucide-react";
import { certifications, skillGroups } from "@/data/portfolio";
import { Reveal, SectionHeading } from "./Reveal";

const icons = [Code2, Cpu, Wrench, Plug, Hammer];

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative border-t border-border bg-mask-deep/50 py-28 sm:py-36"
    >
      <div className="absolute inset-0 bg-pcb-grid opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="06"
          label="Skills"
          title={<span id="skills-heading">Tools of the trade.</span>}
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, i) => {
            const Icon = icons[i % icons.length] ?? Code2;
            return (
              <Reveal
                key={g.name}
                delay={(i % 3) * 80}
                className="group rounded-3xl border border-border bg-card p-7 shadow-card transition-colors hover:border-primary/40"
              >
                <div className="mb-5 flex items-center justify-between">
                  <p className="eyebrow text-[0.65rem] text-foreground">{g.name}</p>
                  <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg border border-border bg-mask-deep/60 px-3 py-1.5 text-sm text-foreground/90 transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Reveal>
            );
          })}

          <Reveal
            delay={160}
            className="relative overflow-hidden rounded-3xl border border-gold/40 bg-card p-7 shadow-gold"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10 blur-2xl" />
            <div className="relative mb-5 flex items-center justify-between">
              <p className="eyebrow text-[0.65rem] text-gold">Certifications</p>
              <Award className="h-4 w-4 text-gold" />
            </div>
            <ul className="relative space-y-3">
              {certifications.map((c) => (
                <li
                  key={c}
                  className="flex items-center gap-3 rounded-xl border border-border bg-mask-deep/60 px-4 py-3 text-sm text-foreground"
                >
                  <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
