import { Cpu, Radio, Wrench } from "lucide-react";
import { stats } from "@/data/portfolio";
import { Reveal, SectionHeading } from "./Reveal";

const pillars = [
  {
    icon: Cpu,
    title: "Bare-metal firmware",
    body: "Registers, interrupts, fault handlers and task scheduling on STM32, PIC and Nuvoton.",
  },
  {
    icon: Radio,
    title: "Connected devices",
    body: "ESP32 Wi-Fi & BLE, GSM alerts and web dashboards for live monitoring and control.",
  },
  {
    icon: Wrench,
    title: "Hands on hardware",
    body: "PCB design in KiCad, soldering, and debugging with oscilloscope and DMM.",
  },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="01"
          label="About"
          title={
            <span id="about-heading">
              Embedded systems are <em className="text-gradient-signal">my craft.</em>
            </span>
          }
        />

        <div className="grid gap-5 lg:grid-cols-12">
          <Reveal className="rounded-3xl border border-border bg-card-gradient p-8 shadow-card lg:col-span-7 sm:p-10">
            <div className="space-y-5 text-[1.05rem] leading-relaxed text-muted-foreground">
              <p>
                Enthusiastic embedded firmware developer with a solid background in{" "}
                <span className="text-foreground">Applied Electronics</span>. I enjoy designing and
                optimising embedded systems, and I'm looking for opportunities to apply my
                technical expertise, problem-solving and hands-on firmware experience.
              </p>
              <p>
                Based in Coimbatore, I currently work at{" "}
                <span className="font-medium text-gold">Xpert Automatix</span>, where I develop and
                deploy microcontroller-based products — from bare-metal firmware to full water-level
                controller systems installed at customer sites.
              </p>
              <p>
                My training background spans robotics, IoT, PCB design and hardware debugging,
                including advanced controllers like STM32 and low-level techniques such as
                bare-metal programming, fault handling and task scheduling.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-5 lg:col-span-5">
            {stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 80}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card transition-colors hover:border-primary/50"
              >
                <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-border transition-colors group-hover:bg-primary" />
                <p className="font-display text-5xl text-foreground sm:text-6xl">{s.num}</p>
                <p className="eyebrow mt-3 text-[0.65rem]">{s.label}</p>
              </Reveal>
            ))}
          </div>

          {pillars.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i * 90}
              className="rounded-3xl border border-border bg-card/60 p-7 lg:col-span-4"
            >
              <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
