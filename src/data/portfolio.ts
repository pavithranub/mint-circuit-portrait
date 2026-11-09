import fotaImg from "@/assets/proj-fota.webp.asset.json";
import starImg from "@/assets/proj-star.webp.asset.json";
import waterImg from "@/assets/proj-water.webp.asset.json";
import vehicleImg from "@/assets/proj-vehicle.webp.asset.json";
import smarthomeImg from "@/assets/proj-smarthome.webp.asset.json";
import weatherImg from "@/assets/proj-weather.webp.asset.json";

export function resolveAssetUrl(assetObj: unknown, fallbackFileName: string): string {
  if (typeof assetObj === "string") return assetObj;
  if (assetObj && typeof assetObj === "object" && "url" in assetObj) {
    const u = (assetObj as { url: string }).url;
    if (u && !u.startsWith("/__l5e/")) {
      return u;
    }
  }
  return `/assets/${fallbackFileName}`;
}

export const profile = {
  name: "Pavithran U B",
  role: "Embedded Developer",
  location: "Coimbatore, Tamil Nadu",
  email: "pavithranub2001@gmail.com",
  phone: "+919629595672",
  phoneDisplay: "+91 96295 95672",
  linkedin: "https://www.linkedin.com/in/pavithran-ub",
  github: "https://github.com/pavithranub",
  resume: "https://github.com/pavithranub/porfolio/raw/refs/heads/main/Pavithran%20UB.docx",
  source: "https://github.com/pavithranub/porfolio",
};

