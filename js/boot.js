/* boot.js – UART boot preloader, max 1.8 s, skippable, once per session */
export function initBoot() {
  // Skip if already seen this session or reduced motion preferred
  if (sessionStorage.getItem('booted') || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.getElementById('boot-screen')?.remove();
    return;
  }

  const screen = document.getElementById('boot-screen');
  if (!screen) return;

  const lines = [
    { prefix: '[0x00]', text: 'reset released' },
    { prefix: '[0x01]', text: 'clocks configured  — 72 MHz AHB' },
    { prefix: '[0x02]', text: 'peripherals ready  — UART GPIO SPI' },
    { prefix: '[0x03]', text: 'loading portfolio  — pavithranub.github.io' },
    { prefix: '[0x04]', text: 'system running     ▌' },
  ];

  const container = screen.querySelector('.boot-inner');
  const fill      = screen.querySelector('.boot-bar-fill');
  const skipBtn   = screen.querySelector('.boot-skip');
  let done = false;

  const finish = () => {
    if (done) return;
    done = true;
    sessionStorage.setItem('booted', '1');
    screen.style.opacity = '0';
    screen.style.transition = 'opacity 0.4s';
    setTimeout(() => screen.remove(), 420);
  };

  skipBtn?.addEventListener('click', finish);

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  (async () => {
    for (let i = 0; i < lines.length; i++) {
      const { prefix, text } = lines[i];
      const el = document.createElement('p');
      el.className = 'boot-line';
      el.innerHTML = `<span class="prefix">${prefix}</span>  ${text}`;
      container.appendChild(el);
      await delay(50);
      el.classList.add('show');
      if (fill) fill.style.width = `${((i + 1) / lines.length) * 100}%`;
      await delay(280);
    }
    await delay(200);
    finish();
  })();

  // Safety timeout – never block more than 2.2 s
  setTimeout(finish, 2200);
}
