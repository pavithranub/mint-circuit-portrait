/* scope.js – Live Digital Storage Oscilloscope (DSO) strip with multi-channel selection */
import { playRelayClick } from './sound.js';

export function initScope(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let W = canvas.offsetWidth || 130;
  let H = canvas.offsetHeight || 32;
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

  let phase = 0;
  let vel = 0;
  let lastY = window.scrollY;
  let rafId = 0;
  let channel = 0; // 0: Analog Sine, 1: PWM Clock, 2: UART Data Burst
  const chNames = ['CH1 SINE', 'CH2 PWM', 'CH3 UART'];

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    vel = Math.min(Math.abs(y - lastY), 30);
    lastY = y;
  }, { passive: true });

  function cycleChannel() {
    playRelayClick();
    channel = (channel + 1) % 3;
    canvas.title = `Live DSO Scope — Current: ${chNames[channel]} (Click to switch)`;
  }
  canvas.addEventListener('click', cycleChannel);
  canvas.style.cursor = 'pointer';

  function draw() {
    // CRT phosphor decay trail
    ctx.fillStyle = 'rgba(11, 29, 26, 0.35)';
    ctx.fillRect(0, 0, W, H);

    // Graticule center line
    ctx.strokeStyle = 'rgba(31, 74, 65, 0.3)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();

    const signalColor = channel === 1 ? '#d6b266' : channel === 2 ? '#38bdf8' : '#6fe3c1';
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
        if (vel > 15) {
          y = mid - (t % (Math.PI * 0.8) < Math.PI * 0.4 ? amp : -amp);
        } else if (vel > 4) {
          y = mid - (Math.sin(t) > 0 ? amp * 0.85 : -amp * 0.85);
        } else {
          y = mid - Math.sin(t) * amp;
        }
      } else if (channel === 1) {
        const duty = 0.35 + Math.sin(phase * 0.5) * 0.25;
        const cycle = (t % (Math.PI * 2)) / (Math.PI * 2);
        y = cycle < duty ? mid - amp * 0.9 : mid + amp * 0.9;
      } else {
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
    rafId = requestAnimationFrame(draw);
  }

  // Handle visibility change to save CPU
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!rafId) rafId = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  });
  observer.observe(canvas);

  draw();
}
