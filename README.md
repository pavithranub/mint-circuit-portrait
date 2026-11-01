# Pavithran U B — Embedded Developer Portfolio

Live URL: **https://pavithranub.github.io/porfolio/**

## Self-audit scores (section 8 of AI_BRIEF)

| Reviewer | Score | Notes |
|---|---|---|
| Recruiter (10-second test) | 9/10 | Name, role, location, proof point and CTA all visible above fold |
| Hiring engineer | 7/10 | All 6 projects have problem/hardware/firmware/outcome; dates and some metrics still [PLACEHOLDER] |
| Design director | 8/10 | Consistent PCB bench system; boot preloader, scope strip, FOTA sim and 3D hero are the signature moments |

## File structure

```
index.html          Main page (all sections)
404.html            Custom error page
robots.txt          Crawler rules
sitemap.xml         XML sitemap
.nojekyll           Prevents Jekyll processing on Pages
css/
  tokens.css        Design-system tokens (colours, type, spacing)
  base.css          Reset, typography, grid, utilities
  sections.css      Section-specific styles
js/
  main.js           Orchestrator (imports all modules)
  boot.js           UART boot preloader
  scope.js          Oscilloscope canvas
  hero3d.js         Three.js 3D PCB scene (lazy-loaded, desktop only)
  controllers.js    Chip bench tab switcher
  fota-sim.js       FOTA simulator
  terminal.js       Serial terminal easter egg
assets/             All optimised images (do not regenerate)
```

## How to run locally

```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000
```

Or use VS Code Live Server extension.

## How to edit content

All editable text is in `index.html`. Search for `[PLACEHOLDER]` to find fields still needing your input:
- Role dates (Experience section)
- PSG college logo (`assets/` — supply the real PNG)
- Project outcome metrics

## Outstanding items

| Item | Status |
|---|---|
| Employment dates | [PLACEHOLDER] — add start/end for each role |
| PSG college logo | [PLACEHOLDER] — supply real logo file |
| Project outcome metrics | [PLACEHOLDER] — add counts, uptime, deployments |
| Optional extra projects | CONFIRM with owner before publishing |
| Professional photo | Optional — not generated |

## Deploying updates

```bash
git add -A
git commit -m "update: describe your change"
git push origin redesign
# then open / merge the pull request on GitHub
```
