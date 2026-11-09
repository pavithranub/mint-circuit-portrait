import { Award, Code2, Cpu, Plug, Wrench, Hammer, CheckCircle2, Wifi, Radio, Bluetooth, Activity, Zap, Settings } from "lucide-react";
import { certifications, skillGroups, skills10 } from "@/data/portfolio";
import { Reveal, SectionHeading } from "./Reveal";
import { playRelayClick } from "@/lib/sound";

const icons = [Code2, Cpu, Wrench, Plug, Hammer];

const badgeIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code2,
  settings: Settings,
  cpu: Cpu,
  microchip: Cpu,
  wifi: Wifi,
  radio: Radio,
  bluetooth: Bluetooth,
  activity: Activity,
  tool: Wrench,
  zap: Zap,
};

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative border-t border-border/80 bg-mask-deep/60 py-24 sm:py-32"
    >
      <div className="absolute inset-0 bg-pcb-grid opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="06"
          label="Skills"
          title={<span id="skills-heading">Technical Skills</span>}
        />

        {/* 10 Skill Badges 5x2 Grid matching Slide 6 */}
        <div className="mb-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {skills10.map((badge, idx) => {
            const IconComponent = badgeIconMap[badge.icon] ?? Code2;
            return (
              <Reveal
                key={badge.name}
                delay={idx * 50}
                className="group flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card/90 p-5 text-center shadow-card transition-all duration-300 hover:border-primary/60 hover:-translate-y-1 hover:shadow-glow cursor-default"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <IconComponent className="h-6 w-6" />
                </div>
                <span className="font-mono text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {badge.name}
                </span>
              </Reveal>
            );
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, i) => {
            const Icon = icons[i % icons.length] ?? Code2;
            return (
              <Reveal
                key={g.name}
                delay={(i % 3) * 80}
                className="group rounded-3xl border border-border/80 bg-card/90 p-7 shadow-card transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="mb-5 flex items-center justify-between border-b border-border/60 pb-3">
                  <p className="eyebrow text-[0.68rem] text-primary font-bold uppercase tracking-wider">{g.name}</p>
                  <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <span
                      key={s}
                      onClick={() => playRelayClick()}
                      className="cursor-default rounded-lg border border-border/70 bg-mask-deep/70 px-3 py-1.5 font-mono text-xs text-foreground/90 transition-all hover:border-primary/60 hover:text-primary hover:bg-primary/5"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Reveal>
            );
          })}

          {/* Industry Certifications Card */}
          <Reveal
            delay={160}
            className="relative overflow-hidden rounded-3xl border border-gold/50 bg-card/90 p-7 shadow-gold lg:col-span-1"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/15 blur-2xl" />
            <div className="relative mb-5 flex items-center justify-between border-b border-border/60 pb-3">
              <p className="eyebrow text-[0.68rem] text-gold font-bold uppercase tracking-wider">Verified Certifications</p>
              <Award className="h-4 w-4 text-gold" />
            </div>
            <ul className="relative space-y-3" role="list">
              {certifications.map((c) => (
                <li
                  key={c.title}
                  className="rounded-xl border border-border/80 bg-mask-deep/80 p-3.5 transition-colors hover:border-gold/50"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                    <span className="font-semibold text-foreground text-sm">{c.title}</span>
                  </div>
                  <p className="mt-1 font-mono text-[0.68rem] text-muted-foreground pl-6">
                    {c.issuer}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
