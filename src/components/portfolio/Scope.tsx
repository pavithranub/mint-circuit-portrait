import { useEffect, useRef } from "react";

/** Live oscilloscope strip — sine at rest, square while scrolling, PWM when scrolling fast. */
export function Scope({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.offsetWidth || 120;
    const H = canvas.offsetHeight || 32;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const color = getComputedStyle(document.documentElement).getPropertyValue("--signal").trim();
    let phase = 0;
    let vel = 0;
    let last = window.scrollY;
    let raf = 0;

    const onScroll = () => {
      const y = window.scrollY;
      vel = Math.abs(y - last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 6;
      ctx.shadowColor = color;
      ctx.beginPath();
      const mid = H / 2;
      const amp = H * 0.32;
      for (let x = 0; x < W; x++) {
        const t = (x / W) * Math.PI * 4 + phase;
        let y: number;
        if (vel > 12) y = mid - (t % Math.PI < Math.PI * 0.25 ? amp : -amp);
        else if (vel > 3) y = mid - (Math.sin(t) > 0 ? amp : -amp);
        else y = mid - Math.sin(t) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      phase += 0.07;
      vel *= 0.85;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
