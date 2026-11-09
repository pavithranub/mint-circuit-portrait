import { useEffect, useRef, useState } from "react";
import { playRelayClick } from "@/lib/sound";

/**
 * Live Digital Storage Oscilloscope (DSO) strip
 * Features multi-channel mode (CH1: Sine, CH2: Digital PWM, CH3: UART packet burst)
 * Reactive to scroll speed and interactive on click.
 */
export function Scope({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [channel, setChannel] = useState<0 | 1 | 2>(0); // 0: Analog Sine, 1: PWM Clock, 2: UART Data Burst

  const chNames = ["CH1 SINE", "CH2 PWM", "CH3 UART"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.offsetWidth || 130;
    const H = canvas.offsetHeight || 34;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    let phase = 0;
    let vel = 0;
    let lastY = window.scrollY;
    let raf = 0;

    const onScroll = () => {
      const y = window.scrollY;
      vel = Math.min(Math.abs(y - lastY), 30);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const draw = () => {
      // CRT phosphor decay trail
      ctx.fillStyle = "rgba(11, 29, 26, 0.35)";
      ctx.fillRect(0, 0, W, H);

      // Subtle graticule grid lines
      ctx.strokeStyle = "rgba(31, 74, 65, 0.3)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, H / 2);
      ctx.lineTo(W, H / 2);
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();

      // Main trace
      const signalColor = channel === 1 ? "#d6b266" : channel === 2 ? "#38bdf8" : "#6fe3c1";
      ctx.strokeStyle = signalColor;
      ctx.lineWidth = 1.6;
      ctx.shadowBlur = 8;
      ctx.shadowColor = signalColor;
      ctx.beginPath();

      const mid = H / 2;
      const amp = H * 0.35;

      for (let x = 0; x < W; x++) {
        const t = (x / W) * Math.PI * 4 + phase;
        let y = mid;

        if (channel === 0) {
          // Analog Sine + Scroll modulation
          if (vel > 15) {
            y = mid - (t % (Math.PI * 0.8) < Math.PI * 0.4 ? amp : -amp);
          } else if (vel > 4) {
            y = mid - (Math.sin(t) > 0 ? amp * 0.85 : -amp * 0.85);
          } else {
            y = mid - Math.sin(t) * amp;
          }
        } else if (channel === 1) {
          // Digital PWM clock
          const duty = 0.35 + Math.sin(phase * 0.5) * 0.25;
          const cycle = (t % (Math.PI * 2)) / (Math.PI * 2);
          y = cycle < duty ? mid - amp * 0.9 : mid + amp * 0.9;
        } else {
          // UART frame packet burst (Start bit, 8 bits, Stop bit)
          const bitIndex = Math.floor((t + phase) * 2) % 10;
          const bitVal = (0b10100110 >> bitIndex) & 1;
          y = bitVal ? mid - amp * 0.85 : mid + amp * 0.85;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += 0.08 + (vel * 0.01);
      vel *= 0.92;
      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [channel]);

  const cycleChannel = () => {
    playRelayClick();
    setChannel((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
  };

  return (
    <div
      onClick={cycleChannel}
      title={`Live Scope — Click to switch: ${chNames[channel]}`}
      className={`relative group overflow-hidden ${className || ""}`}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="w-full h-full block" />
      <span className="absolute top-0.5 right-2 font-mono text-[0.55rem] tracking-wider text-muted-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {chNames[channel]}
      </span>
    </div>
  );
}
