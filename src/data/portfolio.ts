import fotaImg from "@/assets/proj-fota.webp.asset.json";
import starImg from "@/assets/proj-star.webp.asset.json";
import waterImg from "@/assets/proj-water.webp.asset.json";
import vehicleImg from "@/assets/proj-vehicle.webp.asset.json";
import smarthomeImg from "@/assets/proj-smarthome.webp.asset.json";
import weatherImg from "@/assets/proj-weather.webp.asset.json";

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
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export const stats = [
  { num: "6+", label: "Projects shipped" },
  { num: "9+", label: "MCU families" },
  { num: "3", label: "Certifications" },
  { num: "3+", label: "Years experience" },
];

export type Controller = {
  id: string;
  name: string;
  arch: string;
  badge: string;
  hue: string;
  description: string;
  cert?: string;
  protocols: string[];
};

export const controllers: Controller[] = [
  {
    id: "stm32",
    name: "STM32",
    arch: "ARM Cortex-M",
    badge: "STM32F103",
    hue: "hue-rotate(200deg) saturate(1.2) brightness(1.1)",
    description:
      "FOTA with ESP32 fetching firmware wirelessly and STM32 updating over UART; bare-metal programming, fault handling, task scheduling; STM32Cube IDE.",
    cert: "ARM Microcontrollers certified",
    protocols: ["UART", "SPI", "I2C", "GPIO", "IWDG", "DMA"],
  },
  {
    id: "esp32",
    name: "ESP32",
    arch: "Xtensa LX6",
    badge: "ESP32-WROOM",
    hue: "hue-rotate(130deg) saturate(1.5)",
    description:
      "Wireless firmware retrieval for FOTA; connecting systems to web dashboards for monitoring and control; BLE; IoT applications.",
    protocols: ["BLE", "Wi-Fi", "UART", "I2C", "SPI"],
  },
  {
    id: "pic",
    name: "PIC",
    arch: "Microchip",
    badge: "PIC16F877A",
    hue: "hue-rotate(300deg) saturate(0.8) brightness(1.2)",
    description:
      "Fully automatic water level controllers with dry-run protection; Embedded C; MPLAB X IDE.",
    cert: "PIC Microcontroller certified",
    protocols: ["UART", "I2C", "ADC", "Timer", "Relay"],
  },
  {
    id: "nuvoton",
    name: "Nuvoton",
    arch: "8051 / Cortex-M0",
    badge: "Nuvoton M051",
    hue: "saturate(1.2) brightness(0.95)",
    description:
      "Second controller family behind the water level controller products installed and deployed at Xpert Automatix.",
    protocols: ["UART", "GPIO", "PWM", "I2C"],
  },
];

export const alsoWorkedWith = ["ESP8266", "ESP-01", "Arduino", "MSP430", "CC3200"];

export type Project = {
  slug: string;
  tag: string;
  title: string;
  summary: string;
  img: string;
  imgAlt: string;
  problem: string;
  hardware: string;
  firmware: string;
  outcome: string;
  stack: string[];
};

