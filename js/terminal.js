/* terminal.js – Serial terminal easter egg with tab completion & embedded command set */
import { playKeyClick, playRelayClick } from './sound.js';

export function initTerminal() {
  const overlay  = document.getElementById('terminal-overlay');
  const openBtn  = document.getElementById('open-terminal-btn');
  const closeBtn = document.getElementById('close-terminal-btn');
  const input    = document.getElementById('terminal-input');
  const output   = document.getElementById('terminal-output');

  if (!overlay || !input) return;

  const commandList = [
    'help', 'projects', 'skills', 'contact', 'fota', 'about',
    'dmesg', 'pinout', 'resume', 'reboot', 'clear', 'close', 'exit'
  ];

  const commands = {
    help: () => [
      'Pavithran UB Embedded Shell v2.5 — Available commands:',
      '  projects  — list all 6 production builds',
      '  skills    — list languages, MCUs, protocols & tools',
      '  fota      — inspect FOTA STM32+ESP32 architecture',
      '  dmesg     — dump kernel / hardware initialization log',
      '  pinout    — display STM32 primary pin mappings',
      '  contact   — developer contact points (email, phone, LinkedIn)',
      '  resume    — direct link to download Word resume',
      '  about     — background, education, and credentials',
      '  reboot    — trigger hardware bootloader reset',
      '  clear     — clear terminal scrollback',
      '  close     — exit console',
    ],
    projects: () => [
      '=== PRODUCTION & RESEARCH EMBEDDED PROJECTS ===',
      '  [1] FOTA System — STM32 + ESP32 UART firmware update with CRC32',
      '  [2] Star Topology — 6-node wireless telemetry network + live web dashboard',
      '  [3] Water Level Controller — Commercial PIC & Nuvoton system with dry-run safety',
      '  [4] Vehicle Theft Detection — GSM/GPS anti-theft with remote engine cut-off',
      '  [5] Smart Home Automation — ESP32 BLE + Wi-Fi motorized actuators',
      '  [6] Weather Monitoring — Environmental telemetry with BME280 & forecasting',
    ],
    skills: () => [
      '=== EMBEDDED DEVELOPER TOOLSET ===',
      '  Languages:  Embedded C, C, C++, Python, SQL, HTML5, CSS3',
      '  MCUs:       STM32 (Cortex-M3/M4), ESP32, PIC16F877A, Nuvoton M051, Arduino',
      '  Protocols:  UART, I2C, SPI, BLE 4.2, Wi-Fi, GSM AT, RS232, RS485',
      '  Toolchains: STM32Cube IDE, Keil µVision, MPLAB X, KiCad, Proteus',
      '  Hardware:   Oscilloscope, Logic Analyzer, DMM, SMD Soldering, PCB Layout',
    ],
    contact: () => [
      '=== DIRECT CONTACT ===',
      '  Email:    pavithranub2001@gmail.com',
      '  Phone:    +91 96295 95672',
      '  LinkedIn: https://linkedin.com/in/pavithran-ub',
      '  GitHub:   https://github.com/pavithranub',
      '  Location: Coimbatore, Tamil Nadu, India',
    ],
    fota: () => [
      '=== FOTA SYSTEM ARCHITECTURE ===',
      '  Host MCU:      STM32F103 (Cortex-M3 @ 72MHz)',
      '  Bridge Node:   ESP32-WROOM (Wireless TLS Download)',
      '  Bus:           Hardware UART @ 115200 Baud, 8N1',
      '  Integrity:     CRC-32 Hardware polynomial calculation',
      '  Safety:        Dual-bank vector jump; automatic rollback upon mismatch',
    ],
    about: () => [
      '=== PAVITHRAN U B ===',
      '  Role:      Embedded Firmware Developer',
      '  Degree:    M.Sc. Electronics & Communication Systems',
      '  College:   PSG Arts & Science College, Coimbatore (2022–2024)',
      '  Employer:  Xpert Automatix (SolarWinds & MCU Products)',
    ],
    resume: () => [
      'Resume document location:',
      '  https://github.com/pavithranub/porfolio/raw/refs/heads/main/Pavithran%20UB.docx',
    ],
    dmesg: () => [
      '[0.000000] Linux kernel on ARM Cortex-M3 (booting)',
      '[0.000120] CPU: STM32F103 @ 72MHz, Revision r1p1',
      '[0.000340] memory: 20KB SRAM, 64KB Flash mapped',
      '[0.001200] console [ttyS0] enabled at 115200 8n1',
      '[0.002400] spi0: SPI Master controller initialized (18 MHz)',
      '[0.003100] i2c0: Fast-mode I2C bus initialized at 400 kHz',
      '[0.004200] gpio: 37 IO pins configured',
      '[0.005100] wdt: Hardware Independent Watchdog active (1.6s timeout)',
      '[0.006200] fota: Flash partition /dev/mtd1 verified CRC32 OK',
      '[0.008000] System ready. Welcome to Pavithran UB console.',
    ],
    pinout: () => [
      '=== STM32F103 KEY PINOUT ===',
      '  PA9  ── USART1_TX (115200 baud)',
      '  PA10 ── USART1_RX (115200 baud)',
      '  PA5  ── SPI1_SCK',
      '  PB6  ── I2C1_SCL',
      '  PB7  ── I2C1_SDA',
      '  PC13 ── User Diagnostic LED',
      '  BOOT0── HIGH for Bootloader / LOW for Flash App',
    ],
  };

  const history = [];
  let histIdx = -1;

  function printLine(text, cls = '') {
    const line = document.createElement('div');
    line.className = 'term-line ' + cls;
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function open() {
    playRelayClick();
    overlay.classList.add('open');
    input.focus();
  }

  function close() {
    playRelayClick();
    overlay.classList.remove('open');
  }

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    const typing = document.activeElement &&
      (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') &&
      document.activeElement !== input;
    if ((e.key === '`' || (e.ctrlKey && e.key === 'k')) && !typing) {
      e.preventDefault();
      overlay.classList.contains('open') ? close() : open();
    }
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      close();
    }
  });

  input.addEventListener('keydown', e => {
    playKeyClick();
    if (e.key === 'Enter') {
      const val = input.value.trim().toLowerCase();
      printLine(`pub@stm32:~$ ${input.value}`, 'cmd');
      if (val) {
        history.unshift(input.value);
        histIdx = -1;
      }
      input.value = '';

      if (val === 'clear') {
        output.innerHTML = '';
        return;
      }
      if (val === 'close' || val === 'exit') {
        close();
        return;
      }
      if (val === 'reboot') {
        printLine('Rebooting system...', 'warn');
        sessionStorage.removeItem('booted');
        setTimeout(() => window.location.reload(), 600);
        return;
      }

      const handler = commands[val];
      if (handler) {
        const lines = handler();
        lines.forEach(l => printLine(l, 'ok'));
      } else if (val) {
        printLine(`bash: command not found: "${val}". Type "help" for a list of commands.`, 'err');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = input.value.trim().toLowerCase();
      if (!current) return;
      const match = commandList.find(c => c.startsWith(current));
      if (match) input.value = match;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const i = Math.min(histIdx + 1, history.length - 1);
      if (i >= 0 && history[i]) {
        histIdx = i;
        input.value = history[i];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const i = Math.max(histIdx - 1, -1);
      histIdx = i;
      input.value = i === -1 ? '' : (history[i] || '');
    }
  });

  printLine('PAVITHRAN U B — SERIAL SHELL CONSOLE v2.5', 'info');
  printLine('Type "help" for a list of commands, or press [Tab] to auto-complete.', 'ok');
}