export const navLinks = [
  { id: "about", label: "About" },
  { id: "controllers", label: "MCUs" },
  { id: "projects", label: "Projects" },
  { id: "fota-sim", label: "FOTA Sim" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export const stats = [
  { num: "6+", label: "Projects shipped" },
  { num: "9+", label: "MCU families mastered" },
  { num: "3", label: "Industry Certifications" },
  { num: "3+", label: "Years hands-on experience" },
];

export type PinInfo = {
  pin: string;
  name: string;
  desc: string;
  type: "power" | "gpio" | "uart" | "spi" | "i2c" | "clock" | "debug";
};

export type Controller = {
  id: string;
  name: string;
  arch: string;
  badge: string;
  hue: string;
  clockSpeed: string;
  flash: string;
  sram: string;
  description: string;
  cert?: string;
  protocols: string[];
  keyPins: PinInfo[];
  codeSnippet: {
    title: string;
    code: string;
  };
};

export const controllers: Controller[] = [
  {
    id: "stm32",
    name: "STM32",
    arch: "ARM Cortex-M3 (32-bit)",
    badge: "STM32F103C8T6",
    hue: "hue-rotate(200deg) saturate(1.2) brightness(1.1)",
    clockSpeed: "72 MHz AHB",
    flash: "64 / 128 KB",
    sram: "20 KB",
    description:
      "Engineered FOTA updates where ESP32 downloads firmware over Wi-Fi and pushes binary to STM32 over UART; wrote custom bootloader, CRC32 verification, fault handlers, and multi-channel DMA tasks in STM32Cube IDE.",
    cert: "ARM Microcontrollers certified",
    protocols: ["UART", "SPI", "I2C", "GPIO", "IWDG", "DMA", "CAN", "PWM"],
    keyPins: [
      { pin: "PA9", name: "USART1_TX", desc: "Bootloader & Telemetry Transmit", type: "uart" },
      { pin: "PA10", name: "USART1_RX", desc: "Firmware Packet Stream", type: "uart" },
      { pin: "PA5", name: "SPI1_SCK", desc: "High-speed Peripheral Bus (18 MHz)", type: "spi" },
      { pin: "PB6", name: "I2C1_SCL", desc: "Sensors Bus Clock (400 kHz Fast-mode)", type: "i2c" },
      { pin: "PC13", name: "LED_STATUS", desc: "Diagnostic Heartbeat / Boot Jump LED", type: "gpio" },
      { pin: "BOOT0", name: "BOOT_CFG", desc: "High for System Bootloader / Low for Flash", type: "debug" },
      { pin: "NRST", name: "RESET", desc: "Hardware Reset Line with debounce", type: "debug" },
      { pin: "VDD", name: "3.3V IN", desc: "Main Power Supply Line", type: "power" },
    ],
    codeSnippet: {
      title: "STM32 USART1 Bare-Metal Init (Registers)",
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
    },
  },
  {
    id: "esp32",
    name: "ESP32",
    arch: "Xtensa 32-bit LX6 Dual-Core",
    badge: "ESP32-WROOM-32D",
    hue: "hue-rotate(130deg) saturate(1.5)",
    clockSpeed: "240 MHz",
    flash: "4 MB SPI Flash",
    sram: "520 KB",
    description:
      "Core wireless updater node for IoT pipelines. Fetches firmware updates over TLS/HTTPS, manages Wi-Fi station mode & Bluetooth Low Energy provisioning, and delivers validated payload bursts to host microcontrollers over UART at 115.2 kbps.",
    protocols: ["BLE 4.2", "Wi-Fi 802.11 b/g/n", "UART", "I2C", "SPI", "ADC"],
    keyPins: [
      { pin: "GPIO1", name: "U0TXD", desc: "Console Debug Log Output", type: "uart" },
      { pin: "GPIO3", name: "U0RXD", desc: "Console Command Input", type: "uart" },
      { pin: "GPIO16", name: "U2RXD", desc: "Hardware UART to STM32 TX", type: "uart" },
      { pin: "GPIO17", name: "U2TXD", desc: "Hardware UART to STM32 RX", type: "uart" },
      { pin: "GPIO21", name: "SDA", desc: "I2C Data line for external sensors", type: "i2c" },
      { pin: "GPIO22", name: "SCL", desc: "I2C Clock line", type: "i2c" },
      { pin: "EN", name: "CHIP_EN", desc: "Active High Chip Enable", type: "debug" },
      { pin: "3V3", name: "3.3V LDO", desc: "Regulated 3.3V System Rail", type: "power" },
    ],
    codeSnippet: {
      title: "ESP32 UART2 Init for STM32 FOTA (ESP-IDF)",
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
    },
  },
  {
    id: "pic",
    name: "PIC",
    arch: "Microchip 8-bit RISC",
    badge: "PIC16F877A",
    hue: "hue-rotate(300deg) saturate(0.8) brightness(1.2)",
    clockSpeed: "20 MHz",
    flash: "14.3 KB",
    sram: "368 Bytes",
    description:
      "Engineered commercial water level controller systems with automated pump start/stop and dry-run protection. Programmed in Embedded C using MPLAB X IDE with robust hardware debounce and ADC probe reading.",
    cert: "PIC Microcontroller certified",
    protocols: ["UART", "I2C", "ADC (10-bit)", "Timers", "Relay Control"],
    keyPins: [
      { pin: "RA0", name: "AN0", desc: "Analog Water Level Probe Sensor", type: "gpio" },
      { pin: "RB0", name: "INT0", desc: "External Emergency Cut-off Interrupt", type: "gpio" },
      { pin: "RC6", name: "TX", desc: "EUSART Serial Telemetry", type: "uart" },
      { pin: "RC7", name: "RX", desc: "EUSART Command Receiver", type: "uart" },
      { pin: "RD2", name: "RELAY_CTRL", desc: "High-Current Pump Contactor Driver", type: "gpio" },
      { pin: "RE0", name: "DRY_RUN", desc: "Dry-run detection sensing probe", type: "gpio" },
      { pin: "OSC1", name: "XTAL_IN", desc: "20 MHz Crystal Oscillator Input", type: "clock" },
      { pin: "VSS", name: "GND", desc: "Ground Reference Pad", type: "power" },
    ],
    codeSnippet: {
      title: "PIC16F877A Dry-Run Protection & ADC Sensing (MPLAB XC8)",
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
    },
  },
  {
    id: "nuvoton",
    name: "Nuvoton",
    arch: "8051 / ARM Cortex-M0",
    badge: "Nuvoton M051 / MS51",
    hue: "saturate(1.2) brightness(0.95)",
    clockSpeed: "50 MHz",
    flash: "32 / 64 KB",
    sram: "4 KB",
    description:
      "Second controller family behind high-volume industrial water level controllers and automation units installed across customer sites at Xpert Automatix. Features high-immunity noise filtering and watchdog recovery.",
    protocols: ["UART", "GPIO", "PWM", "I2C", "Hardware Watchdog"],
    keyPins: [
      { pin: "P1.0", name: "AIN0", desc: "Multi-level Liquid Resistance Probe", type: "gpio" },
      { pin: "P2.1", name: "PWM0", desc: "Motor Soft-Start Ramp Controller", type: "gpio" },
      { pin: "P3.0", name: "RXD0", desc: "RS-485 Modbus Serial Receiver", type: "uart" },
      { pin: "P3.1", name: "TXD0", desc: "RS-485 Modbus Serial Driver", type: "uart" },
      { pin: "P4.4", name: "WDT_TMR", desc: "Hardware Watchdog Tick Reset", type: "debug" },
      { pin: "P0.4", name: "RELAY_OUT", desc: "Solenoid Valve Power Switch", type: "gpio" },
      { pin: "XTAL1", name: "HXT_IN", desc: "12 MHz External Crystal Input", type: "clock" },
      { pin: "VDD", name: "5V TOL", desc: "Wide 2.5V–5.5V Supply Input", type: "power" },
    ],
    codeSnippet: {
      title: "Nuvoton Cortex-M0 Watchdog & Brownout Protection (Keil)",
      code: `SYS_UnlockReg();
// Enable Watchdog Timer clock
CLK_EnableModuleClock(WDT_MODULE);
CLK_SetModuleClock(WDT_MODULE, CLK_CLKSEL1_WDTSEL_LIRC, 0);

// Set Watchdog timeout to 1.6 seconds & enable interrupt
WDT_Open(WDT_TIMEOUT_2POW16, WDT_RESET_DELAY_1026CLK, TRUE, FALSE);
SYS_LockReg();`,
    },
  },
];

export const alsoWorkedWith = ["ESP8266", "ESP-01", "Arduino Uno/Nano", "MSP430", "CC3200 SimpleLink"];

export type Project = {
  slug: string;
  tag: string;
  category: "firmware" | "iot" | "industrial";
  title: string;
  summary: string;
  img: string;
  imgAlt: string;
  problem: string;
  hardware: string;
  firmware: string;
  outcome: string;
  stack: string[];
  metrics: string[];
  architecture: string;
  bom: string[];
};

export const projects: Project[] = [
  {
    slug: "fota",
    tag: "Firmware · OTA Architecture",
    category: "firmware",
    title: "FOTA System with STM32",
    summary:
      "Wireless firmware updates via ESP32 over UART with CRC-32 validation and a custom flash bootloader.",
    img: resolveAssetUrl(fotaImg, "proj-fota.webp"),
    imgAlt: "STM32 board connected to an ESP32 module with wireless signal traces",
    problem:
      "Field devices running STM32 microcontrollers in enclosed industrial enclosures needed reliable firmware updates without physical disassembly, SWD programmer attachment, or downtime risks.",
    hardware: "STM32F103 (target MCU), ESP32-WROOM-32 (wireless receiver), UART serial bridge, dual LDO rails",
    firmware:
      "Custom two-stage STM32 bootloader in sector 0; ESP32 connects via Wi-Fi to firmware server, chunks binary into 3 KB payload frames, sends over UART at 115200 baud with packet sequence numbering; STM32 computes running CRC-32 and performs atomic vector table relocation jump to application space.",
    outcome:
      "Zero bricked units in testing, rock-solid CRC error rejection with automatic rollback, cut maintenance dispatch time by 90%.",
    stack: ["STM32", "ESP32", "UART", "CRC32", "Custom Bootloader", "Cortex-M3"],
    metrics: [
      "115,200 baud UART pipeline",
      "CRC-32 hardware polynomial verification",
      "Atomic dual-bank jump without programmer",
      "Automatic rollback upon checksum mismatch",
    ],
    architecture:
      "Firmware Server (Cloud) ──[HTTPS/Wi-Fi]──> ESP32 Stage ──[115200 8N1 UART]──> Custom Bootloader (STM32 Flash Sector 0) ──[CRC32 Verify]──> Relocate VTOR ──> Jump to 0x08004000 (App Space)",
    bom: ["STM32F103C8T6", "ESP32-WROOM-32D", "AMS1117-3.3V LDO", "Status LEDs", "UART Level Clamping"],
  },
  {
    slug: "star",
    tag: "Network · IoT System",
    category: "iot",
    title: "Star Topology Embedded Network",
    summary:
      "Centralised data hub coordinating 6 distributed sensor nodes with live web telemetry and remote actuator control.",
    img: resolveAssetUrl(starImg, "proj-star.webp"),
    imgAlt: "Central hub connected to six sensor nodes with an interactive data dashboard",
    problem:
      "Industrial facility required real-time sensor monitoring across 6 distinct machine zones without expensive rewiring or proprietary cloud lock-in.",
    hardware: "Central hub controller, 6 wireless sensor satellite nodes, Wi-Fi gateway module, ADC condition stages",
    firmware:
      "Deterministic polling and event-driven star topology; lightweight packet protocol with frame delimiter and parity; centralized telemetry aggregation with sub-second web sockets dispatch to dashboard.",
    outcome:
      "Continuous synchronized logging across all 6 zones with zero telemetry packet loss under high EMI factory environments.",
    stack: ["Wi-Fi", "Web Sockets", "Star Topology", "Embedded C", "Sensors"],
    metrics: [
      "6 simultaneous active nodes",
      "Sub-200ms node-to-cloud telemetry latency",
      "Fault isolation: offline node does not stall network",
      "Real-time bidirectional relay actuation",
    ],
    architecture:
      "Satellite Nodes [Zone 1..6] ──[Wireless RF/Wi-Fi]──> Central Hub MCU ──[JSON/TCP]──> Web Telemetry Engine ──[WebSockets]──> Operator Console",
    bom: ["ESP32 Central Gateway", "Satellite Sensor Modules", "LM35 & Hall Sensors", "Status OLED Display"],
  },
  {
    slug: "water",
    tag: "Embedded Product · Industrial",
    category: "industrial",
    title: "Automatic Water Level Controller",
    summary:
      "Commercial dual-threshold pump controller with dry-run protection and sensor electrode debounce deployed at customer sites.",
    img: resolveAssetUrl(waterImg, "proj-water.webp"),
    imgAlt: "Water tank with stainless level probes, electronic controller enclosure and motor contactor",
    problem:
      "Frequent pump burnout caused by dry-running when underground sumps ran dry, plus overflow wastage and erratic relay chatter caused by water ripples.",
    hardware: "PIC16F877A / Nuvoton M051 microcontrollers, stainless conductive level probes, opto-isolated relay drivers",
    firmware:
      "State-machine controller with hysteresis logic; dry-run timer safety cutoff (detects no current draw or water contact within 45s); digital filter debounces wave ripples; non-volatile EEPROM event logging.",
    outcome:
      "Commercial product actively deployed and installed across residential and commercial customer installations by Xpert Automatix.",
    stack: ["PIC16F877A", "Nuvoton M051", "Embedded C", "Opto-Isolation", "Dry-Run Safety"],
    metrics: [
      "100% pump burnout prevention via dry-run detection",
      "5-second ripple debounce prevents relay chatter",
      "Installed at commercial customer facilities",
      "Over 99% operational reliability record",
    ],
    architecture:
      "Stainless Probes [High/Low/Sump] ──> Optocoupler Isolation ──> ADC Input Pins ──> State Machine & Timer Check ──> High-Current Relay ──> Motor Contactor",
    bom: ["PIC16F877A / Nuvoton MCU", "PC817 Optocouplers", "12V Sugar Cube Relays", "Surge Varistors", "Transformerless Power Stage"],
  },
  {
    slug: "vehicle",
    tag: "Security · Automotive IoT",
    category: "iot",
    title: "Vehicle Theft Detection & Remote Lock",
    summary:
      "Instant GSM SMS / voice alert trigger upon unauthorized motion with remote ignition kill switch via encrypted SMS command.",
    img: resolveAssetUrl(vehicleImg, "proj-vehicle.webp"),
    imgAlt: "Automobile with IoT security module, signal rings, security lock and smartphone alert",
    problem:
      "Commercial fleets and private vehicles needed low-cost immediate intrusion detection without relying on smartphone internet data connectivity in dead zones.",
    hardware: "Microcontroller unit, SIM800L GSM/GPRS modem, NEO-6M GPS receiver, SW-420 vibration sensor, ignition relay",
    firmware:
      "Low-power interrupt sleep state; vibration sensor fires external hardware interrupt; awakens MCU to parse NMEA GPS coordinates; issues AT commands to GSM modem for instant voice call + SMS coordinates; accepts authenticated engine immobilizer command.",
    outcome:
      "Sub-5-second alert delivery to owner phone with vehicle location map coordinates and immediate remote ignition disable.",
    stack: ["GSM SIM800L", "GPS NEO-6M", "Interrupt Architecture", "Embedded C", "Automotive"],
    metrics: [
      "< 5s alarm transmission from tamper trigger",
      "100% off-grid operation using 2G SMS/Voice",
      "Fail-safe ignition relay isolation",
      "Ultra-low standby battery draw (< 12mA)",
    ],
    architecture:
      "Vibration Sensor ──[EXTI Trigger]──> MCU Wakeup ──> NEO-6M GPS NMEA Parse ──> SIM800L AT Command Stack ──[Cellular Tower]──> Owner Phone",
    bom: ["Microcontroller Core", "SIM800L Cellular Modem", "NEO-6M GPS", "SW-420 Vibration Sensor", "Automotive Sealed Relay"],
  },
  {
    slug: "smarthome",
    tag: "IoT · Home Automation",
    category: "iot",
    title: "Connected Smart Furniture Automation",
    summary:
      "BLE and Wi-Fi IoT integration of mechanized smart bed incline and sanitary fixtures with web and mobile control.",
    img: resolveAssetUrl(smarthomeImg, "proj-smarthome.webp"),
    imgAlt: "Smart adjustable bed and smart sanitary fixture linked with wireless signals",
    problem:
      "Custom luxury healthcare / hospitality furniture needed intuitive remote control for patients and guests without clunky wired handheld pendants.",
    hardware: "ESP32 dual-core SoC, multi-channel linear actuator relay board, limit microswitches, touch capacitive pads",
    firmware:
      "Concurrent BLE GATT server and lightweight HTTP/REST web server on FreeRTOS tasks; position calibration using software timing and limit switches; smooth ramp-up/ramp-down motor control.",
    outcome:
      "Seamless wireless control via mobile app and web dashboard with zero interference and full physical manual override safety.",
    stack: ["ESP32", "BLE GATT", "Wi-Fi REST", "FreeRTOS", "Motor Actuation"],
    metrics: [
      "Dual wireless interface: BLE + Local Wi-Fi",
      "Safe position limit cutoffs in firmware",
      "Independent dual-core task separation",
      "Instant responsiveness (< 50ms BLE latency)",
    ],
    architecture:
      "Mobile App / Web UI ──[BLE 4.2 / Wi-Fi]──> ESP32 FreeRTOS (Task 1: Comm, Task 2: Motor State) ──> Opto-Relays ──> Linear Actuators",
    bom: ["ESP32 Dual-Core", "4-Channel Relay Module", "Linear Actuators", "End-stop Limit Switches", "MeanWell 12V PSU"],
  },
  {
    slug: "weather",
    tag: "Sensors · Environmental IoT",
    category: "iot",
    title: "IoT Weather Telemetry Station",
    summary:
      "Precision meteorological monitoring system logging barometric pressure, ambient temperature and humidity with trend forecasting.",
    img: resolveAssetUrl(weatherImg, "proj-weather.webp"),
    imgAlt: "Environmental monitoring station with weather sensors and floating real-time telemetry graphs",
    problem:
      "Local agricultural micro-climate monitoring required autonomous weather data collection with continuous graphical analytics.",
    hardware: "ESP32 controller, BME280 precision digital sensor, light-dependent solar sensor, rain gauge switch",
    firmware:
      "I2C driver communication with BME280 sensor; calibration coefficients arithmetic; deep-sleep timer intervals for battery longevity; cloud REST API JSON telemetry payload dispatcher.",
    outcome:
      "Reliable 24/7 environmental logging with interactive web trend charts and storm prediction pressure drop alerts.",
    stack: ["ESP32", "I2C Protocol", "BME280", "Deep Sleep", "Cloud Analytics"],
    metrics: [
      "Precision readings: ±0.5°C temp, ±3% humidity",
      "Deep sleep power consumption < 15 µA",
      "Continuous 24-hour barometric trend analysis",
      "Automated rain and sudden pressure-drop alerts",
    ],
    architecture:
      "BME280 [I2C 400kHz] ──> ESP32 Calibration Math ──[Wi-Fi REST]──> Telemetry Backend ──> Chart Dashboard",
    bom: ["ESP32-WROOM", "BME280 Sensor (I2C)", "Solar Cell + 18650 Battery", "TP4056 Charger", "IP65 Weatherproof Enclosure"],
  },
];

export const experience = [
  {
    meta: "Current Role",
    role: "Embedded Developer",
    company: "Xpert Automatix · Coimbatore, Tamil Nadu",
    current: true,
    body: "Configure and manage network monitoring and performance analysis using SolarWinds to ensure 99% uptime and optimise performance and security. Engineered and installed commercial water level controller products utilizing PIC and Nuvoton microcontrollers with dry-run protection and fail-safe relay switching.",
  },
  {
    meta: "Automotive Internship · 15 Days",
    role: "Embedded Systems Trainee",
    company: "e-Royce Motors India Pvt Ltd",
    current: false,
    body: "Gained hands-on experience in automotive embedded systems development, motor controller communication protocols, EV battery telemetry monitoring, and production PCB inspection.",
  },
  {
    meta: "Freelance Specialist",
    role: "Technical Training Specialist",
    company: "Freelance Embedded Systems Educator",
    current: false,
    body: "Delivered comprehensive hands-on technical training on robotics, embedded C, IoT protocols, KiCad PCB layout, and hardware debugging. Specialized in STM32 ARM Cortex-M architecture, bare-metal register programming, NVIC interrupt handling, and timer PWM.",
  },
];

export const skillGroups = [
  {
    name: "Languages",
    items: ["Embedded C", "C", "C++", "Python", "SQL", "HTML5", "CSS3 / Tailwind"],
  },
  {
    name: "Microcontrollers & SoCs",
    items: ["STM32 (Cortex-M3/M4)", "PIC16F / PIC18F", "ESP32 (Dual-Core)", "ESP8266 / ESP-01", "Nuvoton (M051/MS51)", "Arduino (AVR)", "MSP430", "CC3200"],
  },
  {
    name: "IDE & Toolchains",
    items: [
      "STM32Cube IDE",
      "Keil µVision",
      "MPLAB X IDE",
      "Arduino IDE",
      "Code Composer Studio (CCS)",
      "KiCad EDA",
      "Proteus 8 Circuit Simulation",
      "Energia",
    ],
  },
  {
    name: "Protocols & Busses",
    items: ["UART / USART", "I2C (Fast Mode)", "SPI (Master/Slave)", "USB CDC", "GSM / GPRS (AT Commands)", "BLE 4.2", "RS232 / RS485", "CAN Bus"],
  },
  {
    name: "Hardware Lab & Debugging",
    items: ["Digital Storage Oscilloscope", "Digital Multimeter (DMM)", "Logic Analyzer", "SMD Soldering & Rework", "PCB Layout & Routing", "Hardware Fault Isolation"],
  },
];

export const certifications = [
  { title: "ARM Microcontrollers", issuer: "Hands-on Architecture & Bare-Metal Programming" },
  { title: "PIC Microcontroller", issuer: "Microchip Embedded Systems Specialization" },
  { title: "Database Management Systems (DBMS)", issuer: "NPTEL Certified" },
];

export const marqueeItems = [
  "STM32 CORTEX-M",
  "ESP32 WI-FI / BLE",
  "PIC16F877A",
  "NUVOTON M051",
  "BARE-METAL EMBEDDED C",
  "FOTA OVER-THE-AIR",
  "BOOTLOADER DESIGN",
  "UART 115200",
  "SPI BUS",
  "I2C PROTOCOL",
  "KICAD PCB DESIGN",
  "MPLAB X IDE",
  "STM32CUBE IDE",
  "HARDWARE DEBUGGING",
  "OSCILLOSCOPE & DMM",
  "SOLARWINDS 99% UPTIME",
];
