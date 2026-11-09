import { useRef, useState } from "react";
import { Cpu, Play, RotateCcw, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "./Reveal";

type LogLine = { text: string; kind: "inf" | "ok" };

export function FotaSim() {
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<LogLine[]>([]);
  const [esp, setEsp] = useState("idle");
  const [stm, setStm] = useState("idle");
  const [running, setRunning] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [done, setDone] = useState(false);
  const runId = useRef(0);
  const logRef = useRef<HTMLDivElement | null>(null);

  const push = (text: string, kind: LogLine["kind"] = "inf") => {
    setLog((l) => [...l, { text, kind }]);
    requestAnimationFrame(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    });
  };

  const reset = () => {
    runId.current++;
    setProgress(0);
    setLog([]);
    setEsp("idle");
    setStm("idle");
    setRunning(false);
    setTransferring(false);
    setDone(false);
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
      push("[SIMULATION] FOTA sequence initiated");
      push("ESP32  → connecting to firmware server…");
      setEsp("fetching firmware");
      await wait(800);
      push("ESP32  ✓ firmware v2.1.0 downloaded (48 KB)", "ok");
      setProgress(10);
      push("ESP32  → entering bootloader mode on STM32…");
      await wait(600);
      push("STM32  ← BOOT0 high, reset released", "ok");
      setStm("bootloader active");
      setProgress(18);
      push("UART   → 115200 baud, 8N1");
      await wait(400);
      push("STM32  ← ACK 0x79 (bootloader ready)", "ok");
      setProgress(22);
      setEsp("streaming");
      setTransferring(true);
      const total = 16;
      for (let i = 1; i <= total; i++) {
        await wait(260);
        setProgress(Math.round(22 + (i / total) * 60));
        const a = ((i - 1) * 3072).toString(16).padStart(5, "0");
        const b = (i * 3072 - 1).toString(16).padStart(5, "0");
        push(`PKT ${String(i).padStart(2, "0")} → 0x${a}–0x${b}`);
      }
      setTransferring(false);
      push("CRC32  → checking firmware integrity…");
      await wait(700);
      push("CRC32  ✓ 0xA3F8C21D PASS", "ok");
      setProgress(90);
      push("STM32  → jumping to application…");
      await wait(600);
      setStm("app running v2.1.0");
      setEsp("done");
      push("STM32  ✓ application started", "ok");
      setProgress(100);
      push("[SIMULATION] FOTA complete — LED ON ✓", "ok");
      setDone(true);
    } catch {
      /* cancelled by reset */
    } finally {
      if (id === runId.current) setRunning(false);
    }
  };

  return (
    <section
      id="fota-sim"
      aria-labelledby="fota-heading"
      className="relative border-y border-border bg-mask-deep/60 py-28 sm:py-36"
    >
      <div className="absolute inset-0 bg-pcb-grid opacity-25" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            index="04"
            label="Interactive"
            className="mb-0"
            title={
              <span id="fota-heading">
                Push firmware <em className="text-gradient-signal">over the air.</em>
              </span>
            }
          />
          <span className="mb-2 rounded-full border border-warn/40 bg-warn/10 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-warn">
            Simulation — not real hardware
          </span>
        </div>

        <Reveal className="mt-14 overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
            <div className="p-7 sm:p-10">
              <div className="flex items-center gap-4">
                <Device icon={<Wifi className="h-6 w-6" />} name="ESP32" status={esp} active={running} />
                <div className="relative h-14 flex-1">
                  <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
                  <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-primary/40" />
                  {transferring &&
                    [0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="absolute top-1/2 -translate-y-1/2 animate-packet rounded bg-primary px-1.5 py-0.5 font-mono text-[0.55rem] font-bold text-primary-foreground shadow-glow"
                        style={{ animationDelay: `${i * 0.3}s` }}
                      >
                        PKT
                      </span>
                    ))}
                  <span className="absolute inset-x-0 -bottom-1 text-center font-mono text-[0.62rem] text-muted-foreground">
                    UART · 115200 baud
                  </span>
                </div>
                <Device
                  icon={<Cpu className="h-6 w-6" />}
                  name="STM32"
                  status={stm}
                  active={running}
                  led={done}
                />
              </div>

              <div className="mt-10">
                <div className="mb-2 flex justify-between font-mono text-xs text-muted-foreground">
                  <span>Firmware transfer</span>
                  <span className="text-foreground">{progress}%</span>
                </div>
                <div
                  className="h-2.5 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-label="FOTA progress"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-gold transition-[width] duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="signal" size="lg" onClick={start} disabled={running}>
                  <Play /> {running ? "Flashing…" : "Start FOTA"}
                </Button>
                <Button variant="trace" size="lg" onClick={reset}>
                  <RotateCcw /> Reset
                </Button>
              </div>
            </div>

            <div className="border-t border-border bg-mask-deep lg:border-l lg:border-t-0">
              <div className="flex items-center gap-2 border-b border-border px-5 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-primary/80" />
                <span className="ml-2 font-mono text-[0.68rem] text-muted-foreground">
                  /dev/ttyUSB0
                </span>
              </div>
              <div
                ref={logRef}
                role="log"
                aria-live="polite"
                aria-label="FOTA log output"
                className="h-72 overflow-y-auto p-5 font-mono text-xs leading-6 lg:h-[22rem]"
              >
                {log.length === 0 ? (
                  <p className="text-muted-foreground">
                    $ waiting for start<span className="ml-1 inline-block h-3 w-1.5 animate-blink bg-primary align-middle" />
                  </p>
                ) : (
                  log.map((l, i) => (
                    <p key={i} className={l.kind === "ok" ? "text-primary" : "text-muted-foreground"}>
                      <span className="text-gold/80">$</span> {l.text}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Device({
  icon,
  name,
  status,
  active,
  led,
}: {
  icon: React.ReactNode;
  name: string;
  status: string;
  active: boolean;
  led?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative w-28 shrink-0 rounded-2xl border bg-mask-deep/60 p-4 text-center transition-all sm:w-36",
        active || led ? "border-primary/50 shadow-glow" : "border-border",
      )}
    >
      {led !== undefined && (
        <span
          className={cn(
            "absolute right-3 top-3 h-2.5 w-2.5 rounded-full transition-all",
            led ? "bg-primary shadow-glow" : "bg-muted",
          )}
        />
      )}
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="mt-3 font-mono text-sm font-semibold text-foreground">{name}</p>
      <p className="mt-1 truncate font-mono text-[0.65rem] text-muted-foreground">{status}</p>
    </div>
  );
}