export const projects: Project[] = [
  {
    slug: "fota",
    tag: "Firmware · OTA",
    title: "FOTA System with STM32",
    summary:
      "Wireless firmware updates via ESP32 over UART with CRC validation and a custom bootloader.",
    img: fotaImg.url,
    imgAlt: "STM32 board connected to an ESP32 module with a wireless signal",
    problem: "Field devices running STM32 needed firmware updates without physical access.",
    hardware: "STM32 (target), ESP32 (wireless updater), UART bus",
    firmware:
      "Custom STM32 bootloader; ESP32 fetches binary over Wi-Fi and pushes packets via UART at 115200 baud; CRC32 integrity check before application jump.",
    outcome: "Reliable OTA update pipeline for field-deployed STM32 devices.",
    stack: ["STM32", "ESP32", "UART", "CRC32", "Bootloader"],
  },
  {
    slug: "star",
    tag: "Network · IoT",
    title: "Star Topology Embedded System",
    summary: "Centralised data management with real-time web monitoring and control across 6 nodes.",
    img: starImg.url,
    imgAlt: "Central hub connected to six sensor nodes with a data dashboard",
    problem: "Centralised real-time monitoring of multiple sensor nodes with web visibility.",
    hardware: "Central hub controller, 6 sensor nodes, Wi-Fi module",
    firmware:
      "Star topology network; nodes report to hub; hub pushes to web dashboard for live monitoring and control.",
    outcome: "Live dashboard with control over every node from one hub.",
    stack: ["Wi-Fi", "Web dashboard", "Sensors"],
  },
  {
    slug: "water",
    tag: "Embedded · Product",
    title: "Water Level Controller",
    summary: "Fully automatic pump control with dry-run protection using PIC and Nuvoton MCUs.",
    img: waterImg.url,
    imgAlt: "Water tank with level probes, a controller box and a pump",
    problem: "Automate water pump control and protect the motor from dry-run damage.",
    hardware: "PIC and Nuvoton microcontrollers, level probes, relay, motor driver",
    firmware:
      "Embedded C; dual-threshold control; dry-run timer protection; deployed as a commercial product at Xpert Automatix.",
    outcome: "Installed at customer sites as a commercial product.",
    stack: ["PIC", "Nuvoton", "Embedded C", "Relay"],
  },
  {
    slug: "vehicle",
    tag: "IoT · Security",
    title: "Vehicle Theft Detection",
    summary: "Real-time alerts and remote engine locking via GSM for unauthorised movement.",
    img: vehicleImg.url,
    imgAlt: "Car with an IoT module, signal rings, a lock and a phone alert",
    problem: "Detect unauthorised vehicle movement and alert the owner in real time.",
    hardware: "IoT module, GPS, vibration sensor, GSM modem",
    firmware:
      "Interrupt-driven detection; GSM SMS + call alert; remote engine locking via SMS command.",
    outcome: "Owner is alerted instantly and can lock the engine remotely.",
    stack: ["GSM", "GPS", "Interrupts"],
  },
  {
    slug: "smarthome",
    tag: "IoT · Smart Home",
    title: "Smart Home Integration",
    summary: "IoT integration of smart bed and smart toilet with BLE + Wi-Fi app control.",
    img: smarthomeImg.url,
    imgAlt: "Smart bed and smart toilet linked by wireless signals",
    problem: "Automate a smart bed and smart toilet with IoT connectivity.",
    hardware: "ESP32/ESP8266, relay board, actuators",
    firmware: "Embedded integration; app-controlled via web dashboard; BLE + Wi-Fi connectivity.",
    outcome: "Both appliances controllable from a single app.",
    stack: ["ESP32", "BLE", "Wi-Fi", "Relays"],
  },
  {
    slug: "weather",
    tag: "IoT · Monitoring",
    title: "Weather Monitoring System",
    summary: "IoT-based real-time data collection with a web dashboard for analysis and forecasting.",
    img: weatherImg.url,
    imgAlt: "Weather station with sensors and a floating data chart",
    problem: "Collect real-time weather data and present forecasts on a dashboard.",
    hardware: "ESP32, temperature / humidity / pressure sensors",
    firmware: "IoT data pipeline; sensor readings posted to web dashboard; trend visualisation.",
    outcome: "Continuous weather readings with trend charts on the web.",
    stack: ["ESP32", "Sensors", "Dashboard"],
  },
];

export const experience = [
  {
    meta: "Current",
    role: "Embedded Developer",
    company: "Xpert Automatix · Coimbatore, Tamil Nadu",
    current: true,
    body: "Configure and manage network monitoring and performance analysis using SolarWinds to ensure 99% uptime and optimise performance and security. Developed and installed water level controller products using PIC and Nuvoton microcontrollers, ensuring efficient water management.",
  },
  {
    meta: "Internship · 15 days",
    role: "Embedded Systems Trainee",
    company: "e-Royce Motors India Pvt Ltd",
    current: false,
    body: "Gained hands-on experience in embedded systems development, contributing to practical learning and skill development in a professional automotive environment.",
  },
  {
    meta: "Freelance",
    role: "Technical Training Specialist",
    company: "Freelance",
    current: false,
    body: "Delivered technical training on robotics, embedded systems, IoT, PCB design and hardware debugging, specialising in advanced controllers such as STM32. Expertise in bare-metal programming, fault handling and task scheduling.",
  },
];

export const skillGroups = [
  { name: "Languages", items: ["Embedded C", "C", "C++", "Python", "SQL", "HTML", "CSS"] },
  {
    name: "Microcontrollers",
    items: ["STM32", "PIC", "ESP32", "ESP8266", "ESP-01", "Arduino", "Nuvoton", "MSP430", "CC3200"],
  },
  {
    name: "Development tools",
    items: [
      "STM32Cube IDE",
      "Keil IDE",
      "MPLAB X IDE",
      "Arduino IDE",
      "CCS",
      "KiCad",
      "Proteus 8",
      "Energia",
    ],
  },
  { name: "Protocols", items: ["UART", "I2C", "SPI", "USB", "GSM", "BLE", "RS232"] },
  {
    name: "Hardware",
    items: ["Circuit debugging", "PCB design", "Soldering", "Oscilloscope", "DMM"],
  },
];

export const certifications = ["ARM Microcontrollers", "PIC Microcontroller", "DBMS (NPTEL)"];

export const marqueeItems = [
  "STM32",
  "ESP32",
  "PIC",
  "Nuvoton",
  "Embedded C",
  "UART",
  "SPI",
  "I2C",
  "BLE",
  "FOTA",
  "Bootloaders",
  "KiCad",
  "MPLAB X",
  "STM32Cube",
  "GSM",
  "RS232",
];
