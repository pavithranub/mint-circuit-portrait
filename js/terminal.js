/* terminal.js – Serial terminal easter egg */
export function initTerminal() {
  const overlay   = document.getElementById('terminal-overlay');
  const input     = document.getElementById('term-input');
  const output    = document.getElementById('term-output');
  const closeBtn  = document.querySelector('.term-close');
  const openBtn   = document.getElementById('open-terminal-btn');

  if (!overlay) return;

  let history = [];
  let histIdx = -1;
  let isOpen  = false;

  const commands = {
    help: () => [
      { cls: 'out-info', text: 'Available commands:' },
      { cls: 'out-ok',   text: '  projects  — list all projects' },
      { cls: 'out-ok',   text: '  skills    — list skills & tools' },
      { cls: 'out-ok',   text: '  contact   — contact information' },
      { cls: 'out-ok',   text: '  fota      — about FOTA project' },
      { cls: 'out-ok',   text: '  about     — about Pavithran' },
      { cls: 'out-ok',   text: '  clear     — clear terminal' },
      { cls: 'out-ok',   text: '  close     — close terminal' },
    ],
    projects: () => [
      { cls: 'out-info', text: 'Projects (6 total):' },
      { cls: 'out-ok',   text: '  [1] FOTA System — STM32 + ESP32 UART update' },
      { cls: 'out-ok',   text: '  [2] Star Topology — centralized data + web dashboard' },
      { cls: 'out-ok',   text: '  [3] Water Level Controller — PIC + Nuvoton, dry-run protection' },
      { cls: 'out-ok',   text: '  [4] Vehicle Theft Detection — IoT, real-time alerts' },
      { cls: 'out-ok',   text: '  [5] Smart Home — bed + toilet IoT integration' },
      { cls: 'out-ok',   text: '  [6] Weather Monitor — IoT sensors + web dashboard' },
    ],
    skills: () => [
      { cls: 'out-info', text: 'Languages: Embedded C, C, C++, Python, SQL, HTML, CSS' },
      { cls: 'out-info', text: 'MCUs: STM32, PIC, ESP32, ESP8266, Arduino, Nuvoton, MSP430, CC3200' },
      { cls: 'out-info', text: 'Tools: STM32Cube IDE, Keil, MPLAB X, KiCad, Proteus' },
      { cls: 'out-info', text: 'Protocols: UART, I2C, SPI, USB, GSM, BLE, RS232' },
      { cls: 'out-info', text: 'Certs: ARM Microcontrollers, PIC Microcontroller, DBMS (NPTEL)' },
    ],
    contact: () => [
      { cls: 'out-ok',   text: '  Email:    pavithranub2001@gmail.com' },
      { cls: 'out-ok',   text: '  LinkedIn: linkedin.com/in/pavithran-ub' },
      { cls: 'out-ok',   text: '  GitHub:   github.com/pavithranub' },
    ],
    fota: () => [
      { cls: 'out-info', text: 'FOTA System: Firmware Over-The-Air update' },
      { cls: 'out-ok',   text: '  Host MCU:   STM32 (target firmware)' },
      { cls: 'out-ok',   text: '  Updater:    ESP32 (wireless firmware fetch)' },
      { cls: 'out-ok',   text: '  Channel:    UART at 115200 baud, 8N1' },
      { cls: 'out-ok',   text: '  Bootloader: custom STM32 bootloader' },
      { cls: 'out-ok',   text: '  Integrity:  CRC32 verification' },
      { cls: 'out-ok',   text: '  See the FOTA Simulator section on this page.' },
    ],
    about: () => [
      { cls: 'out-info', text: 'Pavithran U B — Embedded Developer' },
      { cls: 'out-ok',   text: '  Coimbatore, Tamil Nadu' },
      { cls: 'out-ok',   text: '  MSc Electronics & Communication Systems' },
      { cls: 'out-ok',   text: '  PSG Arts & Science College, 2022–2024' },
      { cls: 'out-ok',   text: '  "Code is like humor. When you have to explain it, it\'s bad."' },
    ],
    clear: () => { output.innerHTML = ''; return []; },
    close: () => { closeTerminal(); return []; },
  };

  function open() {
    overlay.classList.add('open');
    isOpen = true;
    input?.focus();
    if (!output.hasChildNodes()) {
      append([
        { cls: 'out-info', text: 'Pavithran UB Serial Console v1.0' },
        { cls: 'out-ok',   text: 'Type "help" for commands.' },
      ]);
    }
  }

  function closeTerminal() {
    overlay.classList.remove('open');
    isOpen = false;
  }

  function append(lines) {
    lines.forEach(({ cls, text }) => {
      const el = document.createElement('div');
      el.className = cls;
      el.textContent = text;
      output.appendChild(el);
    });
    output.scrollTop = output.scrollHeight;
  }

  function run(cmd) {
    const trimmed = cmd.trim().toLowerCase();
    const echo = document.createElement('div');
    echo.className = 'out-cmd';
    echo.textContent = '> ' + cmd;
    output.appendChild(echo);

    if (trimmed === '') { output.scrollTop = output.scrollHeight; return; }
    if (commands[trimmed]) {
      const result = commands[trimmed]();
      if (result?.length) append(result);
    } else {
      append([{ cls: 'out-err', text: `Command not found: "${trimmed}". Type "help".` }]);
    }
    output.scrollTop = output.scrollHeight;
  }

  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const cmd = input.value;
      history.unshift(cmd);
      histIdx = -1;
      run(cmd);
      input.value = '';
    }
    if (e.key === 'ArrowUp')   { histIdx = Math.min(histIdx + 1, history.length - 1); input.value = history[histIdx] || ''; }
    if (e.key === 'ArrowDown') { histIdx = Math.max(histIdx - 1, -1); input.value = histIdx === -1 ? '' : history[histIdx]; }
    if (e.key === 'Escape')    { closeTerminal(); }
  });

  closeBtn?.addEventListener('click', closeTerminal);
  openBtn?.addEventListener('click',  open);

  document.addEventListener('keydown', e => {
    if (e.key === '`' || (e.ctrlKey && e.key === 'k')) {
      e.preventDefault();
      isOpen ? closeTerminal() : open();
    }
  });
}
