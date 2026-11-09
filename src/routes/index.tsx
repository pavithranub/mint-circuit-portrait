import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BootScreen } from "@/components/portfolio/BootScreen";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { Marquee } from "@/components/portfolio/Marquee";
import { About } from "@/components/portfolio/About";
import { Controllers } from "@/components/portfolio/Controllers";
import { Projects } from "@/components/portfolio/Projects";
import { FotaSim } from "@/components/portfolio/FotaSim";
import { Experience } from "@/components/portfolio/Experience";
import { Skills } from "@/components/portfolio/Skills";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { TerminalOverlay } from "@/components/portfolio/TerminalOverlay";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pavithran U B — Embedded Developer | Coimbatore" },
      {
        name: "description",
        content:
          "Pavithran U B is an embedded firmware developer in Coimbatore, specialising in STM32, ESP32, PIC, FOTA, UART and IoT systems.",
      },
      { property: "og:title", content: "Pavithran U B — Embedded Developer" },
      {
        property: "og:description",
        content: "Embedded firmware developer: STM32, ESP32, PIC, FOTA, IoT. Based in Coimbatore, Tamil Nadu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [termOpen, setTermOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA") && target.id !== "term-input";
      if (e.key === "`" && !typing) {
        e.preventDefault();
        setTermOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <BootScreen />
      <Nav onOpenTerminal={() => setTermOpen(true)} />
      <main id="main-content">
        <Hero />
        <Marquee />
        <About />
        <Controllers />
        <Projects />
        <FotaSim />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <TerminalOverlay open={termOpen} onClose={() => setTermOpen(false)} />
    </>
  );
}
