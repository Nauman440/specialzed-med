"""Build s-patch-cardiac-monitoring-system.html from the client's S-Patch developer package (Nov 24, 2026).

Run from the repo root:   python3 scripts/build-spatch-page.py && npm run cache-bust

The client's copy, FAQs and JSON-LD graph are kept; the page is rendered in the
site's landing template (head base script, header, footer, landing-mct.css,
landing-lite.js form handler) copied from post-tavr-cardiac-monitoring.html.
"""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://www.specialized-med.com/"
PAGE = "s-patch-cardiac-monitoring-system.html"
CANON = SITE + PAGE
TITLE = "S-Patch Cardiac Monitoring System | Specialized Medical"
DESC = ("Explore the compact S-Patch wearable ECG monitor for Holter, Event and MCT studies, with live "
        "transmission and nationwide turnkey support.")
OG_TITLE = "S-Patch Cardiac Monitoring System"
OG_DESC = ("A compact dual-disk wearable ECG system for Holter, Event and Mobile Cardiac Telemetry studies—"
           "supported by live transmission and a turnkey service team.")
TW_DESC = "One compact wearable ECG system for multiple prescribed ambulatory cardiac monitoring studies."
IMG = "s-patch-cardiac-monitoring-system-hero"
IMG_URL = SITE + "images/landing/" + IMG + "-1920.jpg"
IMG_ALT = "Patient wearing the two-component S-Patch cardiac monitor while a clinician checks placement"
REVIEW_ISO = "2026-11-25"
REVIEW_TEXT = "November 25, 2026"
DEMO = PAGE + "#request-demo"

FAQS = [
    ("What is the S-Patch cardiac monitoring system?",
     "S-Patch is a compact dual-disk wearable ECG monitor used by Specialized Medical for prescribed ambulatory "
     "studies. One thin lead connects the two components, and the system works with a dedicated cellular phone to "
     "transmit ECG data in supported live-monitoring workflows."),
    ("Which cardiac monitoring studies can use S-Patch?",
     "Specialized Medical uses the S-Patch platform to support Holter Monitoring, Long-Term Holter Monitoring, Extended "
     "Holter Monitoring, Cardiac Event Monitoring and Mobile Cardiac Telemetry (MCT), depending on the physician's order and the selected workflow."),
    ("How much does the S-Patch monitor weigh?",
     "The S-Patch system weighs approximately 0.6 ounces. Its two circular components are designed to be compact and "
     "unobtrusive during normal daily activity."),
    ("How long does the S-Patch battery last?",
     "The current validated S-Patch battery specification is a minimum of 10 days per battery. A prescribed study "
     "may last up to 30 days; a study longer than the battery specification includes battery handling managed "
     "according to the prescribed test and support workflow. A single battery is not stated to last 30 days."),
    ("Is the S-Patch water-resistant?",
     "The S-Patch is rated IP55, which indicates resistance to dust and water splashes during everyday wear. IP55 is "
     "not a waterproof rating. Patients should follow the approved use and care instructions supplied with their "
     "prescribed study, including any guidance on showering and on repositioning electrodes, which should be done "
     "only according to those approved patient instructions."),
    ("Does S-Patch transmit ECG data live?",
     "In Specialized Medical's supported live-monitoring workflows, S-Patch ECG data is transmitted through a "
     "dedicated cellular phone to the monitoring platform. This removes manual batch uploading and lets the support "
     "team follow operational study status while the test is underway."),
    ("What does the dedicated monitoring phone do?",
     "The preconfigured phone connects to the S-Patch by Bluetooth and sends ECG data over one of five supported "
     "cellular networks: AT&T, T-Mobile and Verizon in the United States, and Telcel and AT&T Mexico in Mexico, "
     "subject to available coverage. Its "
     "patient-facing functions are intentionally limited to device status and symptom logging, helping keep the "
     "study workflow simple."),
    ("What happens if an electrode, battery or connection issue occurs?",
     "When operational indicators fall outside the expected range, Specialized Medical's support team can contact "
     "the patient and help troubleshoot the battery, electrode contact, Bluetooth connection, cellular connection or "
     "data transmission before additional monitoring time is lost."),
    ("Do physician practices need to purchase S-Patch equipment?",
     "No equipment purchase is required for Specialized Medical's program. The company supplies the monitoring "
     "equipment and routine study supplies needed for the agreed program, subject to the service agreement."),
    ("How can a practice evaluate the S-Patch system?",
     "A physician practice, cardiology group, hospital or health system can request a demonstration or discuss a "
     "small no-obligation pilot with Specialized Medical. The team will confirm fit, workflow and implementation "
     "requirements before patient use."),
]

