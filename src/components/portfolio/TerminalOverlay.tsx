import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Terminal, X, Minimize2 } from "lucide-react";
import { playKeyClick, playRelayClick } from "@/lib/sound";

type Line = { cls: "info" | "ok" | "err" | "cmd" | "warn"; text: string };

const commandList = [
  "help",
  "projects",
  "skills",
  "contact",
  "fota",
  "about",
  "dmesg",
  "pinout",
  "resume",
  "reboot",
  "clear",
  "close",
];

const commands: Record<string, () => Line[]> = {
  help: () => [
    { cls: "info", text: "Pavithran UB Embedded Shell v2.5 — Available commands:" },
    { cls: "ok", text: "  projects  — list all 6 production builds" },
    { cls: "ok", text: "  skills    — list languages, MCUs, protocols & tools" },
    { cls: "ok", text: "  fota      — inspect FOTA STM32+ESP32 architecture" },
    { cls: "ok", text: "  dmesg     — dump kernel / hardware initialization log" },
    { cls: "ok", text: "  pinout    — display STM32 primary pin mappings" },
    { cls: "ok", text: "  contact   — developer contact points (email, phone, LinkedIn)" },
    { cls: "ok", text: "  resume    — direct link to download Word resume" },
    { cls: "ok", text: "  about     — background, education, and credentials" },
    { cls: "ok", text: "  reboot    — trigger hardware bootloader reset" },
    { cls: "ok", text: "  clear     — clear terminal scrollback" },
    { cls: "ok", text: "  close     — exit console" },
  ],
  projects: () => [
    { cls: "info", text: "=== PRODUCTION & RESEARCH EMBEDDED PROJECTS ===" },
    { cls: "ok", text: "  [1] FOTA System — STM32 + ESP32 UART firmware update with CRC32" },
    { cls: "ok", text: "  [2] Star Topology — 6-node wireless telemetry network + live web dashboard" },
    { cls: "ok", text: "  [3] Water Level Controller — Commercial PIC & Nuvoton system with dry-run safety" },
    { cls: "ok", text: "  [4] Vehicle Theft Detection — GSM/GPS anti-theft with remote engine cut-off" },
    { cls: "ok", text: "  [5] Smart Home Automation — ESP32 BLE + Wi-Fi motorized actuators" },
    { cls: "ok", text: "  [6] Weather Monitoring — Environmental telemetry with BME280 & forecasting" },
  ],
  skills: () => [
    { cls: "info", text: "=== EMBEDDED DEVELOPER TOOLSET ===" },
    { cls: "ok", text: "  Languages:  Embedded C, C, C++, Python, SQL, HTML5, CSS3" },
    { cls: "ok", text: "  MCUs:       STM32 (Cortex-M3/M4), ESP32, PIC16F877A, Nuvoton M051, Arduino" },
    { cls: "ok", text: "  Protocols:  UART, I2C, SPI, BLE 4.2, Wi-Fi, GSM AT, RS232, RS485" },
    { cls: "ok", text: "  Toolchains: STM32Cube IDE, Keil µVision, MPLAB X, KiCad, Proteus" },
    { cls: "ok", text: "  Hardware:   Oscilloscope, Logic Analyzer, DMM, SMD Soldering, PCB Layout" },
  ],
  contact: () => [
    { cls: "info", text: "=== DIRECT CONTACT ===" },
    { cls: "ok", text: "  Email:    pavithranub2001@gmail.com" },
    { cls: "ok", text: "  Phone:    +91 96295 95672" },
    { cls: "ok", text: "  LinkedIn: https://linkedin.com/in/pavithran-ub" },
    { cls: "ok", text: "  GitHub:   https://github.com/pavithranub" },
    { cls: "ok", text: "  Location: Coimbatore, Tamil Nadu, India" },
  ],
  fota: () => [
    { cls: "info", text: "=== FOTA SYSTEM ARCHITECTURE ===" },
    { cls: "ok", text: "  Host MCU:      STM32F103 (Cortex-M3 @ 72MHz)" },
    { cls: "ok", text: "  Bridge Node:   ESP32-WROOM (Wireless TLS Download)" },
    { cls: "ok", text: "  Bus:           Hardware UART @ 115200 Baud, 8N1" },
    { cls: "ok", text: "  Integrity:     CRC-32 Hardware polynomial calculation" },
    { cls: "ok", text: "  Safety:        Dual-bank vector jump; automatic rollback upon mismatch" },
  ],
  about: () => [
    { cls: "info", text: "=== PAVITHRAN U B ===" },
    { cls: "ok", text: "  Role:      Embedded Firmware Developer" },
    { cls: "ok", text: "  Degree:    M.Sc. Electronics & Communication Systems" },
    { cls: "ok", text: "  College:   PSG Arts & Science College, Coimbatore (2022–2024)" },
    { cls: "ok", text: "  Employer:  Xpert Automatix (SolarWinds & MCU Products)" },
  ],
  resume: () => [
    { cls: "info", text: "Resume document location:" },
    { cls: "ok", text: "  https://github.com/pavithranub/porfolio/raw/refs/heads/main/Pavithran%20UB.docx" },
  ],
  dmesg: () => [
    { cls: "info", text: "[0.000000] Linux kernel on ARM Cortex-M3 (booting)" },
    { cls: "ok", text: "[0.000120] CPU: STM32F103 @ 72MHz, Revision r1p1" },
    { cls: "ok", text: "[0.000340] memory: 20KB SRAM, 64KB Flash mapped" },
    { cls: "ok", text: "[0.001200] console [ttyS0] enabled at 115200 8n1" },
    { cls: "ok", text: "[0.002400] spi0: SPI Master controller initialized (18 MHz)" },
    { cls: "ok", text: "[0.003100] i2c0: Fast-mode I2C bus initialized at 400 kHz" },
    { cls: "ok", text: "[0.004200] gpio: 37 IO pins configured" },
    { cls: "warn", text: "[0.005100] wdt: Hardware Independent Watchdog active (1.6s timeout)" },
    { cls: "ok", text: "[0.006200] fota: Flash partition /dev/mtd1 verified CRC32 OK" },
    { cls: "ok", text: "[0.008000] System ready. Welcome to Pavithran UB console." },
  ],
  pinout: () => [
    { cls: "info", text: "=== STM32F103 KEY PINOUT ===" },
    { cls: "ok", text: "  PA9  ── USART1_TX (115200 baud)" },
    { cls: "ok", text: "  PA10 ── USART1_RX (115200 baud)" },
    { cls: "ok", text: "  PA5  ── SPI1_SCK" },
    { cls: "ok", text: "  PB6  ── I2C1_SCL" },
    { cls: "ok", text: "  PB7  ── I2C1_SDA" },
    { cls: "ok", text: "  PC13 ── User Diagnostic LED" },
    { cls: "warn", text: "  BOOT0── HIGH for Bootloader / LOW for Flash App" },
  ],
};

