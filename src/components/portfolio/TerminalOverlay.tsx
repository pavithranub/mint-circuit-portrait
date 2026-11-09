import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Line = { cls: "info" | "ok" | "err" | "cmd"; text: string };

const commands: Record<string, () => Line[]> = {
  help: () => [
    { cls: "info", text: "Available commands:" },
    { cls: "ok", text: "  projects  — list all projects" },
    { cls: "ok", text: "  skills    — list skills & tools" },
    { cls: "ok", text: "  contact   — contact information" },
    { cls: "ok", text: "  fota      — about FOTA project" },
    { cls: "ok", text: "  about     — about Pavithran" },
    { cls: "ok", text: "  clear     — clear terminal" },
    { cls: "ok", text: "  close     — close terminal" },
  ],
  projects: () => [
    { cls: "info", text: "Projects (6 total):" },
    { cls: "ok", text: "  [1] FOTA System — STM32 + ESP32 UART update" },
    { cls: "ok", text: "  [2] Star Topology — centralised data + web dashboard" },
    { cls: "ok", text: "  [3] Water Level Controller — PIC + Nuvoton, dry-run protection" },
    { cls: "ok", text: "  [4] Vehicle Theft Detection — IoT, real-time alerts" },
    { cls: "ok", text: "  [5] Smart Home — bed + toilet IoT integration" },
    { cls: "ok", text: "  [6] Weather Monitor — IoT sensors + web dashboard" },
  ],
  skills: () => [
    { cls: "info", text: "Languages: Embedded C, C, C++, Python, SQL, HTML, CSS" },
    { cls: "info", text: "MCUs: STM32, PIC, ESP32, ESP8266, Arduino, Nuvoton, MSP430, CC3200" },
    { cls: "info", text: "Tools: STM32Cube IDE, Keil, MPLAB X, KiCad, Proteus" },
    { cls: "info", text: "Protocols: UART, I2C, SPI, USB, GSM, BLE, RS232" },
    { cls: "info", text: "Certs: ARM Microcontrollers, PIC Microcontroller, DBMS (NPTEL)" },
  ],
  contact: () => [
    { cls: "ok", text: "  Email:    pavithranub2001@gmail.com" },
    { cls: "ok", text: "  LinkedIn: linkedin.com/in/pavithran-ub" },
    { cls: "ok", text: "  GitHub:   github.com/pavithranub" },
  ],
  fota: () => [
    { cls: "info", text: "FOTA System: Firmware Over-The-Air update" },
    { cls: "ok", text: "  Host MCU:   STM32 (target firmware)" },
    { cls: "ok", text: "  Updater:    ESP32 (wireless firmware fetch)" },
    { cls: "ok", text: "  Channel:    UART at 115200 baud, 8N1" },
    { cls: "ok", text: "  Bootloader: custom STM32 bootloader" },
    { cls: "ok", text: "  Integrity:  CRC32 verification" },
  ],
  about: () => [
    { cls: "info", text: "Pavithran U B — Embedded Developer" },
    { cls: "ok", text: "  Coimbatore, Tamil Nadu" },
    { cls: "ok", text: "  MSc Electronics & Communication Systems" },
    { cls: "ok", text: "  PSG Arts & Science College, 2022–2024" },
  ],
};

const intro: Line[] = [
  { cls: "info", text: "Pavithran UB Serial Console v2.0" },
  { cls: "ok", text: 'Type "help" for commands.' },
];

export function TerminalOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [lines, setLines] = useState<Line[]>(intro);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const outRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const echo: Line = { cls: "cmd", text: `> ${raw}` };
    if (cmd === "clear") return setLines([]);
    if (cmd === "close") {
      setLines((l) => [...l, echo]);
      return onClose();
    }
    if (!cmd) return setLines((l) => [...l, echo]);
    const fn = commands[cmd];
    setLines((l) => [
      ...l,
      echo,
      ...(fn ? fn() : [{ cls: "err" as const, text: `Command not found: "${cmd}". Type "help".` }]),
    ]);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(value);
      setHistory((h) => [value, ...h]);
      setHistIdx(-1);
      setValue("");
    } else if (e.key === "ArrowUp") {
      const i = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(i);
      setValue(history[i] ?? "");
    } else if (e.key === "ArrowDown") {
      const i = Math.max(histIdx - 1, -1);
      setHistIdx(i);
      setValue(i === -1 ? "" : history[i]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-mask-deep/70 p-3 backdrop-blur-sm animate-in fade-in sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="term-title"
        onClick={(e) => e.stopPropagation()}
        className="flex h-[70vh] w-full max-w-2xl animate-in slide-in-from-bottom-4 flex-col overflow-hidden rounded-3xl border border-primary/30 bg-mask-deep font-mono shadow-glow"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary/80" />
            <span id="term-title" className="ml-2 text-[0.7rem] text-muted-foreground">
              UART_CONSOLE — /dev/pavithranub · 115200
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close terminal"
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div ref={outRef} aria-live="polite" className="flex-1 overflow-y-auto p-5 text-sm leading-6">
          {lines.map((l, i) => (
            <div
              key={i}
              className={cn(
                "whitespace-pre-wrap",
                l.cls === "info" && "text-gold",
                l.cls === "ok" && "text-primary",
                l.cls === "err" && "text-destructive",
                l.cls === "cmd" && "text-foreground",
              )}
            >
              {l.text}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 border-t border-border px-5 py-3">
          <span className="text-primary">$&gt;</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal command input"
            placeholder="type help …"
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
    </div>
  );
}
