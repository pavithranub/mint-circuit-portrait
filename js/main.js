/* main.js – orchestrator: reveals, rail packet, hero parallax, project modal, probe cursor */
import { initBoot }        from './boot.js';
import { initScope }       from './scope.js';
import { initHero3D }      from './hero3d.js';
import { initControllers } from './controllers.js';
import { initFotaSim }     from './fota-sim.js';
import { initTerminal }    from './terminal.js';

// ── Boot preloader ──────────────────────────────────────────
initBoot();

document.addEventListener('DOMContentLoaded', () => {

  // ── Oscilloscope ──────────────────────────────────────────
  initScope('scope-canvas');

  // ── Hero 3D (lazy) ────────────────────────────────────────
  initHero3D();

  // ── Controllers bench ─────────────────────────────────────
  initControllers();

  // ── FOTA simulator ────────────────────────────────────────
  initFotaSim();

  // ── Serial terminal ───────────────────────────────────────
  initTerminal();

  // ── Reveal on scroll (IntersectionObserver) ───────────────
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  reveals.forEach(el => revealObs.observe(el));

  // ── Section status chips ──────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const statusObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const chip = e.target.querySelector('.status-chip');
      if (chip) chip.style.opacity = e.isIntersecting ? '1' : '0.4';
    });
  }, { threshold: 0.15 });
  sections.forEach(s => statusObs.observe(s));

  // ── Scroll rail data packet ───────────────────────────────
  const packet = document.querySelector('.rail-packet');
  if (packet && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      packet.style.top = `${pct * 100}%`;
    }, { passive: true });
  }

  // ── Hero parallax / mouse tilt (image fallback) ───────────
  const heroImg = document.getElementById('hero-board-img');
  if (heroImg && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      heroImg.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
  }

  // ── SVG trace animation ───────────────────────────────────
  const traces = document.querySelectorAll('.trace-path');
  traces.forEach((t, i) => {
    const len = t.getTotalLength?.() || 300;
    t.style.strokeDasharray  = len;
    t.style.strokeDashoffset = len;
    t.style.transition = `stroke-dashoffset 1.2s ${i * 0.2}s var(--ease-out)`;
    setTimeout(() => { t.style.strokeDashoffset = '0'; }, 400 + i * 200);
  });

  // ── Project modal ─────────────────────────────────────────
  const modal      = document.getElementById('project-modal');
  const modalClose = document.querySelector('.modal-close');
  const cards      = document.querySelectorAll('.project-card');
  let lastFocused;

  const projects = [
    {
      img:     'assets/proj-fota.webp',
      imgAlt:  'STM32 board connected to an ESP32 module with a wireless signal',
      tag:     'FIRMWARE / OTA',
      title:   'FOTA System with STM32',
      problem: 'Field devices running STM32 needed firmware updates without physical access.',
      hardware:'STM32 (target), ESP32 (wireless updater), UART bus',
      firmware:'Custom STM32 bootloader; ESP32 fetches binary over Wi-Fi and pushes packets via UART at 115200 baud; CRC32 integrity check before application jump.',
      outcome: 'Reliable OTA update pipeline. [PLACEHOLDER: owner to add deployment count or uptime metric]',
    },
    {
      img:     'assets/proj-star.webp',
      imgAlt:  'Central hub connected to six sensor nodes with a data dashboard',
      tag:     'NETWORK / IOT',
      title:   'Star Topology Embedded System',
      problem: 'Centralized real-time monitoring of multiple sensor nodes with web visibility.',
      hardware:'Central hub controller, 6 sensor nodes, Wi-Fi module',
      firmware:'Star topology network; nodes report to hub; hub pushes to web dashboard for live monitoring and control.',
      outcome: '[PLACEHOLDER: owner to add result/metric]',
    },
    {
      img:     'assets/proj-water.webp',
      imgAlt:  'Water tank with level probes, a controller box and a pump',
      tag:     'EMBEDDED / PRODUCT',
      title:   'Water Level Controller',
      problem: 'Automate water pump control and protect motor from dry-run damage.',
      hardware:'PIC and Nuvoton microcontrollers, level probes, relay, motor driver',
      firmware:'Embedded C; dual-threshold control; dry-run timer protection; deployed as commercial product at Xpert Automatix.',
      outcome: 'Installed in customer sites. [PLACEHOLDER: owner to add quantity]',
    },
    {
      img:     'assets/proj-vehicle.webp',
      imgAlt:  'Car with an IoT module, signal rings, a lock and a phone alert',
      tag:     'IOT / SECURITY',
      title:   'Vehicle Theft Detection',
      problem: 'Detect unauthorised vehicle movement and alert owner in real time.',
      hardware:'IoT module, GPS, vibration sensor, GSM modem',
      firmware:'Interrupt-driven detection; GSM SMS + call alert; remote engine locking via SMS command.',
      outcome: '[PLACEHOLDER: owner to add result]',
    },
    {
      img:     'assets/proj-smarthome.webp',
      imgAlt:  'Smart bed and smart toilet linked by wireless signals',
      tag:     'IOT / SMART HOME',
      title:   'Smart Home Integration',
      problem: 'Automate smart bed and smart toilet with IoT connectivity.',
      hardware:'ESP32/ESP8266, relay board, actuators',
      firmware:'Embedded integration; app-controlled via web dashboard; BLE + Wi-Fi connectivity.',
      outcome: '[PLACEHOLDER: owner to add result]',
    },
    {
      img:     'assets/proj-weather.webp',
      imgAlt:  'Weather station with sensors and a floating data chart',
      tag:     'IOT / MONITORING',
      title:   'Weather Monitoring System',
      problem: 'Collect real-time weather data and present forecasts on a dashboard.',
      hardware:'ESP32, temperature/humidity/pressure sensors',
      firmware:'IoT data pipeline; sensor readings posted to web dashboard; trend visualisation.',
      outcome: '[PLACEHOLDER: owner to add result]',
    },
  ];

  function openModal(idx) {
    const p = projects[idx];
    document.getElementById('modal-img').src       = p.img;
    document.getElementById('modal-img').alt       = p.imgAlt;
    document.getElementById('modal-tag').textContent   = p.tag;
    document.getElementById('modal-title').textContent = p.title;
    document.getElementById('modal-problem').textContent  = p.problem;
    document.getElementById('modal-hardware').textContent = p.hardware;
    document.getElementById('modal-firmware').textContent = p.firmware;
    document.getElementById('modal-outcome').textContent  = p.outcome;
    modal.classList.add('open');
    modal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => modalClose?.focus(), 50);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocused?.focus();
  }

  cards.forEach((card, i) => {
    card.addEventListener('click', () => { lastFocused = card; openModal(i); });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lastFocused = card; openModal(i); }
    });
    card.querySelector('.card-open-btn')?.addEventListener('click', ev => {
      ev.stopPropagation(); lastFocused = card; openModal(i);
    });
  });

  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal(); });

  // Focus trap inside modal
  modal?.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = [...modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')];
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  });

  // ── Copy phone number ─────────────────────────────────────
  const copyPhoneBtn = document.getElementById('copy-phone-btn');
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('+919629595672');
        copyPhoneBtn.textContent = 'Copied!';
        setTimeout(() => { copyPhoneBtn.textContent = 'Copy number'; }, 2000);
      } catch {
        copyPhoneBtn.textContent = '+91 96295 95672';
      }
    });
  }

  // ── Contact form → mailto ─────────────────────────────────
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form.querySelector('#cf-name').value;
    const subject = form.querySelector('#cf-subject').value;
    const message = form.querySelector('#cf-message').value;
    window.location.href = `mailto:pavithranub2001@gmail.com?subject=${encodeURIComponent(subject + ' (from ' + name + ')')}&body=${encodeURIComponent(message)}`;
  });

  // ── Probe cursor (desktop only) ───────────────────────────
  const probe    = document.getElementById('probe-cursor');
  const readout  = document.getElementById('probe-readout');
  if (probe && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      probe.style.left = e.clientX + 'px';
      probe.style.top  = e.clientY + 'px';
      if (readout) { readout.style.left = (e.clientX + 18) + 'px'; readout.style.top  = (e.clientY - 6) + 'px'; }
    });

    document.querySelectorAll('a, button, .project-card, .ctrl-tab').forEach(el => {
      el.addEventListener('mouseenter', () => {
        probe.classList.add('active');
        if (readout) {
          readout.style.display = 'block';
          readout.textContent   = el.dataset.probeLabel || el.getAttribute('aria-label') || el.textContent.trim().slice(0, 18);
        }
      });
      el.addEventListener('mouseleave', () => {
        probe.classList.remove('active');
        if (readout) readout.style.display = 'none';
      });
    });
  } else {
    probe?.remove();
    readout?.remove();
  }

});