# (page link, client label, duration, how S-Patch supports it, clinical communication)
PATHS = [
    ("holter-monitoring-services.html", "Holter Monitoring", "24–48 hours",
     "Continuous ECG acquisition with streamlined enrollment and disconnect.",
     "Results are provided in the final report after the recording is processed."),
    ("long-term-holter-monitoring.html", "Long-Term Holter Monitoring", "More than 48 hours through 7 days",
     "Compact wear and a 10-day minimum battery specification support longer collection.",
     "Results are provided in the final report."),
    ("extended-holter-monitoring-8-14-days.html", "Extended Holter Monitoring", "More than 7 days through 14 days",
     "The same wearable platform continues the study under the ordered configuration.",
     "Results are provided in the final report."),
    ("cardiac-event-monitoring.html", "Cardiac Event Monitoring", "1–30 days",
     "Digital symptom entries align patient-reported events with the ECG timeline.",
     "Qualifying findings follow the physician-prescribed notification protocol."),
    ("mobile-cardiac-telemetry-mct.html", "Mobile Cardiac Telemetry (MCT)", "1–30 days",
     "Live ECG transmission supports ongoing monitoring-center review under the ordered service.",
     "Qualifying findings follow the physician-prescribed notification protocol."),
]

INTEREST = ["S-Patch demonstration", "No-risk pilot program", "Holter and longer Holter studies",
            "Event Monitoring", "Mobile Cardiac Telemetry", "Hospital or health-system program"]

CAMPAIGN_FIELDS = ["page_url", "referrer", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
                   "gclid", "msclkid"]

CHEVRON = ('<svg class="faq-item__chevron{c}" width="20" height="20" viewBox="0 0 24 24" fill="none" '
           'xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" '
           'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>')


def cta(name, label, cls="figma-btn figma-btn--solid", href=DEMO):
    return (f'<a class="{cls}" href="{href}" data-mct-track="sm_cta_click" data-track-name="{name}">'
            f'{label}</a>')


def jsonld():
    org = {"@id": SITE + "#organization"}
    img = {"@id": CANON + "#primaryimage"}
    graph = {
        "@context": "https://schema.org",
        "@graph": [
            {"@type": "Organization", "@id": SITE + "#organization", "name": "Specialized Medical LLC", "url": SITE,
             "email": "info@specialized-med.com", "telephone": "+1-855-773-2633",
             "logo": SITE + "images/figma-assets/brand-logo.webp",
             "address": {"@type": "PostalAddress", "streetAddress": "34145 Pacific Coast Highway, #700",
                         "addressLocality": "Dana Point", "addressRegion": "CA", "postalCode": "92629",
                         "addressCountry": "US"},
             "areaServed": {"@type": "Country", "name": "United States"},
             "contactPoint": {"@type": "ContactPoint", "contactType": "sales and support",
                              "telephone": "+1-855-773-2633", "email": "info@specialized-med.com",
                              "availableLanguage": ["English", "Spanish"], "areaServed": "US"},
             "sameAs": ["https://www.facebook.com/specializedmedical"]},
            {"@type": "WebSite", "@id": SITE + "#website", "url": SITE, "name": "Specialized Medical",
             "publisher": org},
            {"@type": "ImageObject", "@id": CANON + "#primaryimage", "url": IMG_URL, "contentUrl": IMG_URL,
             "width": 1920, "height": 900,
             "caption": "Patient wearing the two-component S-Patch cardiac monitoring system while a clinician "
                        "checks placement"},
            {"@type": "MedicalDevice", "@id": CANON + "#device", "name": "S-Patch Cardiac Monitoring System",
             "alternateName": "S-Patch wearable ECG monitor",
             "description": "A compact, 0.6-ounce, dual-disk ambulatory ECG monitoring system used by Specialized "
                            "Medical to support prescribed Holter, Long-Term Holter, Extended Holter, Event and "
                            "Mobile Cardiac Telemetry studies.",
             "image": img},
            {"@type": "Service", "@id": CANON + "#service", "name": "S-Patch Ambulatory Cardiac Monitoring Program",
             "serviceType": "Ambulatory ECG monitoring support using the S-Patch system", "provider": org,
             "areaServed": {"@type": "Country", "name": "United States"},
             "audience": {"@type": "MedicalAudience",
                          "audienceType": "Physician practices, cardiology groups, hospitals and health systems"},
             "description": "Nationwide turnkey cardiac monitoring support built around the S-Patch wearable ECG "
                            "system, live transmission, proactive patient assistance and physician-ready reporting."},
            {"@type": "MedicalWebPage", "@id": CANON + "#webpage", "url": CANON, "name": TITLE,
             "description": "Equipment and service information for the S-Patch wearable ambulatory ECG monitoring "
                            "system.",
             "inLanguage": "en-US", "isPartOf": {"@id": SITE + "#website"},
             "about": [{"@id": CANON + "#device"}, {"@id": CANON + "#service"}],
             "primaryImageOfPage": img, "publisher": org, "breadcrumb": {"@id": CANON + "#breadcrumb"},
             "datePublished": REVIEW_ISO, "dateModified": REVIEW_ISO, "lastReviewed": REVIEW_ISO,
             "specialty": "https://schema.org/Cardiovascular"},
            {"@type": "BreadcrumbList", "@id": CANON + "#breadcrumb", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE},
                {"@type": "ListItem", "position": 2, "name": "Monitoring Equipment",
                 "item": SITE + "services/equipment.html"},
                {"@type": "ListItem", "position": 3, "name": "S-Patch Cardiac Monitoring System", "item": CANON}]},
            {"@type": "FAQPage", "@id": CANON + "#faq", "mainEntity": [
                {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
                for q, a in FAQS]},
        ],
    }
    return json.dumps(graph, indent=2, ensure_ascii=False)