const intro: Line[] = [
  { cls: "info", text: "PAVITHRAN U B — SERIAL SHELL CONSOLE v2.5" },
  { cls: "ok", text: 'Type "help" for a list of available commands, or press [Tab] to auto-complete.' },
];

export function TerminalOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [lines, setLines] = useState<Line[]>(intro);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const outRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  useEffect(() => {
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const echo: Line = { cls: "cmd", text: `pub@stm32:~$ ${raw}` };

    if (cmd === "clear") {
      setLines([]);
      return;
    }
    if (cmd === "close" || cmd === "exit") {
      setLines((l) => [...l, echo]);
      onClose();
      return;
    }
    if (cmd === "reboot") {
      setLines((l) => [...l, echo, { cls: "warn", text: "Rebooting system..." }]);
      sessionStorage.removeItem("pub_booted");
      setTimeout(() => window.location.reload(), 600);
      return;
    }
    if (!cmd) {
      setLines((l) => [...l, echo]);
      return;
    }

    const fn = commands[cmd];
    setLines((l) => [
      ...l,
      echo,
      ...(fn
        ? fn()
        : [
            {
              cls: "err" as const,
              text: `bash: command not found: "${cmd}". Type "help" for list.`,
            },
          ]),
    ]);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    playKeyClick();
    if (e.key === "Enter") {
      run(value);
      if (value.trim()) {
        setHistory((h) => [value, ...h]);
      }
      setHistIdx(-1);
      setValue("");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const current = value.trim().toLowerCase();
      if (!current) return;
      const match = commandList.find((c) => c.startsWith(current));
      if (match) setValue(match);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const i = Math.min(histIdx + 1, history.length - 1);
      if (i >= 0 && history[i]) {
        setHistIdx(i);
        setValue(history[i]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = Math.max(histIdx - 1, -1);
      setHistIdx(i);
      setValue(i === -1 ? "" : history[i] ?? "");
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Serial terminal console"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-mask-deep/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative flex h-[82vh] w-full max-w-3xl flex-col rounded-3xl border border-primary/40 bg-card/95 font-mono shadow-glow overflow-hidden">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between border-b border-border/80 bg-mask-deep px-5 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-destructive/80 cursor-pointer" onClick={onClose} />
              <span className="h-3 w-3 rounded-full bg-gold/80" />
              <span className="h-3 w-3 rounded-full bg-primary/80" />
            </span>
            <span className="ml-2 font-bold text-foreground flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              UART SERIAL TERMINAL — 115200 8N1
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[0.65rem] text-muted-foreground hidden sm:inline">Press ESC to exit</span>
            <button
              onClick={() => {
                playRelayClick();
                onClose();
              }}
              className="rounded-lg p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Console Log Output */}
        <div
          ref={outRef}
          className="flex-1 overflow-y-auto p-5 space-y-1.5 text-xs sm:text-sm scrollbar-thin"
        >
          {lines.map((l, i) => (
            <div
              key={i}
              className={
                l.cls === "cmd"
                  ? "text-primary font-bold pt-1"
                  : l.cls === "ok"
                    ? "text-primary/90"
                    : l.cls === "warn"
                      ? "text-gold"
                      : l.cls === "err"
                        ? "text-destructive font-semibold"
                        : "text-muted-foreground"
              }
            >
              {l.text}
            </div>
          ))}
        </div>

        {/* Terminal Command Input Line */}
        <div className="flex items-center gap-2 border-t border-border/80 bg-mask-deep/90 px-5 py-3.5">
          <span className="text-primary font-bold text-xs sm:text-sm">pub@stm32:~$</span>
          <input
            ref={inputRef}
            id="term-input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            autoComplete="off"
            spellCheck={false}
            placeholder='Type "help" or a command...'
            className="flex-1 bg-transparent font-mono text-xs sm:text-sm text-foreground outline-none placeholder:text-muted-foreground/40"
          />
        </div>
      </div>
    </div>
  );
}
