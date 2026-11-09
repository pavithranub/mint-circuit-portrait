import { useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Cpu, Play, RotateCcw, Wifi, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "./Reveal";
import { playErrorTone, playKeyClick, playRelayClick, playSuccessChime } from "@/lib/sound";

type LogLine = { text: string; kind: "inf" | "ok" | "err" | "warn" };

export function FotaSim() {
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<LogLine[]>([]);
  const [espState, setEspState] = useState<"IDLE" | "WIFI_FETCH" | "UART_STREAM" | "DONE">("IDLE");
  const [stmState, setStmState] = useState<"IDLE" | "BOOT_ACTIVE" | "FLASH_WRITE" | "VERIFY" | "APP_RUN" | "ABORT">("IDLE");
  const [running, setRunning] = useState(false);
  const [corruptInject, setCorruptInject] = useState(false);
  const [done, setDone] = useState(false);
  const [sectors, setSectors] = useState<("empty" | "writing" | "done" | "err")[]>(Array(16).fill("empty"));

  const runId = useRef(0);
  const logRef = useRef<HTMLDivElement | null>(null);

  const push = (text: string, kind: LogLine["kind"] = "inf") => {
    setLog((l) => [...l, { text, kind }]);
    requestAnimationFrame(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    });
  };

  const reset = () => {
    playRelayClick();
    runId.current++;
    setProgress(0);
    setLog([]);
    setEspState("IDLE");
    setStmState("IDLE");
    setRunning(false);
    setDone(false);
    setSectors(Array(16).fill("empty"));
  };

  const start = async () => {
    reset();
    const id = ++runId.current;
    const wait = (ms: number) =>
      new Promise<void>((res, rej) =>
        setTimeout(() => (id === runId.current ? res() : rej(new Error("cancelled"))), ms),
      );

    setRunning(true);
    try {
      push("[SIMULATION] Initiating FOTA UART Sequence — Target: STM32F103");
      push("ESP32  → Connecting to remote firmware endpoint over TLS…");
      setEspState("WIFI_FETCH");
      await wait(700);

      push("ESP32  ✓ Firmware image 'firmware_v2.1.bin' downloaded (48 KB)", "ok");
      playKeyClick();
      setProgress(12);

      push("ESP32  → Pulling BOOT0 HIGH & triggering hardware reset…");
      await wait(500);
      push("STM32  ← BOOT0 sampled high, custom bootloader invoked at 0x08000000", "ok");
      setStmState("BOOT_ACTIVE");
      setProgress(20);

      push("UART   → Baud handshake at 115200 8N1…");
      await wait(400);
      push("STM32  ← ACK 0x79 (Bootloader initialized & memory unlocked)", "ok");
      playKeyClick();
      setProgress(25);

      setEspState("UART_STREAM");
      setStmState("FLASH_WRITE");

      const totalPackets = 16;
      for (let i = 1; i <= totalPackets; i++) {
        await wait(220);
        const currentPct = Math.round(25 + (i / totalPackets) * 55);
        setProgress(currentPct);

        setSectors((prev) => {
          const next = [...prev];
          next[i - 1] = "writing";
          return next;
        });

        const offsetStart = ((i - 1) * 3072).toString(16).padStart(5, "0");
        const offsetEnd = (i * 3072 - 1).toString(16).padStart(5, "0");

        if (corruptInject && i === 11) {
          push(`PKT ${String(i).padStart(2, "0")} → Corrupted bit intentional injection at 0x${offsetStart}`, "warn");
        } else {
          push(`PKT ${String(i).padStart(2, "0")} → Write 3072B @ 0x${offsetStart}..0x${offsetEnd} (ACK 0x79)`);
        }
        playKeyClick();

        setSectors((prev) => {
          const next = [...prev];
          next[i - 1] = "done";
          return next;
        });
      }

      setEspState("DONE");
      setStmState("VERIFY");
      push("CRC32  → Computing hardware polynomial checksum across all sectors…");
      await wait(600);

      if (corruptInject) {
        push("CRC32  ✗ 0xDEADBEEF — Checksum mismatch on block 11!", "err");
        playErrorTone();
        setStmState("ABORT");
        push("STM32  ⚠ Rollback triggered! Application jump refused. System safe.", "err");
        setSectors((prev) => prev.map((s, idx) => (idx === 10 ? "err" : s)));
        return;
      }

      push("CRC32  ✓ Expected: 0xA3F8C21D | Calculated: 0xA3F8C21D [PASS]", "ok");
      setProgress(92);
      await wait(500);

      push("STM32  → Relocating Vector Table to 0x08004000…");
      await wait(400);
      push("STM32  → Resetting BOOT0 & Jumping to User Application entry point…");
      setStmState("APP_RUN");
      setProgress(100);
      setDone(true);
      playSuccessChime();
      push("[SIMULATION COMPLETE] Target Application Running v2.1 — PC13 LED Solid ON ✓", "ok");
    } catch {
      // Cancelled by reset
    } finally {
      if (id === runId.current) setRunning(false);
    }
  };

  return (
    <section
      id="fota-sim"
      aria-labelledby="fota-heading"
      className="relative border-y border-border/80 bg-mask-deep/80 py-24 sm:py-32"
    >
      <div className="absolute inset-0 bg-pcb-grid opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border/60 pb-8">
          <div>
            <SectionHeading
              index="04"
              label="Signature Architecture Simulation"
              className="mb-0"
              title={<span id="fota-heading">Live FOTA Pipeline Simulation.</span>}
            />
            <p className="mt-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">
              ESP32 Wireless Receiver ⟷ UART 115200 ⟷ STM32 Custom Bootloader
            </p>
          </div>

          {/* Simulation Interactive Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                playRelayClick();
                setCorruptInject((v) => !v);
              }}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
                corruptInject
                  ? "border-destructive text-destructive bg-destructive/10"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{corruptInject ? "CRC Corrupt: ACTIVE" : "Test CRC Fault"}</span>
            </button>

            <Button
              onClick={start}
              disabled={running}
              variant="signal"
              size="sm"
              className="font-mono text-xs uppercase tracking-wider"
            >
              <Play className="mr-1 h-3.5 w-3.5" /> Run Simulation
            </Button>
            <Button
              onClick={reset}
              variant="trace"
              size="sm"
              className="font-mono text-xs uppercase"
            >
              <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset
            </Button>
          </div>
        </div>

        {/* Hardware Status & Flow Diagram */}
        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          {/* Top Architecture Nodes (ESP32 <--> STM32) */}
          <div className="lg:col-span-12 rounded-3xl border border-border/80 bg-card/90 p-6 shadow-card backdrop-blur">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Node 1: ESP32 Transmitter */}
              <div className="rounded-2xl border border-border/80 bg-mask-deep/80 p-5 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary flex items-center gap-2">
                    <Wifi className="h-4 w-4" /> ESP32-WROOM
                  </span>
                  <span className="rounded bg-muted px-2 py-0.5 text-[0.65rem] text-muted-foreground">
                    STAGE 1: OTA RECEIVER
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={cn(
                    "font-bold",
                    espState === "WIFI_FETCH" ? "text-primary animate-pulse" :
                    espState === "UART_STREAM" ? "text-gold animate-pulse" :
                    espState === "DONE" ? "text-primary" : "text-muted-foreground"
                  )}>
                    {espState}
                  </span>
                </div>
                <div className="mt-2 text-[0.65rem] text-muted-foreground">
                  Wi-Fi 802.11 b/g/n · TLS Stream · 48KB Image
                </div>
              </div>

              {/* Wire Bridge with Animated Travelling Pulses */}
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <span className="font-mono text-[0.68rem] text-gold uppercase tracking-wider mb-2">
                  UART 115200 8N1 SERIAL BUS
                </span>
                <div className="relative w-full h-3 bg-mask-deep rounded-full border border-border/80 overflow-hidden flex items-center">
                  <div className="absolute inset-0 bg-primary/10" />
                  {running && (
                    <div className="h-2 w-8 rounded-full bg-primary shadow-glow animate-packet" />
                  )}
                </div>
                <span className="font-mono text-[0.62rem] text-muted-foreground mt-2">
                  TX: GPIO17 ⟷ RX: PA10 | ACK 0x79 Protocol
                </span>
              </div>

              {/* Node 2: STM32 Target Receiver */}
              <div className="rounded-2xl border border-border/80 bg-mask-deep/80 p-5 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gold flex items-center gap-2">
                    <Cpu className="h-4 w-4" /> STM32F103 (TARGET)
                  </span>
                  <span className="rounded bg-muted px-2 py-0.5 text-[0.65rem] text-muted-foreground">
                    STAGE 2: BOOTLOADER
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">State:</span>
                  <span className={cn(
                    "font-bold",
                    stmState === "FLASH_WRITE" ? "text-gold animate-pulse" :
                    stmState === "APP_RUN" ? "text-primary" :
                    stmState === "ABORT" ? "text-destructive font-bold" : "text-muted-foreground"
                  )}>
                    {stmState}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[0.68rem]">
                  <span className="text-muted-foreground">PC13 USER LED:</span>
                  <span className={cn(
                    "flex items-center gap-1 font-bold",
                    done ? "text-primary" : "text-muted-foreground"
                  )}>
                    <span className={cn("h-2 w-2 rounded-full", done ? "bg-primary shadow-glow" : "bg-muted")} />
                    {done ? "ACTIVE ON" : "OFF"}
                  </span>
                </div>
              </div>
            </div>

            {/* Flash Memory Map Grid (16 Sectors) */}
            <div className="mt-6 pt-5 border-t border-border/60">
              <div className="mb-2 flex items-center justify-between font-mono text-xs">
                <span className="text-muted-foreground">STM32 ON-CHIP FLASH SECTOR ALLOCATION (64 KB)</span>
                <span className="text-primary font-bold">{progress}% Written</span>
              </div>
              <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
                {sectors.map((s, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "h-6 rounded border font-mono text-[0.55rem] flex items-center justify-center transition-all",
                      s === "empty" && "border-border/60 bg-muted/20 text-muted-foreground",
                      s === "writing" && "border-gold bg-gold/30 text-gold animate-pulse",
                      s === "done" && "border-primary bg-primary/25 text-primary font-bold",
                      s === "err" && "border-destructive bg-destructive/30 text-destructive font-bold",
                    )}
                    title={`Sector ${idx}: 0x0800${(idx * 4).toString(16).padStart(4, "0")}`}
                  >
                    S{idx}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live UART Telemetry Log Window */}
          <div className="lg:col-span-12">
            <div className="rounded-2xl border border-border/80 bg-mask-deep p-4 font-mono shadow-inner">
              <div className="mb-2 flex items-center justify-between border-b border-border/60 pb-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary shadow-glow" />
                  UART PACKET TELEMETRY MONITOR (115200 BAUD)
                </span>
                <span className="text-[0.65rem] text-gold">AUTO-SCROLL ON</span>
              </div>

              <div
                ref={logRef}
                className="h-44 overflow-y-auto space-y-1 text-xs pr-2 scrollbar-thin"
              >
                {log.length === 0 ? (
                  <p className="text-muted-foreground/60 italic text-center py-10">
                    Press "Run Simulation" above to execute the OTA update sequence...
                  </p>
                ) : (
                  log.map((line, i) => (
                    <div
                      key={i}
                      className={cn(
                        "leading-tight",
                        line.kind === "ok" && "text-primary font-medium",
                        line.kind === "warn" && "text-gold font-medium",
                        line.kind === "err" && "text-destructive font-bold",
                        line.kind === "inf" && "text-muted-foreground",
                      )}
                    >
                      {line.text}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