def body():
    e = html.escape
    sizes = "100vw"
    webp = ", ".join(f"/images/landing/{IMG}-{w}.webp {w}w" for w in (960, 1280, 1920))
    jpg = ", ".join(f"/images/landing/{IMG}-{w}.jpg {w}w" for w in (960, 1280, 1920))

    rows = "\n".join(f"""              <tr>
                <th scope="row"><a href="{href}">{label}</a></th>
                <td data-label="Typical duration">{dur}</td>
                <td data-label="How S-Patch supports it">{how}</td>
                <td data-label="Clinical communication">{comm}</td>
              </tr>""" for href, label, dur, how, comm in PATHS)

    faq_items = "\n".join(f"""<div class="faq-item{' is-open' if i == 0 else ''}">
      <button type="button" id="faq-trigger-spatch-{i}" class="faq-item__trigger" aria-expanded="{'true' if i == 0 else 'false'}" aria-controls="faq-panel-spatch-{i}">
        <span class="faq-item__q">{e(q, quote=False)}</span>
        {CHEVRON.format(c=' is-open' if i == 0 else '')}
      </button>
      <div id="faq-panel-spatch-{i}" role="region" aria-labelledby="faq-trigger-spatch-{i}" class="faq-item__panel"{'' if i == 0 else ' hidden'}>
        <p>{e(a, quote=False)}</p>
      </div>
    </div>""" for i, (q, a) in enumerate(FAQS))

    options = "\n".join(f'                  <option value="{e(o)}"{" selected" if i == 0 else ""}>{e(o)}</option>'
                        for i, o in enumerate(INTEREST))
    hidden = "\n".join(f'            <input type="hidden" name="{f}" value="">' for f in CAMPAIGN_FIELDS)

    return f"""  <script type="application/ld+json">
{jsonld()}
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{TITLE}</title>
  <meta name="description" content="{e(DESC)}">
  <meta name="author" content="Specialized Medical LLC">
  <meta property="og:site_name" content="Specialized Medical">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{e(OG_TITLE)}">
  <meta property="og:description" content="{e(OG_DESC)}">
  <meta property="og:url" content="{CANON}">
  <meta property="og:image" content="{IMG_URL}">
  <meta property="og:image:width" content="1920">
  <meta property="og:image:height" content="900">
  <meta property="og:image:alt" content="{e(IMG_ALT)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{e(OG_TITLE)}">
  <meta name="twitter:description" content="{e(TW_DESC)}">
  <meta name="twitter:image" content="{IMG_URL}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="icon" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="preload" as="image" type="image/webp" href="/images/landing/{IMG}-960.webp" imagesrcset="{webp}" imagesizes="{sizes}" fetchpriority="high">
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
  <noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></noscript>
  <link rel="stylesheet" href="/css/global.css">
  <link rel="stylesheet" href="/css/chrome.css">
  <link rel="stylesheet" href="/css/landing-mct.css">
  <link rel="stylesheet" href="/css/faq.css">
  <link rel="stylesheet" href="/css/landing-spatch.css">
  <link rel="canonical" href="{CANON}">
</head>
<body>
  <noscript>
    <iframe
      src="https://www.googletagmanager.com/ns.html?id=GTM-T2JLQJ7R"
      height="0"
      width="0"
      style="display:none;visibility:hidden">
    </iframe>
  </noscript>
  <a class="skip-link" href="{PAGE}#main-content">Skip to content</a>
  <div class="site-root">
    <header class="site-header site-header--figma">
      <div class="figma-container figma-header__inner site-header__inner">
        <a href="./" class="figma-brand" aria-label="Specialized Medical home">
          <img class="figma-brand__mark" src="/images/figma-assets/brand-logo-472.webp" alt="Specialized Medical" width="236" fetchpriority="low" height="52" decoding="async">
        </a>
        <button type="button" class="nav-toggle nav-toggle--figma" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu">
          <span class="nav-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>
        </button>
        <button type="button" class="nav-overlay" aria-label="Close menu" hidden></button>
        <nav id="primary-nav" class="figma-nav" aria-label="Primary">
          <a class="figma-nav__link" href="./">Home</a>
          <a class="figma-nav__link" href="about.html">About Us</a>
          <a class="figma-nav__link is-active" href="services.html">Services</a>
          <a class="figma-nav__link" href="faq.html">FAQs</a>
          <a class="figma-nav__link" href="contact.html">Contact</a>
          <div class="figma-nav__mobile">
            <a class="figma-nav__phone" href="tel:+18557732633">Call: 1-855-773-2633</a>
            <div class="figma-nav__actions">
              {cta("header_demo", "Request a Demo", "figma-btn figma-btn--outline-dark")}
              <a class="figma-btn figma-btn--solid" href="https://sft.specialized-med-business.com/specMed/" data-mct-track="portal_click" target="_blank" rel="noopener noreferrer">Physician Portal</a>
            </div>
          </div>
        </nav>
        <div class="figma-header__cta">
          <a class="figma-phone" href="tel:+18557732633">
            <img class="figma-phone__icon" src="/icons/vector3527-jgyk.svg" alt="" width="14" height="14" decoding="async">
            <span class="figma-phone__num">1-855-773-2633</span>
          </a>
          {cta("header_demo", "Request a Demo", "figma-btn figma-btn--outline-dark")}
          <a class="figma-header__portal" href="https://sft.specialized-med-business.com/specMed/" data-mct-track="portal_click" target="_blank" rel="noopener noreferrer">Physician Portal</a>
        </div>
      </div>
    </header>

    <main class="landing-page landing-page--spatch services-page services-page--figma" data-landing="s-patch-cardiac-monitoring-system" data-service-id="s_patch" id="main-content" tabindex="-1">
    <nav class="landing-breadcrumb" aria-label="Breadcrumb">
      <div class="figma-container">
        <ol class="landing-breadcrumb__list">
          <li><a href="./">Home</a></li>
          <li><a href="services/equipment.html">Monitoring Equipment</a></li>
          <li><span aria-current="page">S-Patch Cardiac Monitoring System</span></li>
        </ol>
      </div>
    </nav>

    <section class="landing-hero" aria-labelledby="spatch-hero-heading">
      <div class="landing-hero__plate landing-hero__plate--spatch">
        <picture>
          <source type="image/webp" srcset="{webp}" sizes="{sizes}">
          <img class="landing-hero__media" src="/images/landing/{IMG}-960.jpg" srcset="{jpg}" sizes="{sizes}" width="1920" height="900" alt="{e(IMG_ALT)}" loading="eager" fetchpriority="high" decoding="async">
        </picture>
        <div class="landing-hero__gradient" aria-hidden="true"></div>
        <div class="landing-hero__inner figma-container">
          <p class="figma-hero__pill">
            <span class="figma-hero__pill-dot" aria-hidden="true"></span>
            WEARABLE AMBULATORY ECG SYSTEM
          </p>
          <h1 id="spatch-hero-heading" class="landing-hero__title">The S-Patch Cardiac <span class="landing-hero__title-accent">Monitoring System</span></h1>
          <p class="landing-hero__lead landing-answer">One compact dual-disk system for Holter, longer Holter, Event and Mobile Cardiac Telemetry studies—with live ECG transmission, a dedicated cellular phone and turnkey support from Specialized Medical.</p>
          <div class="landing-hero__actions">
            {cta("hero_pilot", "Start a No-Risk Pilot Program")}
            {cta("hero_how", "See How S-Patch Works", "figma-btn figma-btn--outline-dark", PAGE + "#how-it-works")}
          </div>
          <ul class="landing-hero__points" aria-label="Key S-Patch benefits">
            <li>0.6 oz</li>
            <li>10-day minimum battery</li>
            <li>IP55</li>
            <li>Up to 30-day prescribed wear</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="landing-section landing-section--muted" aria-label="S-Patch system overview">
      <div class="figma-container">
        <ul class="landing-trust-strip" aria-label="S-Patch system overview">
          <li><strong>2 disks</strong><span>One thin connecting lead</span></li>
          <li><strong>5 study paths</strong><span>One consistent platform</span></li>
          <li><strong>LIVE</strong><span>Transmission in supported workflows</span></li>
          <li><strong>Nationwide</strong><span>Turnkey practice support</span></li>
        </ul>
      </div>
    </section>

    <section class="landing-section" aria-labelledby="spatch-what-heading">
      <div class="figma-container landing-definition">
        <div>
          <p class="landing-eyebrow">Direct answer</p>
          <h2 id="spatch-what-heading" class="landing-h2">What Is the <span class="landing-h2__accent">S-Patch?</span></h2>
          <p class="landing-p landing-answer">S-Patch is a compact wearable ECG monitor built around two small circular components connected by one thin lead. Specialized Medical uses the system to support multiple physician-prescribed ambulatory cardiac monitoring studies through one familiar equipment and reporting workflow.</p>
          <div class="landing-answer-box"><strong>In practical terms:</strong> practices can use one patient-friendly platform for short Holter studies, longer Holter studies, Cardiac Event Monitoring and Mobile Cardiac Telemetry instead of managing a different device workflow for every study type.</div>
          <p class="landing-p">The monitor pairs with a dedicated, preconfigured phone. In supported live workflows, that phone automatically transmits ECG data through an available cellular network. Patients do not need to upload recordings manually or navigate a general-purpose smartphone.</p>
          <p class="landing-reviewed">Published and reviewed for service accuracy by Specialized Medical LLC. Last reviewed {REVIEW_TEXT}.</p>
        </div>
        <aside class="landing-spec-panel" aria-label="S-Patch equipment specifications">
          <h3 class="landing-h3">S-Patch specifications</h3>
          <dl class="landing-spec-list">
            <div><dt>Dual-disk</dt><dd>Two components, one thin lead</dd></div>
            <div><dt>~0.6 oz</dt><dd>Approximate total weight</dd></div>
            <div><dt>Single-lead</dt><dd>ECG recording</dd></div>
            <div><dt>10 days</dt><dd>Current validated battery specification (minimum, per battery)</dd></div>
            <div><dt>IP55</dt><dd>Dust and splash resistance (not waterproof)</dd></div>
            <div><dt>Bluetooth</dt><dd>Monitor-to-phone connection</dd></div>
            <div><dt>Symptom logging</dt><dd>On the dedicated phone</dd></div>
            <div><dt>Up to 30 days</dt><dd>Prescribed wear, with battery handling</dd></div>
            <div><dt>1.57 in</dt><dd>Larger disk diameter</dd></div>
            <div><dt>1.41 in</dt><dd>Smaller disk diameter</dd></div>
          </dl>
          <p class="landing-spec-panel__note">One battery is not stated to last 30 days: a study longer than the battery specification includes battery handling under the support workflow. Electrodes are repositioned only according to the approved patient instructions, and use and care always follow the instructions for the prescribed study. Compare all <a href="services/equipment.html">monitoring equipment options</a>.</p>
        </aside>
      </div>
    </section>

    <section class="landing-section landing-section--muted landing-section--center" id="how-it-works" aria-labelledby="spatch-paths-heading">
      <div class="figma-container">
        <p class="landing-eyebrow">One platform, multiple prescriptions</p>
        <h2 id="spatch-paths-heading" class="landing-h2">Five Ambulatory Cardiac <span class="landing-h2__accent">Monitoring Paths</span></h2>
        <p class="landing-p landing-section__intro">The physician selects the appropriate study. Specialized Medical configures the workflow, supports the patient and delivers the applicable report.</p>
        <div class="landing-table-wrap" role="region" aria-label="Study paths supported by S-Patch" tabindex="0">
          <table class="landing-table landing-table--stack">
            <caption class="landing-table__caption">Study paths supported by the S-Patch platform</caption>
            <thead>
              <tr>
                <th scope="col">Study path</th>
                <th scope="col">Typical duration</th>
                <th scope="col">How S-Patch supports it</th>
                <th scope="col">Clinical communication</th>
              </tr>
            </thead>
            <tbody>
{rows}
            </tbody>
          </table>
        </div>
        <p class="landing-p landing-section__intro">Study duration, notification thresholds and clinical use are determined by the prescribing physician. Live operational visibility is not the same as a diagnosis or guaranteed clinical outcome.</p>
      </div>
    </section>

    <section class="landing-section landing-section--center" aria-labelledby="spatch-wear-heading">
      <div class="figma-container">
        <p class="landing-eyebrow">Designed for wearability</p>
        <h2 id="spatch-wear-heading" class="landing-h2">A Small Monitor That Stays Out of the <span class="landing-h2__accent">Patient&rsquo;s Way</span></h2>
        <p class="landing-p landing-section__intro">The S-Patch configuration is intentionally simple: two low-profile disks, one connecting lead and a dedicated phone that handles transmission.</p>
        <div class="landing-feature-grid" role="list">
          <article class="landing-feature-card" role="listitem"><h3 class="landing-h3">Two-component design</h3><p class="landing-p">The disks sit on two instructed skin locations. The single lead can be routed beneath clothing to support a more discreet patient experience.</p></article>
          <article class="landing-feature-card" role="listitem"><h3 class="landing-h3">Lightweight for daily wear</h3><p class="landing-p">At approximately 0.6 ounces, S-Patch is designed to minimize bulk while the patient moves through normal day-to-day activities.</p></article>
          <article class="landing-feature-card" role="listitem"><h3 class="landing-h3">Repositionable electrodes</h3><p class="landing-p">Electrode positions can be changed on the skin as directed, helping avoid repeated stress on a single location while maintaining ECG acquisition.</p></article>
        </div>
      </div>
    </section>

    <section class="landing-section landing-section--muted landing-section--center" aria-labelledby="spatch-transmission-heading">
      <div class="figma-container">
        <p class="landing-eyebrow">Always Connected workflow</p>
        <h2 id="spatch-transmission-heading" class="landing-h2">ECG Transmission Without <span class="landing-h2__accent">Manual Uploading</span></h2>
        <p class="landing-p landing-section__intro">The assigned monitoring phone connects to S-Patch over Bluetooth and transmits ECG data over a supported cellular network. The phone is dedicated to the study and keeps the patient experience intentionally simple.</p>
        <p class="landing-p landing-section__intro">Specialized Medical's Always Connected technology supports five cellular networks across two countries: AT&amp;T, T-Mobile and Verizon in the United States, and Telcel and AT&amp;T Mexico in Mexico. This expanded connectivity helps maintain live ECG data transmission in supported monitoring configurations, subject to available coverage and network conditions.</p>
        <div class="landing-feature-grid" role="list">
          <article class="landing-feature-card" role="listitem"><h3 class="landing-h3">Only two patient screens</h3><p class="landing-p">Device Status and Log Symptoms—without web browsing, email, games or unnecessary settings.</p></article>
          <article class="landing-feature-card" role="listitem"><h3 class="landing-h3">Automatic transmission</h3><p class="landing-p">Supported live workflows send ECG data as it is recorded, removing end-of-study batch uploads and related delays. See <a href="live-ecg-monitoring.html">LIVE ECG monitoring</a>.</p></article>
          <article class="landing-feature-card" role="listitem"><h3 class="landing-h3">Five supported networks</h3><p class="landing-p">AT&amp;T, T-Mobile and Verizon in the United States, and Telcel and AT&amp;T Mexico in Mexico, so the workflow can use available coverage across diverse patient environments.</p></article>
        </div>
      </div>
    </section>

    <section class="landing-section landing-section--center" aria-labelledby="spatch-support-heading">
      <div class="figma-container">
        <p class="landing-eyebrow">Proactive support</p>
        <h2 id="spatch-support-heading" class="landing-h2">Operational Issues Can Be Addressed While the <span class="landing-h2__accent">Study Is Active</span></h2>
        <p class="landing-p landing-section__intro">Live test-status visibility helps the support team identify practical problems that might otherwise reduce usable monitoring time.</p>
        <div class="landing-feature-grid landing-feature-grid--2" role="list">
          <article class="landing-feature-card" role="listitem"><h3 class="landing-h3">What the team can follow</h3>
            <ul class="landing-checks"><li>Battery status</li><li>Electrode contact and signal quality</li><li>Monitor-to-phone Bluetooth connection</li><li>Cellular communication</li><li>Whether ECG data is being received</li></ul></article>
          <article class="landing-feature-card" role="listitem"><h3 class="landing-h3">What happens next</h3><p class="landing-p">If an operational indicator moves outside the expected range, Specialized Medical can contact the patient and help correct the issue. The team may guide the patient through electrode, battery, phone or connection steps before more monitoring time is lost.</p><p class="landing-p">This support concerns equipment and transmission status. Clinical findings are handled according to the ordered service and physician-prescribed notification protocol.</p></article>
        </div>
      </div>
    </section>

    <section class="landing-section landing-section--muted landing-section--center" aria-labelledby="spatch-workflow-heading">
      <div class="figma-container">
        <p class="landing-eyebrow">From order to report</p>
        <h2 id="spatch-workflow-heading" class="landing-h2">A Consistent Workflow for Staff and <span class="landing-h2__accent">Physicians</span></h2>
        <ol class="landing-flow landing-flow--spatch" aria-label="S-Patch workflow from order to report">
          <li class="landing-flow__step"><strong>Order and pre-enroll</strong><span>The practice selects the prescribed study and can prepare the patient record before the hookup appointment.</span></li>
          <li class="landing-flow__step"><strong>Hook up the S-Patch</strong><span>Staff follows the placement workflow, pairs the dedicated phone and confirms study readiness.</span></li>
          <li class="landing-flow__step"><strong>Support the active study</strong><span>Specialized Medical assists the patient and monitors relevant operational indicators in supported live workflows.</span></li>
          <li class="landing-flow__step"><strong>Review and finalize</strong><span>The practice receives the applicable physician-ready report with an electronic review, interpretation, dating and signature workflow.</span></li>
        </ol>
        <p class="landing-p landing-section__intro">More on the practice side: <a href="cardiology-practice-cardiac-monitoring.html">cardiac monitoring for cardiology practices</a>.</p>
      </div>
    </section>

    <section class="landing-section" aria-labelledby="spatch-program-heading">
      <div class="figma-container">
        <div class="landing-callout-band">
          <div>
            <h2 id="spatch-program-heading" class="landing-h2">More Than a Monitoring Device</h2>
            <p class="landing-p">Equipment, routine supplies, patient support, live operational visibility, reporting workflow and billing-support templates are organized as one program.</p>
          </div>
          {cta("midpage_demo", "Request a Demonstration")}
        </div>
      </div>
    </section>

    <section class="figma-section faq-accordion landing-section landing-faq landing-section--muted" id="faq" aria-labelledby="spatch-faq-heading">
      <div class="figma-container faq-accordion__inner">
        <p class="landing-eyebrow">Frequently asked questions</p>
        <h2 id="spatch-faq-heading" class="landing-h2">S-Patch System <span class="landing-h2__accent">Answers</span></h2>
        <p class="landing-p">Clear answers for practices evaluating the wearable ECG system and service workflow.</p>
        <div class="faq-category">
          <div class="faq-category__list">
{faq_items}
          </div>
        </div>
      </div>
    </section>

    <section class="landing-section landing-cta-block" id="request-demo" aria-labelledby="spatch-cta-heading">
      <div class="figma-container">
        <div class="landing-cta-block__box">
          <div class="landing-cta-block__copy">
            <h2 id="spatch-cta-heading" class="landing-h2">See S-Patch in Your Own Workflow</h2>
            <p class="landing-p">Request a demonstration or ask about a small no-obligation pilot for your physician practice, cardiology group, hospital or health system.</p>
            <ul class="landing-checks">
              <li>Confirm study types and practice fit</li>
              <li>Review enrollment, hookup and reporting</li>
              <li>Understand patient-support responsibilities</li>
              <li>Plan a controlled pilot before broader rollout</li>
            </ul>
            <p class="landing-p landing-cta-block__phone"><strong>Prefer to speak directly?</strong><br><a href="tel:+18557732633">1-855-SPEC-MED (1-855-773-2633)</a><br><a href="mailto:info@specialized-med.com">info@specialized-med.com</a></p>
          </div>
          <form class="landing-cta-form" action="https://api.web3forms.com/submit" method="POST" data-form-name="s_patch_inquiry" data-track-start="demo_form_start" data-track-submit="sm_lead_form_submit_attempt" data-track-error="demo_form_error" data-track-success="none" data-success-message="Thank you. Your S-Patch request has been sent to the Specialized Medical team." data-error-message="We could not confirm that your request was sent. Please try again or call 1-855-773-2633.">
            <input type="hidden" name="access_key" value="8ec7a28a-1979-4c39-8791-18fbf60bba44">
            <input type="hidden" name="subject" value="S-Patch landing page inquiry">
            <input type="hidden" name="from_name" value="Specialized Medical website">
            <input type="hidden" name="from_page" value="s-patch-cardiac-monitoring-system">
            <input type="hidden" name="originating_service" value="s_patch">
            <input type="hidden" name="redirect" value="">
            <input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" style="display:none" aria-hidden="true">
{hidden}
            <div class="landing-cta-form__row">
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">First name <abbr title="required">*</abbr></span>
                <input name="first_name" type="text" autocomplete="given-name" required>
              </label>
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Last name <abbr title="required">*</abbr></span>
                <input name="last_name" type="text" autocomplete="family-name" required>
              </label>
            </div>
            <div class="landing-cta-form__row">
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Work email <abbr title="required">*</abbr></span>
                <input name="email" type="email" autocomplete="email" required>
              </label>
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Phone <abbr title="required">*</abbr></span>
                <input name="phone" type="tel" autocomplete="tel" required>
              </label>
            </div>
            <div class="landing-cta-form__row">
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Organization <abbr title="required">*</abbr></span>
                <input name="organization" type="text" autocomplete="organization" required>
              </label>
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Role <span class="landing-cta-form__optional">(optional)</span></span>
                <input name="role" type="text" autocomplete="organization-title">
              </label>
            </div>
            <div class="landing-cta-form__row">
              <label class="landing-cta-form__field landing-cta-form__field--full">
                <span class="landing-cta-form__label">Primary interest</span>
                <select name="interest">
{options}
                </select>
              </label>
            </div>
            <div class="landing-cta-form__row">
              <label class="landing-cta-form__field landing-cta-form__field--full">
                <span class="landing-cta-form__label">How can we help? <span class="landing-cta-form__optional">(optional)</span></span>
                <textarea name="message" placeholder="Tell us about your practice and monitoring workflow. Do not include patient information."></textarea>
              </label>
            </div>
            <p class="landing-cta-form__note"><strong>Do not submit protected health information (PHI).</strong> This form is for business and service inquiries only. See the <a href="privacy.html">Privacy Policy</a>. By submitting, you consent to be contacted about Specialized Medical services.</p>
            <button type="submit" class="figma-btn figma-btn--solid landing-cta-form__submit">Request S-Patch Information</button>
            <p class="landing-cta-form__status" role="status" aria-live="polite"></p>
          </form>
        </div>
      </div>
    </section>

    <section class="landing-section landing-section--muted" aria-labelledby="spatch-related-heading">
      <div class="figma-container">
        <h2 id="spatch-related-heading" class="landing-h2">Related Cardiac Monitoring <span class="landing-h2__accent">Resources</span></h2>
        <ul class="landing-related">
          <li><a href="cardiac-monitoring-services.html">Cardiac Monitoring Services</a></li>
          <li><a href="services/equipment.html">Monitoring Equipment</a></li>
          <li><a href="services.html">Service Overview</a></li>
          <li><a href="clinical-stories.html">Clinical Stories</a></li>
          <li><a href="about.html">About Specialized Medical</a></li>
          <li><a href="faq.html">Frequently Asked Questions</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
    </section>

    <section class="landing-disclaimer" aria-label="Information notice">
      <div class="figma-container">
        <p class="landing-disclaimer__text">Information on this page is for healthcare-organization evaluation and does not replace physician judgment, device instructions, or patient-specific medical advice.</p>
      </div>
    </section>
  </main>
"""


def main():
    template = (ROOT / "post-tavr-cardiac-monitoring.html").read_text(encoding="utf8")
    lines = template.split("\n")
    i_base = next(i for i, l in enumerate(lines) if "<!-- sm-site-base -->" in l)
    i_foot = next(i for i, l in enumerate(lines) if '<footer class="site-footer' in l)
    top = "\n".join(lines[: i_base + 1]).replace('<html lang="en">', '<html lang="en-US">')
    if '"s-patch-cardiac-monitoring-system"' not in top:
        top = top.replace('"post-tavr-cardiac-monitoring": 1',
                          '"post-tavr-cardiac-monitoring": 1,\n          "s-patch-cardiac-monitoring-system": 1')
    out = top + "\n" + body().rstrip("\n") + "\n" + "\n".join(lines[i_foot:])
    (ROOT / PAGE).write_text(out, encoding="utf8")
    print("built", PAGE)


if __name__ == "__main__":
    main()
