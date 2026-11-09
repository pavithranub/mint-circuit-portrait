import { Cpu, Network, Cog } from "lucide-react";
import { stats } from "@/data/portfolio";
import { Reveal, SectionHeading } from "./Reveal";

const featureCards = [
  {
    icon: Cpu,
    title: "Firmware Development",
    body: "Bare-metal, RTOS, device drivers, communication",
  },
  {
    icon: Network,
    title: "Hardware Integration",
    body: "PCB bring-up, peripheral interface, system testing",
  },
  {
    icon: Cog,
    title: "System Development",
    body: "IoT, remote monitoring, FOTA, field deployment",
  },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="01"
          label="About"
          title={
            <span id="about-heading">
              About <em className="text-gradient-signal">Me</em>
            </span>
          }
        />

        {/* Top 2-Column: Lead Text & Close-Up Chip Image matching Slide 2 */}
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] items-center mb-12">
          <Reveal className="rounded-3xl border border-border bg-card-gradient p-8 shadow-card sm:p-10">
            <p className="text-xl sm:text-2xl font-light leading-relaxed text-foreground">
              I'm an Embedded Electronics Engineer focused on developing firmware, building reliable hardware systems, and integrating them into real-world IoT and industrial solutions.
            </p>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Based in Coimbatore, I specialize in architecting register-level firmware, wireless FOTA pipelines, robust sensor topologies, and opto-isolated industrial control electronics across STM32, ESP32, and PIC platforms.
            </p>
          </Reveal>

          <Reveal delay={120} className="relative overflow-hidden rounded-3xl border border-primary/30 shadow-glow bg-card">
            <img
              src="/assets/about-chip.png"
              alt="Microcontroller silicon chip close-up with glowing PCB circuit traces"
              width={504}
              height={252}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </Reveal>
        </div>

        {/* 3 Feature Cards matching Slide 2 */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((c, i) => (
            <Reveal
              key={c.title}
              delay={i * 90}
              className="rounded-3xl border border-border bg-card p-7 shadow-card transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-glow flex flex-col gap-3"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                <c.icon className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-semibold text-foreground mt-2">{c.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
