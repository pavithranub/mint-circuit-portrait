/* fota-sim.js – FOTA over UART simulation (clearly labelled simulation) */
export function initFotaSim() {
  const startBtn   = document.getElementById('fota-start');
  const resetBtn   = document.getElementById('fota-reset');
  const bar        = document.getElementById('fota-bar-fill');
  const pct        = document.getElementById('fota-pct');
  const log        = document.getElementById('fota-log');
  const espStatus  = document.getElementById('fota-esp-status');
  const stmStatus  = document.getElementById('fota-stm-status');
  const packets    = document.querySelectorAll('.uart-packet');
  const led        = document.getElementById('fota-led');

  if (!startBtn) return;

  const delay = ms => new Promise(r => setTimeout(r, ms));
  let running = false;

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
    if (led) led.textContent = '⬤';
    if (led) led.style.color = 'var(--mut)';
    if (startBtn) startBtn.disabled = false;
  }

  async function animatePackets() {
    packets.forEach((pkt, i) => {
      pkt.style.animation = 'none';
      setTimeout(() => {
        pkt.style.opacity = '1';
        pkt.style.animation = `slidePacket 0.6s ease-out ${i * 0.08}s both`;
      }, i * 80);
    });
    await delay(800);
    packets.forEach(pkt => { pkt.style.opacity = '0'; });
  }

  async function runFota() {
    if (running) return;
    running = true;
    startBtn.disabled = true;
    resetUI();
    startBtn.disabled = true;

    appendLog('$ [SIMULATION] FOTA sequence initiated', 'inf');
    appendLog('$ ESP32  → connecting to firmware server...', 'inf');
    if (espStatus) espStatus.textContent = 'fetching firmware';
    await delay(800);
    appendLog('$ ESP32  ✓ firmware v2.1.0 downloaded (48 KB)', 'ok');
    setProgress(10);

    appendLog('$ ESP32  → entering bootloader mode on STM32...', 'inf');
    await delay(600);
    appendLog('$ STM32  ← BOOT0 high, reset released', 'ok');
    if (stmStatus) stmStatus.textContent = 'bootloader active';
    setProgress(18);

    appendLog('$ UART   → 115200 baud, 8N1', 'inf');
    await delay(400);
    appendLog('$ STM32  ← ACK 0x79  (bootloader ready)', 'ok');
    setProgress(22);

    const totalPackets = 16;
    for (let i = 1; i <= totalPackets; i++) {
      await animatePackets();
      const p = Math.round(22 + (i / totalPackets) * 60);
      setProgress(p);
      appendLog(`$ PKT ${String(i).padStart(2,'0')} → bytes 0x${((i-1)*3072).toString(16).padStart(5,'0')}-0x${(i*3072-1).toString(16).padStart(5,'0')}`, 'inf');
      await delay(180);
    }
    setProgress(82);
    appendLog('$ CRC32  → checking firmware integrity...', 'inf');
    await delay(700);
    appendLog('$ CRC32  ✓ 0xA3F8C21D  PASS', 'ok');
    setProgress(90);

    appendLog('$ STM32  → jumping to application...', 'inf');
    await delay(600);
    if (stmStatus) stmStatus.textContent = 'app running v2.1.0';
    appendLog('$ STM32  ✓ application started', 'ok');
    setProgress(100);

    if (led) { led.textContent = '⬤'; led.style.color = 'var(--sig)'; led.style.textShadow = '0 0 8px var(--sig)'; }
    appendLog('$ [SIMULATION] FOTA complete — LED ON ✓', 'ok');
    running = false;
    if (startBtn) startBtn.disabled = false;
  }

  startBtn.addEventListener('click', runFota);
  resetBtn?.addEventListener('click', resetUI);
}
