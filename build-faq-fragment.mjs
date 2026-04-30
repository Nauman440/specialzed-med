/**
 * One-off generator: outputs faq-accordion-fragment.html (run from static-site/).
 * Keeps FAQ copy in sync with web/src/pages/faq.js FAQ_SECTIONS.
 */
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const FAQ_SECTIONS = [
  {
    title: "How It Works",
    items: [
      {
        q: "Why should I choose Specialized Medical?",
        a: "We deliver true turn-key cardiac monitoring—enrollment, device logistics, 24/7 monitoring, and physician-ready reporting—so your practice gets live ECG clarity without adding operational burden. Our team is built around responsiveness, signal quality, and reports designed for fast clinical review.",
      },
      {
        q: "How long is the setup process?",
        a: "Most practices are up and running quickly. We provide training materials, hook-up guidance, and a dedicated onboarding path so your staff knows exactly what to expect from day one. Timelines can vary based on workflow preferences and volume.",
      },
      {
        q: "What if my patient has clinical issues during monitoring?",
        a: "Our monitoring center is staffed to support timely review and escalation pathways aligned with your practice’s protocols. Alerts can be delivered by phone, text, or email—so concerning patterns get in front of the right clinician faster.",
      },
      {
        q: "Is there technical support?",
        a: "Yes. Practices and patients can reach support for device questions, connectivity issues, and logistics. We focus on resolving issues quickly so studies stay on track and data stays complete.",
      },
    ],
  },
  {
    title: "Reports And Data",
    items: [
      {
        q: "How soon will I get results?",
        a: "Report timing depends on study type, duration, and event volume. Our workflows prioritize timely processing and clear delivery into your preferred workflow so you can act on results without chasing files.",
      },
      {
        q: "Can I customize my reports or delivery preferences?",
        a: "We work with practices to align report formatting and delivery methods where supported. Tell us your preferences during onboarding and we’ll map the best available options for your team.",
      },
      {
        q: "How do I access reports and study status?",
        a: "Depending on your configuration, reports and status updates are available through the channels we set up with your practice—designed to keep your team informed without extra steps.",
      },
      {
        q: "Is patient data secure?",
        a: "We take privacy and security seriously and follow industry-appropriate safeguards for protected health information. If you need specific compliance documentation, our team can provide details during onboarding.",
      },
    ],
  },
  {
    title: "Billing And Reimbursement",
    items: [
      {
        q: "Are CPT codes (93224–93227) applicable to these services?",
        a: "Coding and billing depend on medical necessity, payer rules, and documentation. We recommend confirming coverage and coding guidance with your billing team or coding advisor for your patient population and contracts.",
      },
      {
        q: "What is the billing process for monitoring services?",
        a: "Billing workflows vary by arrangement. Our team can walk you through how monitoring services are typically billed in partnership models and what documentation supports clean claims.",
      },
      {
        q: "What insurance plans are currently accepted?",
        a: "Accepted plans can change. Contact us for the most current information relevant to your region and practice, and we’ll help you understand options available to your patients.",
      },
    ],
  },
  {
    title: "Supplies And Equipment",
    items: [
      {
        q: "Do I need to buy any equipment?",
        a: "In most programs, practices receive what they need to run monitoring without purchasing hardware upfront. Details depend on your service arrangement—our team will outline exactly what is included.",
      },
      {
        q: "What supplies are included?",
        a: "Typical supplies include monitors, electrodes, and patient instruction materials as applicable to the study type. We’ll confirm the exact kit for each workflow during onboarding.",
      },
      {
        q: "How do I order more supplies?",
        a: "Practices can reorder through the process we establish with your office—designed to be simple so you’re never stuck waiting on basics during patient volume spikes.",
      },
    ],
  },
  {
    title: "Patient Experience",
    items: [
      {
        q: "Is the monitor comfortable?",
        a: "The device is designed for ambulatory wear with patient comfort in mind. Lightweight profiles and flexible wear options help improve compliance across multi-day studies.",
      },
      {
        q: "Can patients shower?",
        a: "Many devices support daily activity within published wear and water-resistance guidelines. We provide clear patient instructions so expectations match the device specifications.",
      },
      {
        q: "How long is the monitoring period?",
        a: "Duration depends on the clinical test ordered—Holter, extended Holter, event, or telemetry (MCT). Your team selects the study length that matches the clinical question.",
      },
      {
        q: "How do patients return the monitor?",
        a: "Return logistics are included as part of the turn-key workflow. Patients receive simple packaging and instructions to send equipment back promptly after the study ends.",
      },
    ],
  },
  {
    title: "Beta Trial",
    items: [
      {
        q: "What is the “No-Risk Beta Trial”?",
        a: "It’s a structured way for practices to experience our monitoring workflow with guided onboarding and support—so you can evaluate fit for your office before making a long-term commitment. Terms vary; ask our team for current availability.",
      },
      {
        q: "What’s included in the Beta Trial?",
        a: "Typically includes onboarding support, equipment logistics, monitoring services, and reporting aligned to your trial scope. We’ll provide a clear checklist up front so there are no surprises.",
      },
    ],
  },
];

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

let out = "";
FAQ_SECTIONS.forEach((sec, si) => {
  out += `<div class="faq-category">\n`;
  out += `  <h2 class="faq-category__title">${esc(sec.title)}</h2>\n`;
  out += `  <div class="faq-category__list">\n`;
  sec.items.forEach((item, ii) => {
    const key = `${si}-${ii}`;
    const isOpen = key === "0-0";
    out += `    <div class="faq-item${isOpen ? " is-open" : ""}">\n`;
    out += `      <button type="button" id="faq-trigger-${key}" class="faq-item__trigger" aria-expanded="${isOpen ? "true" : "false"}" aria-controls="faq-panel-${key}">\n`;
    out += `        <span class="faq-item__q">${esc(item.q)}</span>\n`;
    out += `        <svg class="faq-item__chevron${isOpen ? " is-open" : ""}" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>\n`;
    out += `      </button>\n`;
    out += `      <div id="faq-panel-${key}" role="region" aria-labelledby="faq-trigger-${key}" class="faq-item__panel"${isOpen ? "" : " hidden"}>\n`;
    out += `        <p>${esc(item.a)}</p>\n`;
    out += `      </div>\n`;
    out += `    </div>\n`;
  });
  out += `  </div>\n`;
  out += `</div>\n`;
});

fs.writeFileSync(join(__dirname, "faq-accordion-fragment.html"), out, "utf8");
console.log("Wrote faq-accordion-fragment.html");
