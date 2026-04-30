/**
 * Generates static-site/services.html from web/src/pages/services.js (Figma layout).
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

const ECG_APP_VIDEO_SRC =
  "video/" +
  encodeURIComponent("WhatsApp Video 2026-04-02 at 10.32.10 PM.mp4") +
  "#t=0.001"

const BREAKDOWN = [
  ["Holter", "24–48 hours"],
  ["Extended Holter", "Greater than 48 hours up to 7 days"],
  ["Extended Holter", "Greater than 7 days up to 14 days"],
  ["Event Monitoring", "1 to 30 days"],
  ["MCT (Telemetry)", "1 to 30 days"],
  ["MCT (Telemetry)", "For post-TAVR patients"],
]

const PRACTICE = [
  "Final reports are EMR-ready and can be automatically pushed into your system",
  "Electronically review, interpret, date, and sign final reports",
  "Customized billing templates with all CPT and ICD-10 codes provided",
  "We work directly with your billing staff or third-party biller for seamless claims submission",
  "Our portal tracks device usage and alerts your staff about any inactive or unreturned monitors",
]

const CASE_STUDIES = [
  {
    key: "1",
    image: "case-01.jpg",
    caption: "S-Patch patient experience",
    tag: "S-Patch",
    title: "Easy for Patients to Wear",
    body:
      '"I wore the S-Patch Monitor from Specialized Medical all week. It was easy and hassle free. Was not a problem at all. The monitor I wore was very small. I didn\'t even realize I was wearing it. The technology is incredible. I\'m looking forward to seeing the results, since I\'m pretty sure I have occasional Afib. This monitor system is SO MUCH better than the old way!"',
    by: "- R. Gall",
  },
  {
    key: "2",
    image: "case-02.jpg",
    caption: "Detected, reported, and escalated quickly",
    tag: "S-Patch",
    title: "The ER Missed It",
    body:
      '"I am so grateful for Specialized Medical and the care I received during my heart monitoring. I wore the monitor for a 15-day test, and on day 12 it detected a serious rhythm issue that needed immediate attention. I truly believe that this monitoring made a life-saving difference for me. What stood out to me just as much as the technology was the people behind it. The customer service team at Specialized Medical was outstanding from beginning to end. They were kind, responsive, patient, and made me feel supported every step of the way.\n\nThe monitor itself was also much easier than I expected. It was simple to use, comfortable to wear, and easy to manage throughout the testing period. That gave me peace of mind and made it possible for me to go about my normal routine while still being monitored. I\'m incredibly thankful that this issue was found when it was. Specialized Medical gave me not only answers, but confidence that someone was looking out for me".',
    by: "— Marguerite C.",
  },
  {
    key: "3",
    image: "case-03.jpg",
    caption: "Detected, reported, and escalated quickly",
    tag: "S-Patch",
    title: "Serious Rhythm Issue Found During Wear",
    body:
      '"I am so thankful for Specialized Medical. I wore the monitor from March 4 to March 6, 2026, and it found a serious heart problem that I did not know was happening. I truly believe that test may have saved my life. What meant the most to me was how kind and helpful everyone was. The customer service was outstanding. Any time I had a question, someone was there to help me and explain things in a way I could understand. That made a scary situation feel a little easier. The monitor itself was also very easy to use. It was simple, comfortable to wear, and did not make my day harder. I was able to go about my normal routine while feeling better knowing my heart was being watched. I will always be grateful to Specialized Medical for finding something so important and for treating me with so much care and respect. I would recommend them to anyone who needs heart monitoring."',
    by: "— Rhonda B.",
  },
  {
    key: "4",
    image: "case-04.jpg",
    caption: "Detected, reported, and escalated quickly",
    tag: "Lead-Wire",
    title: "Rapid Physician Notification",
    body:
      "\"I am a Family Medicine doctor located in Central New York and applied Specialized Medical's Cardiac Holter Monitor to a 60-year-old male patient complaining of cardiac-related issues. The patient wore the Specialized Medical Cardiac Holter Monitor for 24 hours. During this test the Cardiac Monitor picked up 3 Paroxysmal AV blocks between 2:18 p.m. and 2:42 p.m. When Specialized Medical saw these results they immediately transmitted the reports to me and then called me on my cell phone. That day the doctor discussed the results with the patient and then referred him to a Cardiologist. We later found out the patient had been walking up a hill and after about 5 minutes into his walk he experienced the aforementioned cardiac arrhythmia. I highly recommend Specialized Medical for their cardiac monitoring services.\"",
    by: "— Michael R, M.D.",
  },
  {
    key: "5",
    image: "case-05.jpg",
    caption:
      "Example of the detail captured and reported by Specialized Medical.",
    tag: "Lead-Wire",
    title: "A Life-Saving Second Opinion",
    body:
      "\"I am an Internal Medicine doctor located in Brooklyn, NY and applied a Specialized Medical Cardiac Monitor to a female patient complaining of cardiac related issues. The patient wore a Cardiac Event Monitor and on the 5th day into the test at approximately 9:00 a.m., the patient experienced a cardiac episode that caused her to call me. I immediately had the patient go to hospital emergency room where I met her. I removed the monitor as they admitted her and sent the data into Specialized Medical. Shortly thereafter, I received a phone call on my cellular number that Specialized Medical found a significant cardiac arrhythmia. After reviewing the cardiac reports supplied by Specialized Medical, I called the hospital and forwarded the test results to the 'Fellow Cardiologist' who to my surprise was in the process of releasing my patient because they could not find anything wrong. When the cardiologist at the hospital received the test results they determined that the patient required immediate medical care and scheduled the necessary procedures to take place. If it was not for Specialized Medical's technology and service I am not sure if this patient would be around today.\"",
    by: "- Dr. Catalina R.S.",
  },
]

const featuredCase = CASE_STUDIES[0]

const breakdownCards = BREAKDOWN.map(
  ([title, meta]) => `
          <article class="svc-breakdown-card">
            <h3 class="svc-breakdown-card__title">${escapeHtml(title)}</h3>
            <p class="svc-breakdown-card__meta">${escapeHtml(meta)}</p>
          </article>`
).join("")

const practiceItems = PRACTICE.map(
  (line) => `
            <li class="svc-practice__item">${escapeHtml(line)}</li>`
).join("")

const caseStars = Array(5)
  .fill(0)
  .map(
    () =>
      `<img src="${icon("star13663-lr4m.svg")}" alt="" width="24" height="24">`
  )
  .join("")

const reportDots = [0, 1]
  .map(
    (i) =>
      `<button type="button" class="svc-reporting__dot${
        i === 0 ? " is-active" : ""
      }" data-report-dot="${i}" aria-label="Show report ${i + 1}"></button>`
  )
  .join("")

const main = `<main class="services-page services-page--figma" data-design="figma-27-13">
    <section class="svc-hero" aria-labelledby="svc-hero-heading">
      <div class="svc-hero__plate">
        <div class="svc-hero__bg" role="presentation"></div>
        <div class="svc-hero__gradient" aria-hidden="true"></div>
        <div class="figma-container svc-hero__inner">
          <p class="figma-hero__pill">
            <span class="figma-hero__pill-dot" aria-hidden="true"></span>
            Our Services
          </p>
          <h1 id="svc-hero-heading" class="svc-hero__title">
            <span class="svc-hero__title-line">Services Built for</span>
            <span class="svc-hero__title-accent">Modern Physician Practices</span>
          </h1>
          <p class="svc-hero__lead">
            Live ECG data, streamlined workflow, and turnkey monitoring support.
          </p>
          <div class="svc-hero__actions">
            <a class="figma-btn figma-btn--outline-dark" href="contact.html">Request a Demo</a>
            <a class="figma-btn figma-btn--solid" href="contact.html">Start Your No-Risk Beta Trial</a>
          </div>
        </div>
      </div>
    </section>

    <section class="figma-section svc-breakdown" aria-labelledby="svc-breakdown-heading">
      <div class="figma-container">
        <h2 id="svc-breakdown-heading" class="svc-breakdown__heading">
          Services <span class="svc-breakdown__heading-accent">Summary</span>
        </h2>
        <p class="svc-breakdown__subhead">One system, Multiple Monitoring Options.</p>
        <div class="svc-breakdown__grid">${breakdownCards}
        </div>
      </div>
    </section>

    <section class="figma-section svc-split" aria-labelledby="svc-four-heading">
      <div class="figma-container">
        <div class="svc-split__inner">
          <div class="svc-split__copy">
            <h2 id="svc-four-heading" class="svc-split__title">
              Four test types,<br>
              <span class="svc-split__title-accent">one consistent workflow</span>
            </h2>
            <p class="svc-split__text">
              Support Holter, Extended Holter, Event Monitoring, and Telemetry (MCT)
              through a turnkey monitoring program built around the S-Patch Monitoring
              System.
            </p>
          </div>
          <div class="svc-split__media">
            <img
              src="${img("four-tests-device.jpg")}"
              alt="Patient with cardiac monitoring device"
              width="522"
              height="662"
              loading="lazy"
              decoding="async"
            >
          </div>
        </div>
      </div>
    </section>

    <section
      class="figma-section svc-split svc-split--muted svc-split--live"
      aria-labelledby="svc-live-heading"
    >
      <div class="figma-container">
        <div class="svc-split__inner">
          <div class="svc-split__media svc-split__media--live-ecg">
            <div class="svc-live-ecg-card">
              <div class="svc-live-ecg-card__frame">
                <img
                  src="${img("live-streaming-ecg.jpg")}"
                  alt="Live ECG waveform display"
                  width="522"
                  height="390"
                  loading="lazy"
                  decoding="async"
                >
              </div>
            </div>
          </div>
          <div class="svc-split__copy">
            <h2 id="svc-live-heading" class="svc-split__title">
              Live Streaming,<br>
              <span class="svc-split__title-accent">Real-Time Data</span>
            </h2>
            <p class="svc-split__text">
              Our platform is designed for continuous, resilient real-time data
              streaming across a wide range of patient environments, including rural
              areas. This supports uninterrupted data capture, reduces the
              likelihood of incomplete studies, and gives physicians greater
              confidence in every test. Data is sent live to our monitoring center—no
              manual uploading, no data delays.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="figma-section svc-split" aria-labelledby="svc-spatch-heading">
      <div class="figma-container">
        <div class="svc-split__inner">
          <div class="svc-split__copy">
            <a class="svc-split__eyebrow" href="services/equipment/">
              <span class="svc-split__eyebrow-dot" aria-hidden="true"></span>
              Monitoring Equipment Options
            </a>
            <h2 id="svc-spatch-heading" class="svc-split__title">
              The S-Patch <span class="svc-split__title-accent">Monitoring System</span>
            </h2>
            <p class="svc-split__text">
              <strong>Primary Featured System.</strong> The S-Patch Monitoring System is
              Specialized Medical’s primary featured monitoring solution. It supports
              Holter, Extended Holter, Event Monitoring, and Telemetry (MCT) while
              delivering live-streaming, real-time ECG data through a compact,
              patient-friendly design.
            </p>
            <p class="svc-split__text">
              Our platform is designed for continuous, resilient real-time data streaming
              across a wide range of patient environments, including rural areas. Data is
              sent live to our monitoring center—no manual uploading and no data delays.
            </p>
            <ul class="svc-split__list">
              <li>Primary featured system for Specialized Medical</li>
              <li>Supports Holter, Extended Holter, Event Monitoring, and Telemetry (MCT)</li>
              <li>Live-streaming, real-time ECG data</li>
              <li>No manual uploading</li>
            </ul>
            <a class="figma-btn figma-btn--solid" href="services/equipment/">
              Compare Monitoring Systems
            </a>
          </div>
          <div class="svc-split__media">
            <img
              src="${img("s-patch.jpg")}"
              alt="S-Patch monitoring system in use"
              width="522"
              height="727"
              loading="lazy"
              decoding="async"
            >
          </div>
        </div>
      </div>
    </section>

    <section
      class="figma-section svc-split svc-split--muted svc-split--lead"
      aria-labelledby="svc-lead-heading"
    >
      <div class="figma-container">
        <div class="svc-split__inner">
          <div class="svc-split__media">
            <img
              src="${img("lead-wire.jpg")}"
              alt="Lead-wire monitoring system"
              width="522"
              height="748"
              loading="lazy"
              decoding="async"
            >
          </div>
          <div class="svc-split__copy">
            <h2 id="svc-lead-heading" class="svc-split__title">
              <span class="svc-split__title-line">Lead-Wire</span><br>
              <span class="svc-split__title-accent">Monitoring System</span>
            </h2>
            <p class="svc-split__text">
              <strong>Secondary / legacy monitoring option.</strong> Lead-Wire remains
              available as an older secondary monitoring option where appropriate. It is
              shown separately so practices understand it is not the primary system
              being promoted.
            </p>
            <ul class="svc-split__list">
              <li>Secondary option where needed</li>
              <li>Separate system from S-Patch</li>
            </ul>
            <a class="figma-btn figma-btn--solid" href="services/equipment/">
              Compare Monitoring Systems
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="figma-section svc-workflow" aria-labelledby="svc-workflow-heading">
      <div class="figma-container">
        <h2 id="svc-workflow-heading" class="svc-workflow__heading">
          Streamlined Workflow<br>
          <span class="svc-workflow__heading-accent">for Your Office</span>
        </h2>
        <p class="svc-workflow__sub">
          Your medical assistant completes a simple 3-step process:
          <strong>Enroll in web Portal → Hook Up → Disconnect</strong>
          <strong>(Under 15 Minutes)</strong>
        </p>
        <div class="svc-workflow__panel">
          <p>Once the patient leaves, we take over the rest:</p>
          <div class="svc-workflow__grid">
            <div class="svc-workflow__cell">
              <span class="svc-workflow__dot" aria-hidden="true"></span>
              24/7 live monitoring across all test types
            </div>
            <div class="svc-workflow__cell">
              <span class="svc-workflow__dot" aria-hidden="true"></span>
              Real-time arrhythmia alerts by email, text, or phone call
            </div>
            <div class="svc-workflow__cell">
              <span class="svc-workflow__dot" aria-hidden="true"></span>
              Automatic generation and delivery of final reports
            </div>
            <div class="svc-workflow__cell">
              <span class="svc-workflow__dot" aria-hidden="true"></span>
              Patient support through our 24/7 multilingual call center
            </div>
          </div>
          <p class="svc-workflow__footer">
            When the patient returns the device, it is ready for the next patient.
          </p>
        </div>
      </div>
    </section>

    <section class="figma-section svc-reporting" aria-labelledby="svc-reporting-heading">
      <div class="figma-container">
        <h2 id="svc-reporting-heading" class="svc-reporting__heading">
          Detailed Reporting That
          <span class="svc-reporting__heading-accent">
            Supports Faster Clinical Decisions.
          </span>
        </h2>
        <div class="svc-reporting__inner">
          <div class="svc-reporting__blocks">
            <div class="svc-reporting__block">
              <h3>Symptomatic vs. Asymptomatic Clarity</h3>
              <p>
                Patient symptoms are entered digitally during the test and
                automatically populate on the final report above the corresponding ECG
                strips, making it immediately clear whether an event was symptomatic
                or asymptomatic—with no separate handwritten symptom diary required.
              </p>
            </div>
            <div class="svc-reporting__block">
              <h3>ECG strip detail</h3>
              <p>
                Experience industry-leading ECG clarity, including precise P-wave
                definition. Our reports provide the granular detail necessary for
                accurate rhythm interpretation.
              </p>
            </div>
            <div class="svc-reporting__block">
              <h3>EMR-Ready Final Reports</h3>
              <p>
                Stop wasting time with manual data entry. Final reports are EMR-ready
                and can be pushed automatically into your existing system for a
                seamless digital record.
              </p>
            </div>
            <div class="svc-reporting__block">
              <h3>Streamlined Physician Interpretation Workflow</h3>
              <p>
                We have simplified the professional review process to fit into your
                busy schedule. Through our secure provider portal, you can manage the
                entire interpretation cycle in one place:
              </p>
              <ul class="svc-reporting__sublist">
                <li>
                  <span class="svc-reporting__label">Electronic review:</span>
                  Access comprehensive data and full-disclosure strips from any secure
                  device.
                </li>
                <li>
                  <span class="svc-reporting__label">
                    Professional interpretation:
                  </span>
                  Document your findings directly within the digital report interface.
                </li>
                <li>
                  <span class="svc-reporting__label">
                    Digital authentication:
                  </span>
                  Finalize reports with an electronic signature, date, and time
                  stamp—ready for billing and clinical filing.
                </li>
              </ul>
            </div>
          </div>
          <div class="svc-reporting__shot" id="svc-report-frame">
            <img
              id="svc-report-img"
              width="630"
              height="925"
              loading="eager"
              decoding="async"
              alt=""
            >
            <div class="svc-reporting__dots" aria-hidden="true">${reportDots}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="figma-section svc-practice" aria-labelledby="svc-practice-heading">
      <div class="figma-container">
        <h2 id="svc-practice-heading" class="svc-practice__heading">
          Practice Integration<br>
          <span class="svc-practice__heading-accent">Made Easy</span>
        </h2>
        <ul class="svc-practice__list">${practiceItems}
        </ul>
      </div>
    </section>

    <section
      class="figma-section svc-cases"
      id="clinical-stories"
      aria-labelledby="svc-cases-heading"
    >
      <div class="figma-container">
        <h2 id="svc-cases-heading" class="svc-cases__heading">
          Clinical <span class="svc-cases__heading-accent">Proof</span>
        </h2>
        <p class="svc-cases__intro">
          Featured patient and physician experience. Additional stories are available
          below on request.
        </p>
        <div class="svc-cases__list">
          <article class="svc-case-card svc-case-card--featured">
            <div>
              <div class="svc-case-card__media">
                <img
                  src="${img(featuredCase.image)}"
                  alt=""
                  width="305"
                  height="394"
                  loading="lazy"
                  decoding="async"
                >
              </div>
              <p class="svc-case-card__caption">${escapeHtml(featuredCase.caption)}</p>
            </div>
            <div>
              <span class="svc-case-card__tag">${escapeHtml(featuredCase.tag)}</span>
              <h3 class="svc-case-card__title">${escapeHtml(featuredCase.title)}</h3>
              <p class="svc-case-card__body">${escapeHtml(featuredCase.body)}</p>
              <div class="svc-case-card__stars" aria-hidden="true">${caseStars}</div>
              <p class="svc-case-card__by">${escapeHtml(featuredCase.by)}</p>
            </div>
          </article>
        </div>
        <div class="svc-cases__more-wrap">
          <a
            class="figma-btn figma-btn--outline-dark svc-cases__more-btn"
            href="clinical-stories/"
          >View clinical stories</a>
        </div>
      </div>
    </section>

    <section
      class="figma-section svc-split svc-split--symptom"
      aria-labelledby="svc-symptom-heading"
    >
      <div class="figma-container">
        <div class="svc-split__inner">
          <div class="figma-ecg__visual">
            <video
              class="figma-ecg__video"
              src="${ECG_APP_VIDEO_SRC}"
              poster="${img("live-streaming-ecg.jpg")}"
              controls
              loop
              playsinline
              preload="metadata"
              aria-label="S-Patch app: live ECG and symptom logging"
            ></video>
          </div>
          <div class="svc-split__copy">
            <h2 id="svc-symptom-heading" class="svc-split__title">
              See Live ECG &amp;<br>
              <span class="svc-split__title-accent">Symptom Logging</span>
            </h2>
            <p class="svc-split__text">
              Our platform streams ECG data in real-time, allowing physicians to
              monitor patients remotely with confidence. Patient symptoms are entered
              digitally and automatically populate on the final report, making it
              immediately clear whether an event was symptomatic or asymptomatic.
            </p>
            <ul class="svc-split__list">
              <li>Live ECG streaming for remote monitoring workflows</li>
              <li>Digital symptom logging tied to ECG events</li>
              <li>Clear symptomatic vs. asymptomatic labeling on the final report</li>
            </ul>
            <p class="svc-split__text">
              Symptoms are logged digitally and matched directly to ECG events on the
              final report.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="figma-section svc-patient svc-split" aria-labelledby="svc-patient-heading">
      <div class="figma-container">
        <div class="svc-split__inner">
          <div class="svc-split__copy">
            <h2 id="svc-patient-heading" class="svc-split__title">
              Patient-Friendly<br>
              <span class="svc-split__title-accent">Design</span>
            </h2>
            <p class="svc-split__text">
              <strong>S-Patch</strong> weighs 0.6 oz (less than four sheets of paper),
              runs at least 10 days per battery, and is water-resistant (IP55)—with
              industry-leading ECG clarity, including precise P-wave definition.
              <strong>Lead-Wire</strong> specifications differ; see
              <a class="svc-split__inline-link" href="services/equipment/">Monitoring Equipment Options</a>.
            </p>
          </div>
          <div class="svc-split__media" style="border-radius: 30px">
            <img
              src="${img("patient-friendly.jpg")}"
              alt="Hand holding compact cardiac monitor"
              width="630"
              height="604"
              loading="lazy"
              decoding="async"
            >
          </div>
        </div>
      </div>
    </section>

    <section class="figma-section svc-tavr" aria-labelledby="svc-tavr-heading">
      <div class="figma-container">
        <h2 id="svc-tavr-heading" class="svc-tavr__heading">
          Ideal for <span class="svc-tavr__heading-accent">TAVR Programs</span>
        </h2>
        <p class="svc-tavr__sub">Post-TAVR Monitoring, Built for Continuity</p>
        <p class="svc-tavr__text">
          Patients recovering from TAVR remain at risk for delayed conduction
          abnormalities and other clinically significant rhythm changes, making
          reliable post-procedure monitoring essential. Our monitoring system
          combines the S-Patch ECG monitor with an adaptive, multi-path cellular
          transmission platform designed for continuous, real-time ECG streaming.
          The differentiator is not simply the monitor itself, but the resilient
          connectivity infrastructure behind it, which helps maintain transmission
          across changing environments, including rural and lower-coverage areas.
          This supports more consistent ECG data capture and faster awareness of
          actionable rhythm changes to inform timely clinical decision-making.
        </p>
      </div>
    </section>

    <section class="figma-section figma-cta svc-figma-cta" aria-labelledby="svc-cta-heading">
      <div class="figma-container">
        <div class="figma-cta__box">
          <h2
            id="svc-cta-heading"
            class="figma-h2 figma-h2--center figma-h2--narrow"
          >
            Start Your No-Risk<br>
            <span class="figma-h2__accent">Beta Trial</span>
          </h2>
          <p class="figma-cta__p figma-cta__p--lead">
            See how Specialized Medical can support your practice with: live-streaming
            ECG data; simplified office workflow.
          </p>
          <p class="figma-cta__p">
            Evaluate Specialized Medical with a small, no-obligation beta trial. If it
            isn’t the right fit, we’ll take everything back—no hassle.
          </p>
          <div class="figma-cta__actions">
            <a class="figma-btn figma-btn--solid" href="contact.html">
              Start Your No-Risk Beta Trial
            </a>
            <a class="figma-cta__talk" href="contact.html">
                Talk to our team →
            </a>
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
  <title>Services | Specialized Medical</title>
  <meta name="description" content="Holter, extended Holter, event monitoring, and MCT with live-streaming ECG data, streamlined workflow, and zero-cost equipment—built around the S-Patch Monitoring System.">
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
  <script src="js/services-report-carousel.js" defer></script>
</body>
</html>`

fs.writeFileSync(join(__dirname, "services.html"), doc, "utf8")
console.log("Wrote services.html (Figma / Gatsby parity)")
