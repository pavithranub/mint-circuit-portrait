import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Download, Github, Linkedin, Mail, Phone, Send } from "lucide-react";
import pcbImg from "@/assets/pcb-wide.webp.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { profile } from "@/data/portfolio";
import { Reveal } from "./Reveal";

export function Contact() {
  const [copied, setCopied] = useState<"idle" | "copied" | "shown">("idle");

  const copyPhone = async () => {
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
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").slice(0, 100);
    const subject = String(fd.get("subject") ?? "").slice(0, 150);
    const message = String(fd.get("message") ?? "").slice(0, 2000);
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      `${subject} (from ${name})`,
    )}&body=${encodeURIComponent(message)}`;
  };

  const links = [
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: Linkedin, label: "LinkedIn", value: "pavithran-ub", href: profile.linkedin },
    { icon: Github, label: "GitHub", value: "pavithranub", href: profile.github },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate overflow-hidden py-28 sm:py-36"
    >
      <img
        src={pcbImg.url}
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-20"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/85 to-background" />

      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow mb-4 flex items-center gap-3">
            <span className="text-primary">07</span>
            <span className="h-px w-10 bg-border" />
            Contact
          </p>
          <h2
            id="contact-heading"
            className="font-display text-5xl leading-[1] text-foreground sm:text-6xl md:text-7xl"
          >
            Let's build
            <br />
            <em className="text-gradient-signal">something real.</em>
          </h2>
          <p className="mt-6 max-w-md text-muted-foreground">
            Open to embedded firmware and IoT roles. The fastest way to reach me is email.
          </p>

          <div className="mt-10 space-y-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card/70 p-4 backdrop-blur transition-all hover:border-primary/50 hover:bg-card"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <l.icon className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="eyebrow block text-[0.6rem]">{l.label}</span>
                  <span className="text-sm text-foreground">{l.value}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </a>
            ))}
            <button
              onClick={copyPhone}
              aria-label="Copy phone number to clipboard"
              className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-card/70 p-4 text-left backdrop-blur transition-all hover:border-primary/50 hover:bg-card"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {copied === "copied" ? <Check className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
              </span>
              <span className="flex-1">
                <span className="eyebrow block text-[0.6rem]">Phone</span>
                <span className="text-sm text-foreground">
                  {copied === "copied"
                    ? "Copied to clipboard"
                    : copied === "shown"
                      ? profile.phoneDisplay
                      : "Click to copy number"}
                </span>
              </span>
            </button>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <form
            onSubmit={onSubmit}
            aria-label="Send email to Pavithran"
            className="rounded-[2rem] border border-border bg-card/90 p-7 shadow-card backdrop-blur sm:p-9"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Send a message</h3>
              <span className="font-mono text-[0.65rem] text-muted-foreground">via your email app</span>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="cf-name">Your name</Label>
                <Input
                  id="cf-name"
                  name="name"
                  required
                  maxLength={100}
                  autoComplete="name"
                  placeholder="Jane Smith"
                  className="h-12 rounded-xl bg-mask-deep/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cf-subject">Subject</Label>
                <Input
                  id="cf-subject"
                  name="subject"
                  required
                  maxLength={150}
                  placeholder="Embedded role — opportunity"
                  className="h-12 rounded-xl bg-mask-deep/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cf-message">Message</Label>
                <Textarea
                  id="cf-message"
                  name="message"
                  required
                  maxLength={2000}
                  rows={5}
                  placeholder="Hi Pavithran, I'd like to discuss…"
                  className="rounded-xl bg-mask-deep/60"
                />
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" variant="signal" size="lg" className="flex-1">
                  <Send /> Open email app
                </Button>
                <Button asChild variant="gold" size="lg">
                  <a href={profile.resume} download aria-label="Download resume (Word document)">
                    <Download /> Resume
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
