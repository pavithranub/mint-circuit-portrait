/* scope.js – Live oscilloscope strip in the nav */
export function initScope(canvasId = 'scope-canvas') {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // HiDPI
  const W = canvas.offsetWidth || 120;
  const H = canvas.offsetHeight || 36;
  canvas.width  = W * devicePixelRatio;
  canvas.height = H * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);

  let phase = 0;
  let scrollVel = 0;
  let lastScroll = 0;
  let raf;
  let paused = false;

  const obs = new IntersectionObserver(([e]) => { paused = !e.isIntersecting; });
  obs.observe(canvas);

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    scrollVel = Math.abs(y - lastScroll);
    lastScroll = y;
  }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = '#6fe3c1';
    ctx.lineWidth   = 1.5;
    ctx.shadowBlur  = 6;
    ctx.shadowColor = '#6fe3c1';
    ctx.beginPath();

    const mid = H / 2;
    const amp = H * 0.35;

    for (let x = 0; x < W; x++) {
      const t = (x / W) * Math.PI * 4 + phase;
      let y;

      if (scrollVel > 12) {
        // PWM – fast scroll
        const duty = 0.25;
        const period = Math.PI;
        y = mid - ((t % period < period * duty) ? amp : -amp);
      } else if (scrollVel > 3) {
        // Square wave – scrolling
        y = mid - (Math.sin(t) > 0 ? amp : -amp);
      } else {
        // Sine – at rest
        y = mid - Math.sin(t) * amp;
      }

      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    if (!paused) phase += 0.07;
    scrollVel *= 0.85;
    raf = requestAnimationFrame(draw);
  }

  draw();
  return () => { cancelAnimationFrame(raf); obs.disconnect(); };
}
