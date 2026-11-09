/* fota-sim.js – FOTA over UART simulation with 16-sector flash map & CRC error injection */
import { playErrorTone, playKeyClick, playRelayClick, playSuccessChime } from './sound.js';

export function initFotaSim() {
  const startBtn    = document.getElementById('fota-start');
  const resetBtn    = document.getElementById('fota-reset');
  const faultBtn    = document.getElementById('fota-fault-toggle');
  const bar         = document.getElementById('fota-bar-fill');
  const pct         = document.getElementById('fota-pct');
  const log         = document.getElementById('fota-log');
  const espStatus   = document.getElementById('fota-esp-status');
  const stmStatus   = document.getElementById('fota-stm-status');
  const packets     = document.querySelectorAll('.uart-packet');
  const led         = document.getElementById('fota-led');
  const sectorGrid  = document.getElementById('fota-sector-grid');

  if (!startBtn) return;

  const delay = ms => new Promise(r => setTimeout(r, ms));
  let running = false;
  let corruptInject = false;

  // Render 16 flash sectors
  function initSectors() {
    if (!sectorGrid) return;
    sectorGrid.innerHTML = '';
    for (let i = 0; i < 16; i++) {
      const s = document.createElement('div');
      s.className = 'sector-block';
      s.id = `sector-${i}`;
      s.textContent = `S${i}`;
      s.title = `Flash Sector ${i}: 0x0800${(i * 4).toString(16).padStart(4, '0')}`;
      sectorGrid.appendChild(s);
    }
  }
  initSectors();

  function updateSector(idx, status) {
    const s = document.getElementById(`sector-${idx}`);
    if (s) {
      s.className = `sector-block ${status}`;
    }
  }

  function appendLog(msg, cls = '') {
    const span = document.createElement('span');
    span.textContent = msg + '\n';
    if (cls) span.className = cls;
    log.appendChild(span);
    log.scrollTop = log.scrollHeight;
  }

  function setProgress(p) {
    if (bar) bar.style.width = p + '%';
    if (pct) pct.textContent = p + '%';
  }

  function resetUI() {
    running = false;
    setProgress(0);
    if (log) log.innerHTML = '';
    if (espStatus) espStatus.textContent = 'idle';
    if (stmStatus) stmStatus.textContent = 'idle';
    if (led) {
      led.textContent = '⬤';
      led.style.color = 'var(--mut)';
      led.style.textShadow = 'none';
    }
    if (startBtn) startBtn.disabled = false;
    for (let i = 0; i < 16; i++) updateSector(i, 'empty');
  }

  if (faultBtn) {
    faultBtn.addEventListener('click', () => {
      playRelayClick();
      corruptInject = !corruptInject;
      faultBtn.classList.toggle('active', corruptInject);
      faultBtn.textContent = corruptInject ? '⚠ CRC Fault: ACTIVE' : 'Test CRC Fault';
    });
  }

  async function animatePackets() {
    packets.forEach((pkt, i) => {
      pkt.style.animation = 'none';
      setTimeout(() => {
        pkt.style.opacity = '1';
        pkt.style.animation = `slidePacket 0.5s ease-out ${i * 0.08}s both`;
      }, i * 60);
    });
    await delay(500);
    packets.forEach(pkt => { pkt.style.opacity = '0'; });
  }

  async function runFota() {
    if (running) return;
    playRelayClick();
    running = true;
    startBtn.disabled = true;
    resetUI();
    startBtn.disabled = true;

    appendLog('[SIMULATION] Initiating FOTA UART Sequence — Target: STM32F103', 'inf');
    appendLog('ESP32  → Connecting to remote firmware endpoint over TLS...', 'inf');
    if (espStatus) espStatus.textContent = 'fetching firmware';
    await delay(700);

    appendLog('ESP32  ✓ Firmware v2.1.0 downloaded (48 KB)', 'ok');
    playKeyClick();
    setProgress(12);

    appendLog('ESP32  → Pulling BOOT0 HIGH & triggering hardware reset...', 'inf');
    await delay(500);
    appendLog('STM32  ← BOOT0 sampled high, custom bootloader invoked at 0x08000000', 'ok');
    if (stmStatus) stmStatus.textContent = 'bootloader active';
    setProgress(20);

    appendLog('UART   → Baud rate handshake at 115200 8N1...', 'inf');
    await delay(400);
    appendLog('STM32  ← ACK 0x79 (Bootloader initialized & memory unlocked)', 'ok');
    playKeyClick();
    setProgress(25);
    if (espStatus) espStatus.textContent = 'streaming packets';
    if (stmStatus) stmStatus.textContent = 'writing flash';

    const totalPackets = 16;
    for (let i = 1; i <= totalPackets; i++) {
      updateSector(i - 1, 'writing');
      animatePackets();
      await delay(220);

      const p = Math.round(25 + (i / totalPackets) * 55);
      setProgress(p);

      const a = ((i - 1) * 3072).toString(16).padStart(5, '0');
      const b = (i * 3072 - 1).toString(16).padStart(5, '0');

      if (corruptInject && i === 11) {
        appendLog(`PKT ${String(i).padStart(2,'0')} → [FAULT] Bit error intentional injection at 0x${a}`, 'warn');
        updateSector(i - 1, 'err');
      } else {
        appendLog(`PKT ${String(i).padStart(2,'0')} → Write 3072B @ 0x${a}-0x${b} (ACK 0x79)`, 'inf');
        updateSector(i - 1, 'done');
      }
      playKeyClick();
    }

    if (espStatus) espStatus.textContent = 'done';
    if (stmStatus) stmStatus.textContent = 'verifying';
    appendLog('CRC32  → Computing hardware polynomial checksum...', 'inf');
    await delay(600);

    if (corruptInject) {
      appendLog('CRC32  ✗ 0xDEADBEEF — Checksum mismatch on block 11!', 'err');
      playErrorTone();
      if (stmStatus) stmStatus.textContent = 'aborted';
      appendLog('STM32  ⚠ Rollback triggered! Application jump refused. System safe.', 'err');
      running = false;
      startBtn.disabled = false;
      return;
    }

    appendLog('CRC32  ✓ 0xA3F8C21D  PASS', 'ok');
    setProgress(92);
    await delay(400);

    appendLog('STM32  → Relocating Vector Table to 0x08004000 & jumping...', 'inf');
    await delay(500);
    if (stmStatus) stmStatus.textContent = 'app running v2.1.0';
    appendLog('STM32  ✓ Application running v2.1.0', 'ok');
    setProgress(100);

    if (led) {
      led.textContent = '⬤';
      led.style.color = 'var(--sig)';
      led.style.textShadow = '0 0 10px var(--sig)';
    }
    playSuccessChime();
    appendLog('[SIMULATION] FOTA complete — PC13 LED ON ✓', 'ok');
    running = false;
    startBtn.disabled = false;
  }

  startBtn.addEventListener('click', runFota);
  resetBtn?.addEventListener('click', resetUI);
}
