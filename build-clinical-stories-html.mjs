/**
 * Generates static-site/clinical-stories.html from web/src/pages/clinical-stories.js
 */
import fs from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { renderFooter, renderHeader } from "./partials/render-layout.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))

function img(file) {
  return `images/figma-services/${file
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/")}`
}

function icon(name) {
  return `icons/${encodeURIComponent(name)}`
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

const REPORT_SAMPLE_PDF = "documents/SAMPLE-04-16-2026-HolterL1-CA-1.pdf"
const REPORT_SAMPLE_PREVIEW = img("report-sample.jpg")

const CASE_STUDIES = [
  {
    key: "cp-1",
    image: "case-01.jpg",
    caption: "Patient-friendly design, small monitor size, comfort, and ease of wear.",
    tag: "Case Study 01 (S-Patch System)",
    title: "Easy for Patients to Wear",
    body:
      `"I wore the S-Patch Monitor from Specialized Medical all week. It was easy and hassle free. Was not a problem at all. The monitor I wore was very small. I didn't even realize I was wearing it. The technology is incredible. I'm looking forward to seeing the results, since I'm pretty sure I have occasional Afib. This monitor system is SO MUCH better than the old way!"`,
    by: "- R. Gall",
  },
  {
    key: "cp-2",
    image: "case-02.jpg",
    caption: "Detected, reported, and escalated quickly",
    tag: "Case Study 02 (S-Patch)",
    title: "The ER Missed It",
    body:
      `"I am so grateful for Specialized Medical and the care I received during my heart monitoring. I wore the monitor for a 15-day test, and on day 12 it detected a serious rhythm issue that needed immediate attention. I truly believe that this monitoring made a life-saving difference for me. What stood out to me just as much as the technology was the people behind it. The customer service team at Specialized Medical was outstanding from beginning to end. They were kind, responsive, patient, and made me feel supported every step of the way.\n\nThe monitor itself was also much easier than I expected. It was simple to use, comfortable to wear, and easy to manage throughout the testing period. That gave me peace of mind and made it possible for me to go about my normal routine while still being monitored. I'm incredibly thankful that this issue was found when it was. Specialized Medical gave me not only answers, but confidence that someone was looking out for me".`,
    by: "— Marguerite C.",
  },
  {
    key: "cp-3",
    image: "case-03.jpg",
    caption: "Detected, reported, and escalated quickly",
    tag: "Case Study 03 (S-Patch)",
    title: "The ER Missed It",
    body:
      `"I am so thankful for Specialized Medical. I wore the monitor from March 4 to March 6, 2026, and it found a serious heart problem that I did not know was happening. I truly believe that test may have saved my life. What meant the most to me was how kind and helpful everyone was. The customer service was outstanding. Any time I had a question, someone was there to help me and explain things in a way I could understand. That made a scary situation feel a little easier. The monitor itself was also very easy to use. It was simple, comfortable to wear, and did not make my day harder. I was able to go about my normal routine while feeling better knowing my heart was being watched. I will always be grateful to Specialized Medical for finding something so important and for treating me with so much care and respect. I would recommend them to anyone who needs heart monitoring."`,
    by: "— Rhonda B.",
  },
  {
    key: "cp-4",
    image: "case-04.jpg",
    caption: "Detected, reported, and escalated quickly",
    tag: "Case Study 04 (Lead Wire System)",
    title: "The ER Missed It",
    body:
      `"I am a Family Medicine doctor located in Central New York and applied Specialized Medical's Cardiac Holter Monitor to a 60-year-old male patient complaining of cardiac-related issues. The patient wore the Specialized Medical Cardiac Holter Monitor for 24 hours. During this test the Cardiac Monitor picked up 3 Paroxysmal AV blocks between 2:18 p.m. and 2:42 p.m. When Specialized Medical saw these results they immediately transmitted the reports to me and then called me on my cell phone. That day the doctor discussed the results with the patient and then referred him to a Cardiologist. We later found out the patient had been walking up a hill and after about 5 minutes into his walk he experienced the aforementioned cardiac arrhythmia. I highly recommend Specialized Medical for their cardiac monitoring services."`,
    by: "— Michael R, M.D.",
  },
  {
    key: "cp-5",
    image: "case-05.jpg",
    caption: "Example of the detail captured and reported by Specialized Medical.",
    tag: "Case Study 05 (Lead Wire System)",
    title: "A Life-Saving Second Opinion",
    body:
      `"I am an Internal Medicine doctor located in Brooklyn, NY and applied a Specialized Medical Cardiac Monitor to a female patient complaining of cardiac related issues. The patient wore a Cardiac Event Monitor and on the 5th day into the test at approximately 9:00 a.m., the patient experienced a cardiac episode that caused her to call me. I immediately had the patient go to hospital emergency room where I met her. I removed the monitor as they admitted her and sent the data into Specialized Medical. Shortly thereafter, I received a phone call on my cellular number that Specialized Medical found a significant cardiac arrhythmia. After reviewing the cardiac reports supplied by Specialized Medical, I called the hospital and forwarded the test results to the 'Fellow Cardiologist' who to my surprise was in the process of releasing my patient because they could not find anything wrong. When the cardiologist at the hospital received the test results they determined that the patient required immediate medical care and scheduled the necessary procedures to take place. If it was not for Specialized Medical's technology and service I am not sure if this patient would be around today."`,
    by: "- Dr. Catalina R.S.",
  },
]

function caseStars() {
  return Array(5)
    .fill(0)
    .map(
      () =>
        `<img src="${icon("star13663-lr4m.svg")}" alt="" width="24" height="24">`
    )
    .join("")
}

const caseCards = CASE_STUDIES.map(
  (c) => `
            <article id="${escapeHtml(c.key)}" class="svc-case-card">
              <div>
                <div class="svc-case-card__media">
                  <img src="${img(c.image)}" alt="" loading="lazy" decoding="async">
                </div>
                <p class="svc-case-card__caption">${escapeHtml(c.caption)}</p>
              </div>
              <div>
                <span class="svc-case-card__tag">${escapeHtml(c.tag)}</span>
                <h2 class="svc-case-card__title">${escapeHtml(c.title)}</h2>
                <p class="svc-case-card__body">${escapeHtml(c.body)}</p>
                <div class="svc-case-card__stars" aria-hidden="true">${caseStars()}</div>
                <p class="svc-case-card__by">${escapeHtml(c.by)}</p>
              </div>
            </article>`
).join("")

const main = `<main class="services-page services-page--figma" data-page="clinical-stories">
      <section class="svc-hero" aria-labelledby="clinical-stories-heading">
        <div class="svc-hero__plate">
          <div class="svc-hero__bg" role="presentation"></div>
          <div class="svc-hero__gradient" aria-hidden="true"></div>
          <div class="figma-container svc-hero__inner">
            <p class="figma-hero__pill">
              <span class="figma-hero__pill-dot" aria-hidden="true"></span>
              Clinical Proof
            </p>
            <h1 id="clinical-stories-heading" class="svc-hero__title">
              Clinical <span class="svc-hero__title-accent">Stories</span>
            </h1>
            <p class="svc-hero__lead">
              Short, physician-facing proof points focused on workflow, reporting, and patient experience.
            </p>
            <div class="svc-hero__actions">
              <a class="figma-btn figma-btn--outline-dark" href="services.html">Back to Services</a>
              <a class="figma-btn figma-btn--solid" href="contact.html">Request a Demo</a>
            </div>
          </div>
        </div>
      </section>

      <section class="figma-section svc-cases" aria-label="Clinical stories list">
        <div class="figma-container">
          <div class="svc-cases__list svc-cases__list--more">${caseCards}
          </div>
        </div>
      </section>

      <section class="figma-section" aria-label="Reporting proof">
        <div class="figma-container">
          <div class="figma-proof-patient-experience figma-proof-patient-experience--split figma-proof-patient-experience--centered">
            <div class="figma-proof-patient-experience__content">
              <h2 class="figma-h2 figma-h2--left figma-proof-patient-experience__title">
                Reporting that supports faster
                <span class="figma-h2__accent">clinical decisions</span>
              </h2>
              <p class="figma-proof-patient-experience__support">
                EMR-ready final reports with a workflow designed for physician
                review, interpretation, dating, and signature.
              </p>
            </div>
            <div class="figma-proof-patient-experience__media figma-proof-patient-experience__media--pdf">
              <div class="figma-proof-patient-experience__pdf-wrap">
                <img
                  class="figma-proof-patient-experience__pdf-preview"
                  src="${REPORT_SAMPLE_PREVIEW}"
                  alt="Sample report preview"
                  width="520"
                  height="360"
                  loading="lazy"
                  decoding="async"
                >
                <a
                  class="figma-proof-patient-experience__pdf-open"
                  href="${REPORT_SAMPLE_PDF}"
                  target="_blank"
                  rel="noopener noreferrer"
                >Open in a New tab</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>`

const doc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Clinical Stories | Specialized Medical</title>
  <meta name="description" content="Clinical stories and proof points focused on physician workflow, reporting, and patient experience.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/home.css">
  <link rel="stylesheet" href="css/services.css">
</head>
<body>
  <div class="site-root">
${renderHeader({ base: "", active: "services" })}
${main}
${renderFooter({ base: "" })}
  </div>
  <script src="js/main.js" defer></script>
</body>
</html>`

fs.writeFileSync(join(__dirname, "clinical-stories.html"), doc, "utf8")
console.log("Wrote clinical-stories.html")
