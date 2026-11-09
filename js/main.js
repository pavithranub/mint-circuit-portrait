/* main.js – orchestrator: reveals, rail packet, hero parallax, project modal, probe cursor, sound & filter */
import { initBoot }        from './boot.js';
import { initScope }       from './scope.js';
import { initHero3D }      from './hero3d.js';
import { initControllers } from './controllers.js';
import { initFotaSim }     from './fota-sim.js';
import { initTerminal }    from './terminal.js';
import { isSoundEnabled, setSoundEnabled, playRelayClick, playSuccessChime } from './sound.js';

// ── Boot preloader ──────────────────────────────────────────
initBoot();

document.addEventListener('DOMContentLoaded', () => {

  // ── Sound Toggle in Nav ────────────────────────────────────
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    const updateSoundBtn = () => {
      const active = isSoundEnabled();
      soundBtn.classList.toggle('active', active);
      soundBtn.setAttribute('aria-label', active ? 'Mute sound synthesizer' : 'Enable tactile audio');
      soundBtn.title = active ? 'Audio ON (Click to mute)' : 'Audio Muted (Click to enable)';
    };
    updateSoundBtn();
    soundBtn.addEventListener('click', () => {
      setSoundEnabled(!isSoundEnabled());
      updateSoundBtn();
    });
  }

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
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
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

  // ── Hero parallax / mouse tilt ────────────────────────────
  const heroImg = document.getElementById('hero-board-img');
  if (heroImg && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      heroImg.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
  }

  // ── Hero Test Points (TP1, TP2) ───────────────────────────
  const tp1 = document.getElementById('tp1-btn');
  const tp2 = document.getElementById('tp2-btn');
  const readoutBox = document.getElementById('hero-tp-readout');

  function showProbeReadout(text) {
    playRelayClick();
    if (readoutBox) {
      readoutBox.textContent = text;
      readoutBox.style.opacity = '1';
    }
  }
  function hideProbeReadout() {
    if (readoutBox) readoutBox.style.opacity = '0';
  }

  tp1?.addEventListener('mouseenter', () => showProbeReadout('TP1: SYSCLK = 72.000 MHz (HSE PLL ×9)'));
  tp1?.addEventListener('mouseleave', hideProbeReadout);
  tp2?.addEventListener('mouseenter', () => showProbeReadout('TP2: USART1_TX = 115200 8N1 PASS'));
  tp2?.addEventListener('mouseleave', hideProbeReadout);

  // ── SVG trace animation ───────────────────────────────────
  const traces = document.querySelectorAll('.trace-path');
  traces.forEach((t, i) => {
    const len = t.getTotalLength?.() || 300;
    t.style.strokeDasharray  = len;
    t.style.strokeDashoffset = len;
    t.style.transition = `stroke-dashoffset 1.2s ${i * 0.2}s var(--ease-out)`;
    setTimeout(() => { t.style.strokeDashoffset = '0'; }, 400 + i * 200);
  });

  // ── Project category filtering ────────────────────────────
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playRelayClick();
      const cat = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.toggle('active', b === btn));
      projectCards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ── Project modal ─────────────────────────────────────────
  const modal      = document.getElementById('project-modal');
  const modalClose = document.querySelector('.modal-close');
  let lastFocused;

  const projects = [
    {
      img:        'assets/proj-fota.webp',
      imgAlt:     'STM32 board connected to an ESP32 module with a wireless signal',
      tag:        'FIRMWARE · OTA ARCHITECTURE',
      title:      'FOTA System with STM32',
      problem:    'Field devices running STM32 microcontrollers in enclosed industrial housings needed reliable remote firmware updates without physical access, disassembly, or risk of bricking.',
      hardware:   'STM32F103 (target MCU), ESP32-WROOM-32 (wireless receiver), UART serial bridge, dual LDO rails',
      firmware:   'Custom two-stage STM32 bootloader in sector 0; ESP32 connects via Wi-Fi to firmware server, chunks binary into 3 KB payload frames, sends over UART at 115200 baud with packet sequence numbering; STM32 computes running CRC-32 and performs atomic vector table relocation jump to application space.',
      outcome:    'Zero bricked units in testing, rock-solid CRC error rejection with automatic rollback, cut maintenance dispatch time by 90%.',
      architecture: 'Cloud Server ──[TLS/Wi-Fi]──> ESP32 Stage ──[115200 8N1 UART]──> STM32 Sector 0 Bootloader ──[CRC32 Verify]──> Relocate VTOR ──> Jump to 0x08004000',
      bom:        'STM32F103C8T6, ESP32-WROOM-32D, AMS1117-3.3V LDO, Status LEDs, Level Clamping',
    },
    {
      img:        'assets/proj-star.webp',
      imgAlt:     'Central hub connected to six sensor nodes with a data dashboard',
      tag:        'NETWORK · IOT SYSTEM',
      title:      'Star Topology Embedded System',
      problem:    'Industrial facility required synchronized real-time sensor monitoring across 6 distinct machine zones without expensive rewiring or proprietary cloud lock-in.',
      hardware:   'Central hub controller, 6 wireless sensor satellite nodes, Wi-Fi gateway module, ADC condition stages',
      firmware:   'Deterministic polling and event-driven star topology; lightweight packet protocol with frame delimiter and parity; centralized telemetry aggregation with sub-second web sockets dispatch to dashboard.',
      outcome:    'Continuous synchronized logging across all 6 zones with zero telemetry packet loss under high EMI factory environments.',
      architecture: 'Satellite Nodes [1..6] ──[Wireless RF/Wi-Fi]──> Central Hub MCU ──[JSON/TCP]──> Telemetry Engine ──[WebSockets]──> Operator Console',
      bom:        'ESP32 Central Gateway, Satellite Sensor Modules, LM35 & Hall Sensors, OLED Display',
    },
    {
      img:        'assets/proj-water.webp',
      imgAlt:     'Water tank with level probes, a controller box and a pump',
      tag:        'EMBEDDED PRODUCT · INDUSTRIAL',
      title:      'Water Level Controller',
      problem:    'Frequent commercial pump burnout caused by dry-running when underground sumps ran dry, plus overflow wastage and erratic relay chatter caused by water ripples.',
      hardware:   'PIC16F877A / Nuvoton M051 microcontrollers, stainless conductive level probes, opto-isolated relay drivers',
      firmware:   'State-machine controller with hysteresis logic; dry-run timer safety cutoff (detects no water contact within 45s); digital filter debounces wave ripples; non-volatile EEPROM event logging.',
      outcome:    'Commercial product actively deployed and installed across residential and commercial customer installations by Xpert Automatix.',
      architecture: 'Stainless Probes ──> Optocoupler PC817 ──> MCU ADC Inputs ──> State Machine & Timer Check ──> High-Current Relay ──> Motor Contactor',
      bom:        'PIC16F877A / Nuvoton MCU, PC817 Optocouplers, 12V Relays, Surge Varistors, Transformerless PSU',
    },
    {
      img:        'assets/proj-vehicle.webp',
      imgAlt:     'Car with an IoT module, signal rings, a lock and a phone alert',
      tag:        'SECURITY · AUTOMOTIVE IOT',
      title:      'Vehicle Theft Detection',
      problem:    'Commercial fleets and private vehicles needed low-cost immediate intrusion detection without relying on smartphone internet data connectivity in dead zones.',
      hardware:   'Microcontroller unit, SIM800L GSM/GPRS modem, NEO-6M GPS receiver, SW-420 vibration sensor, ignition relay',
      firmware:   'Low-power interrupt sleep state; vibration sensor fires external hardware interrupt; awakens MCU to parse NMEA GPS coordinates; issues AT commands to GSM modem for instant voice call + SMS coordinates; accepts authenticated engine immobilizer command.',
      outcome:    'Sub-5-second alert delivery to owner phone with vehicle location map coordinates and immediate remote ignition disable.',
      architecture: 'Vibration Sensor ──[EXTI Trigger]──> MCU Wakeup ──> NEO-6M GPS NMEA Parse ──> SIM800L AT Stack ──[Cellular]──> Owner Phone',
      bom:        'Microcontroller Core, SIM800L Cellular Modem, NEO-6M GPS, SW-420 Vibration Sensor, Sealed Relay',
    },
    {
      img:        'assets/proj-smarthome.webp',
      imgAlt:     'Smart bed and smart toilet linked by wireless signals',
      tag:        'IOT · HOME AUTOMATION',
      title:      'Smart Home Integration',
      problem:    'Custom luxury healthcare / hospitality furniture needed intuitive remote control for patients and guests without clunky wired handheld pendants.',
      hardware:   'ESP32 dual-core SoC, multi-channel linear actuator relay board, limit microswitches, touch capacitive pads',
      firmware:   'Concurrent BLE GATT server and lightweight HTTP/REST web server on FreeRTOS tasks; position calibration using software timing and limit switches; smooth ramp-up/ramp-down motor control.',
      outcome:    'Seamless wireless control via mobile app and web dashboard with zero interference and full physical manual override safety.',
      architecture: 'Mobile App / Web UI ──[BLE 4.2 / Wi-Fi]──> ESP32 FreeRTOS (Task 1: Comm, Task 2: Motor State) ──> Opto-Relays ──> Linear Actuators',
      bom:        'ESP32 Dual-Core, 4-Channel Relay Module, Linear Actuators, End-stop Limit Switches, MeanWell 12V PSU',
    },
    {
      img:        'assets/proj-weather.webp',
      imgAlt:     'Weather station with sensors and a floating data chart',
      tag:        'SENSORS · ENVIRONMENTAL IOT',
      title:      'Weather Monitoring System',
      problem:    'Local agricultural micro-climate monitoring required autonomous weather data collection with continuous graphical analytics.',
      hardware:   'ESP32 controller, BME280 precision digital sensor, light-dependent solar sensor, rain gauge switch',
      firmware:   'I2C driver communication with BME280 sensor; calibration coefficients arithmetic; deep-sleep timer intervals for battery longevity; cloud REST API JSON telemetry payload dispatcher.',
      outcome:    'Reliable 24/7 environmental logging with interactive web trend charts and storm prediction pressure drop alerts.',
      architecture: 'BME280 [I2C 400kHz] ──> ESP32 Calibration Math ──[Wi-Fi REST]──> Telemetry Backend ──> Chart Dashboard',
      bom:        'ESP32-WROOM, BME280 Sensor (I2C), Solar Cell + 18650 Battery, TP4056 Charger, Weatherproof Box',
    },
  ];

  function openModal(idx) {
    playRelayClick();
    const p = projects[idx];
    document.getElementById('modal-img').src          = p.img;
    document.getElementById('modal-img').alt          = p.imgAlt;
    document.getElementById('modal-tag').textContent  = p.tag;
    document.getElementById('modal-title').textContent= p.title;
    document.getElementById('modal-problem').textContent  = p.problem;
    document.getElementById('modal-hardware').textContent = p.hardware;
    document.getElementById('modal-firmware').textContent = p.firmware;
    document.getElementById('modal-outcome').textContent  = p.outcome;

    const archEl = document.getElementById('modal-arch');
    if (archEl) archEl.textContent = p.architecture;
    const bomEl  = document.getElementById('modal-bom');
    if (bomEl)  bomEl.textContent  = p.bom;

    modal.classList.add('open');
    modal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => modalClose?.focus(), 50);
  }

  function closeModal() {
    playRelayClick();
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocused?.focus();
  }

  projectCards.forEach((card, i) => {
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
      playRelayClick();
      try {
        await navigator.clipboard.writeText('+919629595672');
        copyPhoneBtn.textContent = '✓ Copied to clipboard!';
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
    playSuccessChime();
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
