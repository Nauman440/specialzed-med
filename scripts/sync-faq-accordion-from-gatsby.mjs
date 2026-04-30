/**
 * Sync static-site/faq.html FAQ accordion content from Gatsby source-of-truth.
 *
 * Why this exists:
 * - Gatsby FAQ questions/answers changed
 * - static-site/faq.html had older question set + different wording
 *
 * This script replaces ONLY the accordion section contents (not header/footer).
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, "..", "..")

const staticFaqPath = path.join(repoRoot, "static-site", "faq.html")

const START = '<section class="figma-section faq-accordion" aria-label="FAQ topics">'
const END = '<section class="figma-section faq-testimonials" aria-labelledby="testimonials-heading">'

function faqAccordionSvg(isOpen) {
  return `<svg class="faq-item__chevron${isOpen ? " is-open" : ""}" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
}

const SECTIONS = [
  {
    title: "How It Works",
    items: [
      {
        q: "How does the office workflow work?",
        a: "Your medical assistant completes a simple 3-step process: Enroll in web Portal → Hook Up → Disconnect (Under 15 Minutes). The workflow is designed to be straightforward for office staff and easy to repeat across patients. Once the patient is enrolled and leaves the office, Specialized Medical takes over the rest with continuous monitoring, real-time alerts, report generation, and patient support.",
      },
      {
        q: "How long does setup take?",
        a: "In most cases, setup takes under 15 minutes. The process is designed to fit into normal office workflow without adding unnecessary burden to staff.",
      },
      {
        q: "What happens after the patient leaves?",
        a: "Once the patient leaves, Specialized Medical manages the active monitoring process for you. That includes 24/7 live monitoring across all test types, real-time arrhythmia alerts by email, text, or phone call, automatic generation and delivery of final reports, and patient support through our 24/7 multilingual call center.",
      },
      {
        q: "How are alerts delivered?",
        a: "Real-time arrhythmia alerts are delivered by email, text, or phone call, helping practices receive important findings quickly and respond appropriately.",
      },
    ],
  },
  {
    title: "Reports and Data",
    items: [
      {
        q: "Are reports EMR-ready?",
        a: "Yes. Final reports are EMR-ready and can be automatically pushed into your system. Reports are typically delivered within 24–48 hours after test completion, supporting faster physician review and a more efficient office workflow.",
      },
      {
        q: "Can physicians electronically review, interpret, date, and sign reports?",
        a: "Yes. Our workflow supports electronic physician review, interpretation, dating, and signature of final reports.",
      },
      {
        q: "How are symptomatic vs. asymptomatic events shown?",
        a: "Symptoms are entered digitally during the test and automatically appear on the final report above the matching ECG strips, making symptomatic vs. asymptomatic events immediately clear.",
      },
      {
        q: "Is data live, or is it uploaded later?",
        a: "Data is transmitted live to our monitoring center with no manual uploading and no data delays.",
      },
    ],
  },
  {
    title: "Billing and Reimbursement",
    items: [
      {
        q: "Are CPT and ICD-10 billing templates provided?",
        a: "Yes. Customized billing templates with CPT and ICD-10 codes are provided to support efficient billing workflow.",
      },
      {
        q: "Do you work with billing staff or third-party billers?",
        a: "Yes. We work directly with your billing staff or third-party biller to support seamless claims submission.",
      },
      {
        q: "What is the reimbursement potential?",
        a: "Practices routinely receive gross reimbursements exceeding $875.00 for a Holter test followed by a Telemetry test, based on current Medicare rates.",
      },
    ],
  },
  {
    title: "Supplies and Equipment",
    items: [
      {
        q: "What monitoring equipment does Specialized Medical use?",
        a: 'Our primary featured monitoring system is <strong>S-Patch</strong>. <strong>Lead-Wire</strong> remains available as a secondary monitoring option where appropriate. For device-specific details, see <a href="services/equipment/">Monitoring Equipment Options</a>.',
      },
      {
        q: "Are all monitor specifications the same?",
        a: 'No. Device-specific details should be shown under the correct system so practices are not given the impression that every monitor shares the same physical specifications. See <a href="services/equipment/">Monitoring Equipment Options</a> for the current specs.',
      },
      {
        q: "Do practices have to buy equipment?",
        a: "No. Specialized Medical provides the equipment needed to support your program, with no equipment purchase required.",
      },
      {
        q: "What supplies are included?",
        a: "Supplies include electrodes, batteries, razors, alcohol wipes, and other essentials needed for monitoring.",
      },
      {
        q: "How many monitors can be provided?",
        a: "We provide as many monitors as your patient volume requires.",
      },
    ],
  },
  {
    title: "Patient Experience",
    items: [
      {
        q: "Is the monitor comfortable?",
        a: 'Yes. <strong>S-Patch</strong> is designed to be lightweight, easy to wear, and simple for patients to manage throughout the test. Comfort and ease of wear are central to our patient-friendly approach. <strong>Lead-Wire</strong> specifications differ—see <a href="services/equipment/">Monitoring Equipment Options</a> for details.',
      },
      {
        q: "Is it water-resistant?",
        a: "S-Patch is water-resistant (IP55) to better support everyday wear. Specifications can vary by system, so please refer to the device-specific details under the correct equipment option.",
      },
      {
        q: "How long does the battery last?",
        a: "S-Patch runs for a minimum of 10 days per battery, supporting longer monitoring periods with less interruption. Battery performance can vary by system.",
      },
      {
        q: "How long can the S-Patch be worn?",
        a: "S-Patch supports up to 30-day wear duration. Lead-Wire specifications differ and are shown separately under Monitoring Equipment Options.",
      },
      {
        q: "How small is the monitor?",
        a: "S-Patch weighs just 0.6 oz, or less than four sheets of paper, making it compact, lightweight, and easier for patients to wear. Dimensions and weight can vary by system.",
      },
    ],
  },
  {
    title: "Beta Trial",
    items: [
      {
        q: "What is the No-Risk Beta Trial?",
        a: "The No-Risk Beta Trial allows your practice to try Specialized Medical on a few patients and experience the value of our system firsthand, including live-streaming ECG data and a simplified office workflow.",
      },
      {
        q: "What happens if it is not the right fit?",
        a: "If Specialized Medical is not the right fit for your practice, we will take everything back — no hassle, no obligation.",
      },
    ],
  },
]

function buildAccordionHtml() {
  let out = ""
  for (let si = 0; si < SECTIONS.length; si++) {
    const sec = SECTIONS[si]
    out += `<div class="faq-category">`
    out += `\n  <h2 class="faq-category__title">${sec.title}</h2>`
    out += `\n  <div class="faq-category__list">`
    for (let ii = 0; ii < sec.items.length; ii++) {
      const it = sec.items[ii]
      const isOpen = si === 0 && ii === 0
      const triggerId = `faq-trigger-${si}-${ii}`
      const panelId = `faq-panel-${si}-${ii}`
      out += `\n    <div class="faq-item${isOpen ? " is-open" : ""}">`
      out += `\n      <button type="button" id="${triggerId}" class="faq-item__trigger" aria-expanded="${isOpen ? "true" : "false"}" aria-controls="${panelId}">`
      out += `\n        <span class="faq-item__q">${it.q}</span>`
      out += `\n        ${faqAccordionSvg(isOpen)}`
      out += `\n      </button>`
      out += `\n      <div id="${panelId}" role="region" aria-labelledby="${triggerId}" class="faq-item__panel"${isOpen ? "" : " hidden"}>`
      out += `\n        <p>${it.a}</p>`
      out += `\n      </div>`
      out += `\n    </div>`
    }
    out += `\n  </div>`
    out += `\n</div>`
  }
  return out
}

function main() {
  const html = fs.readFileSync(staticFaqPath, "utf8")
  const startIdx = html.indexOf(START)
  if (startIdx === -1) throw new Error("faq accordion START marker not found")
  const endIdx = html.indexOf(END, startIdx)
  if (endIdx === -1) throw new Error("faq accordion END marker not found")

  const accordionInner = buildAccordionHtml()
  const replacement = `${START}\n        <div class="figma-container faq-accordion__inner">\n${accordionInner}\n        </div>\n      </section>\n\n      `

  const newHtml = html.slice(0, startIdx) + replacement + html.slice(endIdx)
  fs.writeFileSync(staticFaqPath, newHtml, "utf8")
  console.log("Synced FAQ accordion from Gatsby into:", staticFaqPath)
}

main()

