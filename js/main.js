/* main.js – orchestrator: reveals, rail packet, mobile nav, hero parallax, project carousel & modal, probe cursor, sound & filter */
import { initBoot }        from './boot.js';
import { initScope }       from './scope.js';
import { initHero3D }      from './hero3d.js';
import { initControllers } from './controllers.js';
import { initFotaSim }     from './fota-sim.js';
import { initTerminal }    from './terminal.js';
import { isSoundEnabled, setSoundEnabled, playRelayClick, playSuccessChime, playErrorTone } from './sound.js';

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

  // ── Oscilloscope mini canvas in nav ────────────────────────
  initScope('scope-canvas');

  // ── Hero 3D scene (lazy) ──────────────────────────────────
  initHero3D();

  // ── Controllers bench ─────────────────────────────────────
  initControllers();

  // ── FOTA simulator ────────────────────────────────────────
  initFotaSim();

  // ── Serial terminal ───────────────────────────────────────
  initTerminal();

  // ── Mobile Navigation Drawer ──────────────────────────────
  const navToggleBtn = document.getElementById('nav-toggle-btn');
  const navDrawer    = document.getElementById('mobile-nav-drawer');
  const navToggleIcon = document.getElementById('nav-toggle-icon');
  const mobileTerminalTrigger = document.getElementById('mobile-terminal-trigger');

  if (navToggleBtn && navDrawer) {
    navToggleBtn.addEventListener('click', () => {
      playRelayClick();
      const isOpen = navDrawer.classList.toggle('open');
      navToggleBtn.setAttribute('aria-expanded', isOpen);
      if (navToggleIcon) navToggleIcon.textContent = isOpen ? '✕' : '☰';
    });

    // Close mobile nav when clicking any link inside it
    navDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navDrawer.classList.remove('open');
        navToggleBtn.setAttribute('aria-expanded', 'false');
        if (navToggleIcon) navToggleIcon.textContent = '☰';
      });
    });

    mobileTerminalTrigger?.addEventListener('click', () => {
      navDrawer.classList.remove('open');
      navToggleBtn.setAttribute('aria-expanded', 'false');
      if (navToggleIcon) navToggleIcon.textContent = '☰';
      document.getElementById('open-terminal-btn')?.click();
    });
  }

  // ── ScrollSpy for Active Nav Links ─────────────────────────
  const navLinks = document.querySelectorAll('.nav-links .nav-link, .mobile-nav-link');
  const trackedSections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    trackedSections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isMatch = href === `#${currentId}`;
      link.classList.toggle('active', isMatch);
    });
  }, { passive: true });

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
  const statusObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const chip = e.target.querySelector('.status-chip');
      if (chip) chip.style.opacity = e.isIntersecting ? '1' : '0.4';
    });
  }, { threshold: 0.15 });
  trackedSections.forEach(s => statusObs.observe(s));

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
      heroImg.style.transform = `perspective(900px) rotateX(${-y}deg) rotateY(${x}deg)`;
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
  tp1?.addEventListener('click', () => showProbeReadout('TP1: SYSCLK = 72.000 MHz (HSE PLL ×9)'));

  tp2?.addEventListener('mouseenter', () => showProbeReadout('TP2: USART1_TX = 115200 8N1 PASS'));
  tp2?.addEventListener('mouseleave', hideProbeReadout);
  tp2?.addEventListener('click', () => showProbeReadout('TP2: USART1_TX = 115200 8N1 PASS'));

  // ── SVG trace animation in Hero ───────────────────────────
  const traces = document.querySelectorAll('.trace-path');
  traces.forEach((t, i) => {
    const len = t.getTotalLength?.() || 300;
    t.style.strokeDasharray  = len;
    t.style.strokeDashoffset = len;
    t.style.transition = `stroke-dashoffset 1.2s ${i * 0.2}s var(--ease-out)`;
    setTimeout(() => { t.style.strokeDashoffset = '0'; }, 400 + i * 200);
  });

  // ── Projects Master Data ──────────────────────────────────
  const projects = [
    {
      id:         'ssls',
      img:        'assets/proj-ssls.png',
      imgAlt:     'Smart Solar Light System for highways and tolls',
      tag:        'IOT · SOLAR MONITORING',
      title:      'SSLS – Smart Solar Light System',
      desc:       'Solar based street light control and monitoring system for highways and tolls.',
      tags:       ['ESP32', 'IoT', 'LoRa', 'Remote Monitoring'],
      category:   'iot',
      problem:    'Highways and expressway tolls needed automated, autonomous solar lighting with synchronized central illumination control, solar panel health diagnostics, battery state-of-charge tracking, and fault isolation.',
      hardware:   'ESP32 SoC, SX1278 LoRa transceiver module, MPPT solar charge controller interface, high-efficiency LED driver, ambient LUX sensor, shunt current monitor',
      firmware:   'FreeRTOS task pipeline on ESP32; deterministic LoRa telemetry packet broadcast to gateway; automatic sunset/sunrise twilight threshold calculation; deep-sleep battery conservation mode during overcast monsoon periods.',
      outcome:    'Reduced highway lighting energy consumption by 42%, enabled automated instant notification for burned LED clusters or soiled solar panels across 15+ km expressway corridors.',
      architecture: 'Solar Panel / Battery ──> MPPT Monitor ──> ESP32 + SX1278 LoRa ──[LoRa 433/868MHz]──> Toll Plaza Gateway ──[MQTT/TLS]──> Central Highway Cloud Dashboard',
      bom:        'ESP32-WROOM-32D, Semtech SX1278 LoRa, ACS712 Current Sensor, TEMT6000 Lux Sensor, MeanWell LED Driver, Weatherproof IP67 Enclosure',
    },
    {
      id:         'fota',
      img:        'assets/proj-fota.webp',
      imgAlt:     'STM32 board connected to an ESP32 module with a wireless signal',
      tag:        'FIRMWARE · OTA ARCHITECTURE',
      title:      'FOTA System with STM32',
      desc:       'Wireless firmware updates via ESP32 over UART with CRC validation and custom bootloader.',
      tags:       ['STM32', 'ESP32', 'FOTA', 'UART Bootloader'],
      category:   'firmware',
      problem:    'Field devices running STM32 microcontrollers in enclosed industrial housings needed reliable remote firmware updates without physical access, disassembly, or risk of bricking.',
      hardware:   'STM32F103 (target MCU), ESP32-WROOM-32 (wireless receiver), UART serial bridge, dual LDO rails',
      firmware:   'Custom two-stage STM32 bootloader in sector 0; ESP32 connects via Wi-Fi to firmware server, chunks binary into 3 KB payload frames, sends over UART at 115200 baud with packet sequence numbering; STM32 computes running CRC-32 and performs atomic vector table relocation jump to application space.',
      outcome:    'Zero bricked units in testing, rock-solid CRC error rejection with automatic rollback, cut maintenance dispatch time by 90%.',
      architecture: 'Cloud Server ──[TLS/Wi-Fi]──> ESP32 Stage ──[115200 8N1 UART]──> STM32 Sector 0 Bootloader ──[CRC32 Verify]──> Relocate VTOR ──> Jump to 0x08004000',
      bom:        'STM32F103C8T6, ESP32-WROOM-32D, AMS1117-3.3V LDO, Status LEDs, Level Clamping',
    },
    {
      id:         'star',
      img:        'assets/proj-star.webp',
      imgAlt:     'Central hub connected to six sensor nodes with a data dashboard',
      tag:        'NETWORK · IOT SYSTEM',
      title:      'Star Topology Embedded System',
      desc:       'Centralised data management with real-time web monitoring and control across 6 nodes.',
      tags:       ['ESP32', 'Star Topology', 'WebSockets', 'Telemetry'],
      category:   'iot',
      problem:    'Industrial facility required synchronized real-time sensor monitoring across 6 distinct machine zones without expensive rewiring or proprietary cloud lock-in.',
      hardware:   'Central hub controller, 6 wireless sensor satellite nodes, Wi-Fi gateway module, ADC condition stages',
      firmware:   'Deterministic polling and event-driven star topology; lightweight packet protocol with frame delimiter and parity; centralized telemetry aggregation with sub-second web sockets dispatch to dashboard.',
      outcome:    'Continuous synchronized logging across all 6 zones with zero telemetry packet loss under high EMI factory environments.',
      architecture: 'Satellite Nodes [1..6] ──[Wireless RF/Wi-Fi]──> Central Hub MCU ──[JSON/TCP]──> Telemetry Engine ──[WebSockets]──> Operator Console',
      bom:        'ESP32 Central Gateway, Satellite Sensor Modules, LM35 & Hall Sensors, OLED Display',
    },
    {
      id:         'water',
      img:        'assets/proj-water.webp',
      imgAlt:     'Water tank with level probes, a controller box and a pump',
      tag:        'EMBEDDED PRODUCT · INDUSTRIAL',
      title:      'Water Level Controller',
      desc:       'Fully automatic pump control with dry-run protection using PIC and Nuvoton MCUs.',
      tags:       ['PIC', 'Nuvoton', 'Industrial', 'Opto-Relay'],
      category:   'industrial',
      problem:    'Frequent commercial pump burnout caused by dry-running when underground sumps ran dry, plus overflow wastage and erratic relay chatter caused by water ripples.',
      hardware:   'PIC16F877A / Nuvoton M051 microcontrollers, stainless conductive level probes, opto-isolated relay drivers',
      firmware:   'State-machine controller with hysteresis logic; dry-run timer safety cutoff (detects no water contact within 45s); digital filter debounces wave ripples; non-volatile EEPROM event logging.',
      outcome:    'Commercial product actively deployed and installed across residential and commercial customer installations by Xpert Automatix.',
      architecture: 'Stainless Probes ──> Optocoupler PC817 ──> MCU ADC Inputs ──> State Machine & Timer Check ──> High-Current Relay ──> Motor Contactor',
      bom:        'PIC16F877A / Nuvoton MCU, PC817 Optocouplers, 12V Relays, Surge Varistors, Transformerless PSU',
    },
    {
      id:         'vehicle',
      img:        'assets/proj-vehicle.webp',
      imgAlt:     'Car with an IoT module, signal rings, a lock and a phone alert',
      tag:        'SECURITY · AUTOMOTIVE IOT',
      title:      'Vehicle Theft Detection',
      desc:       'Real-time alerts and remote engine locking via GSM for unauthorised movement.',
      tags:       ['GSM', 'GPS', 'Automotive', 'Security'],
      category:   'iot',
      problem:    'Commercial fleets and private vehicles needed low-cost immediate intrusion detection without relying on smartphone internet data connectivity in dead zones.',
      hardware:   'Microcontroller unit, SIM800L GSM/GPRS modem, NEO-6M GPS receiver, SW-420 vibration sensor, ignition relay',
      firmware:   'Low-power interrupt sleep state; vibration sensor fires external hardware interrupt; awakens MCU to parse NMEA GPS coordinates; issues AT commands to GSM modem for instant voice call + SMS coordinates; accepts authenticated engine immobilizer command.',
      outcome:    'Sub-5-second alert delivery to owner phone with vehicle location map coordinates and immediate remote ignition disable.',
      architecture: 'Vibration Sensor ──[EXTI Trigger]──> MCU Wakeup ──> NEO-6M GPS NMEA Parse ──> SIM800L AT Stack ──[Cellular]──> Owner Phone',
      bom:        'Microcontroller Core, SIM800L Cellular Modem, NEO-6M GPS, SW-420 Vibration Sensor, Sealed Relay',
    },
    {
      id:         'smarthome',
      img:        'assets/proj-smarthome.webp',
      imgAlt:     'Smart bed and smart toilet linked by wireless signals',
      tag:        'IOT · HOME AUTOMATION',
      title:      'Smart Home Integration',
      desc:       'IoT integration of smart bed and smart toilet with BLE + Wi-Fi app control.',
      tags:       ['BLE 4.2', 'Wi-Fi', 'Actuators', 'Home Automation'],
      category:   'iot',
      problem:    'Custom luxury healthcare / hospitality furniture needed intuitive remote control for patients and guests without clunky wired handheld pendants.',
      hardware:   'ESP32 dual-core SoC, multi-channel linear actuator relay board, limit microswitches, touch capacitive pads',
      firmware:   'Concurrent BLE GATT server and lightweight HTTP/REST web server on FreeRTOS tasks; position calibration using software timing and limit switches; smooth ramp-up/ramp-down motor control.',
      outcome:    'Seamless wireless control via mobile app and web dashboard with zero interference and full physical manual override safety.',
      architecture: 'Mobile App / Web UI ──[BLE 4.2 / Wi-Fi]──> ESP32 FreeRTOS (Task 1: Comm, Task 2: Motor State) ──> Opto-Relays ──> Linear Actuators',
      bom:        'ESP32 Dual-Core, 4-Channel Relay Module, Linear Actuators, End-stop Limit Switches, MeanWell 12V PSU',
    },
    {
      id:         'weather',
      img:        'assets/proj-weather.webp',
      imgAlt:     'Weather station with sensors and a floating data chart',
      tag:        'SENSORS · ENVIRONMENTAL IOT',
      title:      'Weather Monitoring System',
      desc:       'IoT-based real-time data collection with web dashboard for analysis and forecasting.',
      tags:       ['BME280', 'I2C', 'Sensors', 'IoT Cloud'],
      category:   'iot',
      problem:    'Local agricultural micro-climate monitoring required autonomous weather data collection with continuous graphical analytics.',
      hardware:   'ESP32 controller, BME280 precision digital sensor, light-dependent solar sensor, rain gauge switch',
      firmware:   'I2C driver communication with BME280 sensor; calibration coefficients arithmetic; deep-sleep timer intervals for battery longevity; cloud REST API JSON telemetry payload dispatcher.',
      outcome:    'Reliable 24/7 environmental logging with interactive web trend charts and storm prediction pressure drop alerts.',
      architecture: 'BME280 [I2C 400kHz] ──> ESP32 Calibration Math ──[Wi-Fi REST]──> Telemetry Backend ──> Chart Dashboard',
      bom:        'ESP32-WROOM, BME280 Sensor (I2C), Solar Cell + 18650 Battery, TP4056 Charger, Weatherproof Box',
    },
  ];

  // ── Featured Projects Carousel (Slide 4 Implementation) ───
  let currentCarouselIndex = 0;
  const carouselImg    = document.getElementById('carousel-card-img');
  const carouselTitle  = document.getElementById('carousel-card-title');
  const carouselDesc   = document.getElementById('carousel-card-desc');
  const carouselTags   = document.getElementById('carousel-card-tags');
  const carouselOpenBtn= document.getElementById('carousel-card-open-btn');
  const prevBtn        = document.getElementById('carousel-prev-btn');
  const nextBtn        = document.getElementById('carousel-next-btn');
  const dotsWrap       = document.getElementById('carousel-dots-wrap');

  // Build dots
  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    projects.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        playRelayClick();
        setCarouselSlide(idx);
      });
      dotsWrap.appendChild(dot);
    });
  }

  function setCarouselSlide(idx) {
    currentCarouselIndex = (idx + projects.length) % projects.length;
    const item = projects[currentCarouselIndex];

    if (carouselImg) {
      carouselImg.style.opacity = '0';
      setTimeout(() => {
        carouselImg.src = item.img;
        carouselImg.alt = item.imgAlt;
        carouselImg.style.opacity = '1';
      }, 150);
    }
    if (carouselTitle) carouselTitle.textContent = item.title;
    if (carouselDesc)  carouselDesc.textContent  = item.desc;

    if (carouselTags) {
      carouselTags.innerHTML = item.tags
        .map(t => `<span class="carousel-tag">${t}</span>`)
        .join('');
    }

    // Update dots
    const dots = dotsWrap?.querySelectorAll('.carousel-dot');
    dots?.forEach((d, i) => d.classList.toggle('active', i === currentCarouselIndex));
  }

  prevBtn?.addEventListener('click', () => {
    playRelayClick();
    setCarouselSlide(currentCarouselIndex - 1);
  });
  nextBtn?.addEventListener('click', () => {
    playRelayClick();
    setCarouselSlide(currentCarouselIndex + 1);
  });

  carouselOpenBtn?.addEventListener('click', () => {
    openModal(currentCarouselIndex);
  });

  // ── Project category filtering for full grid ──────────────
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

  // ── Copy phone number ─────────────────────────────────────
  const copyPhoneBtn = document.getElementById('copy-phone-btn');
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', async () => {
      playRelayClick();
      try {
        await navigator.clipboard.writeText('+919629595672');
        copyPhoneBtn.textContent = '✓ Copied!';
        setTimeout(() => { copyPhoneBtn.textContent = 'Copy'; }, 2000);
      } catch {
        copyPhoneBtn.textContent = '+91 96295 95672';
      }
    });
  }

  // ── Contact form submission ───────────────────────────────
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', e => {
    e.preventDefault();
    const name    = contactForm.querySelector('#cf-name')?.value.trim();
    const email   = contactForm.querySelector('#cf-email')?.value.trim();
    const message = contactForm.querySelector('#cf-message')?.value.trim();

    if (!name || !email || !message) {
      playErrorTone();
      alert('Please fill in your name, email, and message before sending.');
      return;
    }

    playSuccessChime();
    const subject = `Engineering Collaboration — ${name}`;
    const body    = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    window.location.href = `mailto:pavithranub@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  // ── Probe cursor (desktop only) ───────────────────────────
  const probe    = document.getElementById('probe-cursor');
  const readout  = document.getElementById('probe-readout');
  if (probe && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      probe.style.left = e.clientX + 'px';
      probe.style.top  = e.clientY + 'px';
      if (readout) {
        readout.style.left = (e.clientX + 18) + 'px';
        readout.style.top  = (e.clientY - 6) + 'px';
      }
    });

    document.querySelectorAll('a, button, .project-card, .ctrl-tab, .mcu-card, .skill-badge-card, .carousel-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        probe.classList.add('active');
        if (readout) {
          readout.style.display = 'block';
          readout.textContent   = el.dataset.probeLabel || el.getAttribute('aria-label') || el.textContent.trim().slice(0, 20);
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
