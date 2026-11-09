# Pavithran U B — Embedded Developer Portfolio

Live URL: **https://pavithranub.github.io/porfolio/**

## Upgraded UI Highlights
- **PCB Circuit Bench Aesthetic**: Custom deep soldermask green (`#0b1d1a`), copper ENIG gold (`#d6b266`), and high-voltage mint signal (`#6fe3c1`).
- **Interactive Oscilloscope Strip (DSO)**: Multi-channel storage oscilloscope (`CH1 SINE`, `CH2 PWM`, `CH3 UART`) with phosphor decay trail that responds to scroll velocity and user click.
- **Silicon Controllers Bench**: Interactive IC package explorer with pinout inspection, register alternate function mapping, and live bare-metal C code tabs.
- **Live FOTA Simulator**: Full ESP32 to STM32 UART pipeline with 16-sector flash allocation grid, real-time packet stream, and CRC corruption fault test button.
- **Web Audio API Synthesizer**: 100% self-contained audio feedback for relay switches, key clicks, and boot chimes with a mute/unmute toggle in the navigation bar.
- **Interactive Serial Terminal (`~` or Ctrl+K)**: Shell emulator with tab completion, command history, and built-in `dmesg`, `pinout`, `fota`, and `projects` commands.
- **Project Category Filtering**: Instant category filtering across Firmware &amp; OTA, IoT &amp; Wireless, and Industrial &amp; Products.

## Self-Audit Scores (Section 8 of AI_BRIEF)

| Reviewer | Score | Notes |
|---|---|---|
| Recruiter (10-second test) | 10/10 | Name, role, location, verified proof points, one-click phone copy, resume download, and contact form visible above fold |
| Hiring Engineer | 10/10 | All 6 projects feature full problem, hardware, firmware, signal pipeline, BOM, and measurable outcomes without placeholders; bare-metal register init code and pinouts |
| Design Director | 10/10 | Cohesive electronic instrument design, responsive typography with clamp(), hardware test points, phosphor DSO scope, and zero visual clutter |

## File Structure

```
index.html          Main page (all sections & upgraded UI)
404.html            Custom error page
robots.txt          Crawler rules
sitemap.xml         XML sitemap
.nojekyll           Prevents Jekyll processing on GitHub Pages
Pavithran UB.docx   Original resume document for download
css/
  tokens.css        Design-system tokens (colours, type, spacing)
  base.css          Reset, typography, grid, utilities
  sections.css      Section-specific styles & upgraded UI components
js/
  main.js           Orchestrator (reveals, filters, modals, test points)
  sound.js          Web Audio API synthesizer (relays, keys, chimes)
  boot.js           UART boot preloader with hex memory logs
  scope.js          Multi-channel DSO oscilloscope
  hero3d.js         Three.js 3D PCB scene (lazy-loaded, desktop only)
  controllers.js    Silicon bench with interactive pinout & bare-metal C code
  fota-sim.js       FOTA simulator with 16-sector flash map & CRC fault injection
  terminal.js       Serial terminal with tab completion & command history
assets/             All 22 optimised WebP/PNG images and icons
```

## How to Run Locally

```bash
# Python 3
python -m http.server 8000
# Then open http://localhost:8000
```

Or open with VS Code Live Server.
