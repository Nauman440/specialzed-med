/**
 * Generates `static-site/services/equipment.html` from `web/src/pages/services/equipment.js`
 * (Figma layout) — paths are relative to `static-site/services/` (so base is "../").
 */
import fs from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { renderFooter, renderHeader } from "./partials/render-layout.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))

function img(file) {
  return `../images/figma-services/${file
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/")}`
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

const SPATCH_SPECS = [
  "4-in-1 monitoring system",
  "Supports Holter, Extended Holter, Event, and Telemetry (MCT)",
  "Live-streaming, real-time ECG data. Continuous, resilient real-time data streaming even in rural areas",
  "No manual uploading",
  "No data delays",
  "Dual-disk design: Disk 1 = 1.57 in diameter × 0.40 in thickness; Disk 2 = 1.41 in diameter × 0.24 in thickness",
  "Weight: 0.6 oz",
  "Battery lasts a minimum of 10 days",
  "Up to 30-day wear duration",
  "Water-resistant (IP55)",
  "Strong ECG clarity",
  "Precise P-Wave clarity",
  "Full Disclosure Holter Reports",
  "Advanced arrhythmia detection",
  "Encrypted data and secure reporting",
  "24/7 multilingual patient support",
  "Auto-generated billing templates",
  "Exclusive S-Patch reporting workflow: electronically review, interpret, date, and sign final reports",
  "Patient-friendly design",
]

const FEATURE_HIGHLIGHTS = [
  "Supports Holter, Extended Holter, Event Monitoring, and Telemetry (MCT)",
  "Simplified office workflow",
  "Designed for strong patient comfort and wearability",
  "Very small, lightweight dual-disk design—many patients forget they are wearing it",
  "Symptomatic vs. asymptomatic event clarity on reports",
  "No data delays",
  "Ideal for TAVR monitoring support",
  "Built for uninterrupted live-streaming performance across a wide range of patient environments, including rural areas",
]

const LEAD_SPECS = [
  "4-in-1 live-streaming monitoring system",
  "Supports Holter, Extended Holter, Event, and Telemetry (MCT)",
  "Live-streaming monitoring capability",
  "No manual uploading",
  "Dimensions: 4.2 in × 2.6 in × 0.8 in",
  "Weight: 4 oz (113 g)",
  "Battery must be changed every 2 days",
  "Up to 30-day wear duration",
  "Strong ECG clarity",
  "Precise P-Wave clarity",
  "Full Disclosure Holter Reports",
  "Advanced arrhythmia detection",
  "Encrypted data and secure reporting",
  "24/7 multilingual patient support",
  "Auto-generated billing templates",
]

const list = (items) =>
  items.map((line) => `<li>${escapeHtml(line)}</li>`).join("")

const main = `<main class="equipment-page equipment-page--figma" data-design="figma-21-1200">
    <section class="eq-hero" aria-labelledby="eq-hero-heading">
      <div class="figma-container">
        <a class="eq-hero__back" href="../services.html">
          <span class="eq-hero__back-dot" aria-hidden="true"></span>
          Our Services
        </a>
        <h1 id="eq-hero-heading" class="eq-hero__title">
          Monitoring Equipment
          <span class="eq-hero__title-accent">Options</span>
        </h1>
        <hr class="eq-hero__line" aria-hidden="true">
      </div>
    </section>

    <section class="eq-compare" aria-labelledby="eq-compare-heading">
      <div class="figma-container">
        <h2 id="eq-compare-heading" class="eq-compare__title">
          Compare monitoring systems
        </h2>
        <p class="eq-compare__sub">
          S-Patch is the <strong>primary featured system</strong>. Lead-Wire is available as a
          <strong>secondary / legacy option</strong>. Specifications differ and are shown separately below.
        </p>
        <div class="eq-compare__table" role="table" aria-label="Monitoring systems comparison">
          <div class="eq-compare__row eq-compare__row--head" role="row">
            <div class="eq-compare__cell eq-compare__cell--feature" role="columnheader"></div>
            <div class="eq-compare__cell" role="columnheader">S-Patch</div>
            <div class="eq-compare__cell" role="columnheader">Lead-Wire</div>
          </div>

          ${[
            ["Weight", "0.6 oz", "4 oz (113 g)"],
            ["Battery", "Minimum 10 days", "Change every 2 days"],
            ["Water resistance", "IP55", "Varies (see device specs)"],
            ["Workflow", "Enroll in web Portal → Hook Up → Disconnect", "Enroll in web Portal → Hook Up → Disconnect"],
            ["Positioning", "Primary featured system", "Secondary / legacy option"],
          ]
            .map(
              ([feature, sp, lw]) => `
          <div class="eq-compare__row" role="row">
            <div class="eq-compare__cell eq-compare__cell--feature" role="rowheader">${escapeHtml(feature)}</div>
            <div class="eq-compare__cell" role="cell">${escapeHtml(sp)}</div>
            <div class="eq-compare__cell" role="cell">${escapeHtml(lw)}</div>
          </div>`
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="eq-section" aria-labelledby="eq-spatch-heading">
      <div class="figma-container">
        <div class="eq-panel">
          <div class="eq-panel__split">
            <div class="eq-panel__copy">
              <h2 id="eq-spatch-heading" class="eq-panel__h2">
                S-Patch
                <span class="eq-panel__h2-accent">Monitoring System</span>
              </h2>
              <p class="eq-panel__tag">Primary Featured System</p>
              <p class="eq-panel__text">
                The S-Patch Monitoring System is Specialized Medical’s primary featured monitoring solution. It supports Holter, Extended Holter, Event Monitoring, and Telemetry (MCT) while delivering live-streaming, real-time ECG data through a compact, patient-friendly design.
              </p>
              <p class="eq-panel__text">
                Our platform is designed for continuous, resilient real-time data streaming across a wide range of patient environments, including rural areas. Data is sent live to our monitoring center—no manual uploading and no data delays.
              </p>
              <p class="eq-panel__text">
                A major advantage of the S-Patch Monitoring System is patient comfort and wearability. Its compact, lightweight dual-disk design is intended to make the monitor easier for patients to wear during normal daily life.
              </p>
            </div>
            <div class="eq-panel__media">
              <img
                src="${img("s-patch.jpg")}"
                alt="Patient wearing the S-Patch monitoring system"
                width="522"
                height="727"
                loading="eager"
                decoding="async"
              >
            </div>
          </div>
        </div>

        <hr class="eq-divider--red" aria-hidden="true">
        <div class="eq-cards">
          <div class="eq-card eq-card--spec">
            <h3 class="eq-card__title">Specifications</h3>
            <hr class="eq-card__rule" aria-hidden="true">
            <ul class="eq-list">${list(SPATCH_SPECS)}</ul>
          </div>
          <div class="eq-card eq-card--feat">
            <h3 class="eq-card__title">Feature Highlights</h3>
            <hr class="eq-card__rule" aria-hidden="true">
            <ul class="eq-list">${list(FEATURE_HIGHLIGHTS)}</ul>
          </div>
        </div>
      </div>
    </section>

    <section class="eq-section eq-section--lead" aria-labelledby="eq-lead-heading">
      <div class="figma-container">
        <div class="eq-panel">
          <div class="eq-panel__split eq-panel__split--lead">
            <div class="eq-panel__media">
              <img
                src="${img("lead-wire.jpg")}"
                alt="Patient wearing the lead-wire monitoring system"
                width="522"
                height="748"
                loading="lazy"
                decoding="async"
              >
            </div>
            <div class="eq-panel__copy">
              <h2 id="eq-lead-heading" class="eq-panel__h2">
                Lead-Wire
                <span class="eq-panel__h2-accent">Monitoring System</span>
              </h2>
              <p class="eq-panel__tag">Secondary / Legacy Monitoring Option</p>
              <p class="eq-panel__text">
                Lead-Wire remains available as an older secondary monitoring option where appropriate. It is shown separately so practices understand it is not the primary system being promoted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="eq-section eq-section--lead-spec" aria-labelledby="eq-lead-spec-heading">
      <div class="figma-container">
        <div class="eq-card eq-card--lead">
          <h3 id="eq-lead-spec-heading" class="eq-card__title">
            Lead-Wire Monitoring System Specifications
          </h3>
          <hr class="eq-card__rule" aria-hidden="true">
          <ul class="eq-list">${list(LEAD_SPECS)}</ul>
        </div>
      </div>
    </section>

    <section class="figma-section figma-cta svc-figma-cta" aria-labelledby="eq-cta-heading">
      <div class="figma-container">
        <div class="figma-cta__box">
          <h2 id="eq-cta-heading" class="figma-h2 figma-h2--center figma-h2--narrow">
            Start Your No-Risk<br>
            <span class="figma-h2__accent">Beta Trial</span>
          </h2>
          <p class="figma-cta__p figma-cta__p--about-italic">
            See how Specialized Medical can support your practice with: live-streaming ECG
            data; simplified office workflow.
          </p>
          <p class="figma-cta__p figma-cta__p--about-italic">
            Evaluate Specialized Medical with a small, no-obligation beta trial. If it isn’t
            the right fit, we’ll take everything back—no hassle.
          </p>
          <div class="figma-cta__actions">
            <a class="figma-btn figma-btn--solid" href="../contact.html">
              Start Your No-Risk Beta Trial
            </a>
            <a class="figma-cta__talk" href="../contact.html">
                Talk to our team →
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>`

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Monitoring Equipment Options | Specialized Medical</title>
  <meta name="description" content="S-Patch (primary) and Lead-Wire (secondary) monitoring systems—specifications, feature highlights, and equipment options for physician practices.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/global.css">
  <link rel="stylesheet" href="../css/home.css">
  <link rel="stylesheet" href="../css/services.css">
  <link rel="stylesheet" href="../css/equipment.css">
</head>
<body>
  <div class="site-root">
${renderHeader({ base: "../", active: "services" })}
${main}
${renderFooter({ base: "../" })}
  </div>
  <script src="../js/main.js" defer></script>
</body>
</html>`

const outDir = join(__dirname, "services")
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(join(outDir, "equipment.html"), html, "utf8")
console.log("Wrote services/equipment.html (Figma / Gatsby parity)")
