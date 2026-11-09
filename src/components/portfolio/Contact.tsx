import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Download, Github, Linkedin, Mail, Phone, Send } from "lucide-react";
import pcbImg from "@/assets/pcb-wide.webp.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { profile, resolveAssetUrl } from "@/data/portfolio";
import { Reveal } from "./Reveal";
import { playRelayClick, playSuccessChime } from "@/lib/sound";

export function Contact() {
  const [copied, setCopied] = useState<"idle" | "copied" | "shown">("idle");
  const pcbSrc = resolveAssetUrl(pcbImg, "pcb-wide.webp");

  const copyPhone = async () => {
    playRelayClick();
    try {
      await navigator.clipboard.writeText(profile.phone);
      setCopied("copied");
      setTimeout(() => setCopied("idle"), 2000);
    } catch {
      setCopied("shown");
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    playSuccessChime();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").slice(0, 100);
    const subject = String(fd.get("subject") ?? "").slice(0, 150);
    const message = String(fd.get("message") ?? "").slice(0, 2000);
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      `${subject} (from ${name})`,
    )}&body=${encodeURIComponent(message)}`;
  };

  const links = [
    { icon: Mail, label: "Direct Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: Linkedin, label: "LinkedIn Network", value: "pavithran-ub", href: profile.linkedin },
    { icon: Github, label: "GitHub Codebase", value: "pavithranub", href: profile.github },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate overflow-hidden py-24 sm:py-32"
    >
      <img
        src={pcbSrc}
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-15"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/90 to-background" />

      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow mb-4 flex items-center gap-3">
            <span className="text-primary font-bold">07</span>
            <span className="h-px w-10 bg-border" />
            Direct Contact Bus
          </p>
          <h2
            id="contact-heading"
            className="font-display text-5xl leading-[1.05] text-foreground sm:text-6xl md:text-7xl font-normal"
          >
            Let's build
            <br />
            <em className="text-gradient-signal font-normal">something real.</em>
          </h2>
          <p className="mt-6 max-w-md text-muted-foreground leading-relaxed">
            Open to embedded firmware, IoT system architecture, and hardware debugging opportunities.
            The fastest channel to reach me is email or telephone.
          </p>

          <div className="mt-10 space-y-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => playRelayClick()}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-border/80 bg-card/80 p-4 backdrop-blur transition-all duration-200 hover:border-primary/60 hover:bg-card hover:shadow-glow"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <l.icon className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="eyebrow block text-[0.62rem] text-muted-foreground">{l.label}</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{l.value}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </a>
            ))}

            <button
              onClick={copyPhone}
              aria-label="Copy phone number to clipboard"
              className="group flex w-full items-center gap-4 rounded-2xl border border-border/80 bg-card/80 p-4 text-left backdrop-blur transition-all duration-200 hover:border-primary/60 hover:bg-card hover:shadow-glow"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                {copied === "copied" ? <Check className="h-5 w-5 text-primary" /> : <Phone className="h-5 w-5" />}
              </span>
              <span className="flex-1">
                <span className="eyebrow block text-[0.62rem] text-muted-foreground">Mobile Phone</span>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {copied === "copied"
                    ? "✓ Copied to clipboard (+91 96295 95672)"
                    : copied === "shown"
                      ? profile.phoneDisplay
                      : `${profile.phoneDisplay} (Click to copy)`}
                </span>
              </span>
            </button>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <form
            onSubmit={onSubmit}
            aria-label="Send direct message to Pavithran"
            className="rounded-[2.2rem] border border-border/80 bg-card/95 p-7 shadow-card backdrop-blur sm:p-9"
          >
            <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-4">
              <h3 className="text-lg font-semibold text-foreground">Transmit Dispatch</h3>
              <span className="font-mono text-[0.68rem] text-gold">DISPATCH VIA MAIL CLIENT</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="cf-name" className="font-mono text-xs text-muted-foreground">Your Name</Label>
                <Input
                  id="cf-name"
                  name="name"
                  required
                  maxLength={100}
                  autoComplete="name"
                  placeholder="Engineering Director / Recruiter"
                  className="h-12 rounded-xl bg-mask-deep/80 border-border/80 focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cf-subject" className="font-mono text-xs text-muted-foreground">Subject Line</Label>
                <Input
                  id="cf-subject"
                  name="subject"
                  required
                  maxLength={150}
                  placeholder="Embedded Systems Opportunity — Xpert / Firmware"
                  className="h-12 rounded-xl bg-mask-deep/80 border-border/80 focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cf-message" className="font-mono text-xs text-muted-foreground">Message Payload</Label>
                <Textarea
                  id="cf-message"
                  name="message"
                  required
                  maxLength={2000}
                  rows={4}
                  placeholder="Hello Pavithran, I reviewed your FOTA and STM32 work..."
                  className="rounded-xl bg-mask-deep/80 border-border/80 focus:border-primary"
                />
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" variant="signal" size="lg" className="flex-1 font-mono text-xs uppercase tracking-wider">
                  <Send className="mr-1.5 h-4 w-4" /> Open In Email Client
                </Button>
                <Button asChild variant="gold" size="lg" onClick={() => playRelayClick()} className="font-mono text-xs uppercase tracking-wider">
                  <a href={profile.resume} download aria-label="Download resume (Word document)">
                    <Download className="mr-1.5 h-4 w-4" /> Word Resume
                  </a>
                </Button>
              </div>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
