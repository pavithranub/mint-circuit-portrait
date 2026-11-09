/* controllers.js – Sticky chip bench, interactive pinout inspection & bare-metal C code */
import { playRelayClick } from './sound.js';

export function initControllers() {
  const tabs       = document.querySelectorAll('.ctrl-tab');
  const panels     = document.querySelectorAll('.ctrl-panel');
  const chipImg    = document.querySelector('.chip-img-wrap img');
  const badge      = document.querySelector('.chip-badge');
  const pinDetails = document.getElementById('chip-pin-inspector');
  const subTabs    = document.querySelectorAll('.ctrl-subtab');
  const subPanels  = document.querySelectorAll('.ctrl-subpanel');
  const copyBtn    = document.getElementById('ctrl-copy-code');

  const controllerData = {
    stm32: {
      filter: 'hue-rotate(200deg) saturate(1.2) brightness(1.1)',
      badge:  'STM32F103 · 72MHz',
      color:  '#4a90d9',
      arch:   'ARM Cortex-M3 (32-bit)',
      flash:  '64 / 128 KB',
      sram:   '20 KB',
      code: `// Enable GPIOA & USART1 clock in APB2 bus
RCC->APB2ENR |= RCC_APB2ENR_IOPAEN | RCC_APB2ENR_USART1EN;

// Configure PA9 (TX) as Alternate Function Push-Pull (50MHz)
GPIOA->CRH &= ~(0xF << 4);
GPIOA->CRH |=  (0xB << 4);

// Configure PA10 (RX) as Input Floating
GPIOA->CRH &= ~(0xF << 8);
GPIOA->CRH |=  (0x4 << 8);

// Set Baud rate: 72 MHz / (16 * 115200) = 39.0625 -> BRR = 0x271
USART1->BRR = 0x271;
USART1->CR1 = USART_CR1_TE | USART_CR1_RE | USART_CR1_UE;`,
      pins: [
        { pin: 'PA9', name: 'USART1_TX', desc: 'Bootloader & Telemetry Transmit' },
        { pin: 'PA10', name: 'USART1_RX', desc: 'Firmware Packet Stream (115200 8N1)' },
        { pin: 'PA5', name: 'SPI1_SCK', desc: 'High-speed Peripheral Clock (18 MHz)' },
        { pin: 'PB6', name: 'I2C1_SCL', desc: 'Sensors Bus Clock (400 kHz Fast-mode)' },
        { pin: 'PC13', name: 'LED_STATUS', desc: 'Diagnostic Heartbeat / Boot Jump LED' },
        { pin: 'BOOT0', name: 'BOOT_CFG', desc: 'High for System Bootloader / Low for Flash' },
      ],
    },
    esp32: {
      filter: 'hue-rotate(130deg) saturate(1.5) brightness(1.0)',
      badge:  'ESP32-WROOM · 240MHz',
      color:  '#6fe3c1',
      arch:   'Xtensa 32-bit LX6 Dual-Core',
      flash:  '4 MB SPI Flash',
      sram:   '520 KB',
      code: `const uart_config_t uart_config = {
    .baud_rate = 115200,
    .data_bits = UART_DATA_8_BITS,
    .parity    = UART_PARITY_DISABLE,
    .stop_bits = UART_STOP_BITS_1,
    .flow_ctrl = UART_HW_FLOWCTRL_DISABLE
};
uart_param_config(UART_NUM_2, &uart_config);
uart_set_pin(UART_NUM_2, GPIO_NUM_17, GPIO_NUM_16, UART_PIN_NO_CHANGE, UART_PIN_NO_CHANGE);
uart_driver_install(UART_NUM_2, 2048, 2048, 10, &uart_queue, 0);`,
      pins: [
        { pin: 'GPIO1', name: 'U0TXD', desc: 'Console Debug Log Output' },
        { pin: 'GPIO3', name: 'U0RXD', desc: 'Console Command Input' },
        { pin: 'GPIO16', name: 'U2RXD', desc: 'Hardware UART to STM32 TX' },
        { pin: 'GPIO17', name: 'U2TXD', desc: 'Hardware UART to STM32 RX' },
        { pin: 'GPIO21', name: 'SDA', desc: 'I2C Data line for external sensors' },
        { pin: 'EN', name: 'CHIP_EN', desc: 'Active High Chip Enable' },
      ],
    },
    pic: {
      filter: 'hue-rotate(300deg) saturate(0.8) brightness(1.2)',
      badge:  'PIC16F877A · 20MHz',
      color:  '#d6a933',
      arch:   'Microchip 8-bit RISC',
      flash:  '14.3 KB',
      sram:   '368 Bytes',
      code: `// Configure ADCON1: Port A analog, reference = VDD
ADCON1 = 0b00000100;
TRISA0 = 1; // RA0 input for probe
TRISD2 = 0; // RD2 output for pump relay

unsigned int read_level(void) {
    ADCON0bits.CHS = 0b000; // Select Channel 0
    ADCON0bits.GO = 1;      // Start conversion
    while (ADCON0bits.GO);  // Wait for ADC complete
    return ((ADRESH << 8) | ADRESL);
}`,
      pins: [
        { pin: 'RA0', name: 'AN0', desc: 'Analog Water Level Probe Sensor' },
        { pin: 'RB0', name: 'INT0', desc: 'External Emergency Cut-off Interrupt' },
        { pin: 'RC6', name: 'TX', desc: 'EUSART Serial Telemetry' },
        { pin: 'RD2', name: 'RELAY_CTRL', desc: 'High-Current Pump Contactor Driver' },
        { pin: 'RE0', name: 'DRY_RUN', desc: 'Dry-run sensing probe input' },
        { pin: 'OSC1', name: 'XTAL_IN', desc: '20 MHz Crystal Oscillator Input' },
      ],
    },
    nuvoton: {
      filter: 'hue-rotate(0deg) saturate(1.2) brightness(0.9)',
      badge:  'Nuvoton M051 · 50MHz',
      color:  '#d6b266',
      arch:   '8051 / ARM Cortex-M0',
      flash:  '32 / 64 KB',
      sram:   '4 KB',
      code: `SYS_UnlockReg();
// Enable Watchdog Timer clock
CLK_EnableModuleClock(WDT_MODULE);
CLK_SetModuleClock(WDT_MODULE, CLK_CLKSEL1_WDTSEL_LIRC, 0);

// Set Watchdog timeout to 1.6 seconds & enable interrupt
WDT_Open(WDT_TIMEOUT_2POW16, WDT_RESET_DELAY_1026CLK, TRUE, FALSE);
SYS_LockReg();`,
      pins: [
        { pin: 'P1.0', name: 'AIN0', desc: 'Multi-level Liquid Resistance Probe' },
        { pin: 'P2.1', name: 'PWM0', desc: 'Motor Soft-Start Ramp Controller' },
        { pin: 'P3.0', name: 'RXD0', desc: 'RS-485 Modbus Serial Receiver' },
        { pin: 'P3.1', name: 'TXD0', desc: 'RS-485 Modbus Serial Driver' },
        { pin: 'P4.4', name: 'WDT_TMR', desc: 'Hardware Watchdog Tick Reset' },
        { pin: 'P0.4', name: 'RELAY_OUT', desc: 'Solenoid Valve Power Switch' },
      ],
    },
  };

  let currentId = 'stm32';

  function renderPins(d) {
    if (!pinDetails) return;
    pinDetails.innerHTML = '';
    d.pins.forEach((p, idx) => {
      const btn = document.createElement('button');
      btn.className = 'pin-chip-btn' + (idx === 0 ? ' active' : '');
      btn.innerHTML = `<strong>${p.pin}</strong> <span>${p.name}</span><small>${p.desc}</small>`;
      btn.addEventListener('click', () => {
        playRelayClick();
        pinDetails.querySelectorAll('.pin-chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
      pinDetails.appendChild(btn);
    });
  }

  function renderCode(d) {
    const codeEl = document.getElementById('ctrl-code-snippet');
    if (codeEl) codeEl.textContent = d.code;
  }

  function activate(id) {
    playRelayClick();
    currentId = id;
    tabs.forEach(t => t.classList.toggle('active', t.dataset.ctrl === id));
    panels.forEach(p => p.classList.toggle('active', p.id === `ctrl-${id}`));
    const d = controllerData[id];
    if (chipImg && d) {
      chipImg.style.filter = d.filter;
      chipImg.style.boxShadow = `0 0 40px ${d.color}44`;
    }
    if (badge && d) badge.textContent = d.badge;
    if (d) {
      renderPins(d);
      renderCode(d);
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activate(tab.dataset.ctrl));
  });

  subTabs.forEach(st => {
    st.addEventListener('click', () => {
      playRelayClick();
      const target = st.dataset.subtab;
      subTabs.forEach(b => b.classList.toggle('active', b.dataset.subtab === target));
      subPanels.forEach(p => p.classList.toggle('active', p.id === `subpanel-${target}`));
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const d = controllerData[currentId];
      if (d) {
        navigator.clipboard.writeText(d.code);
        const original = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied C Code';
        setTimeout(() => { copyBtn.textContent = original; }, 2000);
      }
    });
  }

  activate('stm32');
}
