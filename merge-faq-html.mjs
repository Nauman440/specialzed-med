import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { renderHeader, renderFooter } from "./partials/render-layout.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const frag = fs.readFileSync(join(__dirname, "faq-accordion-fragment.html"), "utf8");

const headerHtml = renderHeader({ base: "", active: "faq" });
const footerHtml = renderFooter({ base: "" });

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FAQ | Specialized Medical</title>
  <meta name="description" content="Everything you need to know about Specialized Medical's cardiac monitoring services—workflow, reports, billing, supplies, patient experience, and the no-risk beta trial.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/home.css">
  <link rel="stylesheet" href="css/faq.css">
</head>
<body>
  <div class="site-root">
${headerHtml}
    <main class="faq-page faq-page--figma" data-design="figma-17-396">
      <section class="faq-figma-hero" aria-labelledby="faq-hero-heading">
        <div class="faq-figma-hero__plate">
          <div class="faq-figma-hero__bg" role="presentation"></div>
          <div class="faq-figma-hero__gradient" aria-hidden="true"></div>
          <div class="figma-container faq-figma-hero__inner">
            <p class="figma-hero__pill">
              <span class="figma-hero__pill-dot" aria-hidden="true"></span>
              FAQ
            </p>
            <h1 id="faq-hero-heading" class="faq-figma-hero__title">
              Frequently Asked <span class="faq-figma-hero__title-accent">Questions</span>
            </h1>
            <p class="faq-figma-hero__lead">Everything you need to know about Specialized Medical's cardiac monitoring services.</p>
          </div>
        </div>
      </section>

      <section class="figma-section faq-accordion" aria-label="FAQ topics">
        <div class="figma-container faq-accordion__inner">
${frag}
        </div>
      </section>

      <section class="figma-section faq-testimonials" aria-labelledby="testimonials-heading">
        <div class="figma-container">
          <div class="faq-testimonials__layout">
            <div class="faq-testimonials__photo">
              <img src="images/figma-faq/faq-testimonial-portrait.jpg" alt="Patient during daily activity" width="305" height="426" loading="lazy" decoding="async">
              <div class="faq-testimonials__dots" aria-hidden="true">
                <button class="faq-testimonials__dot is-active" type="button" aria-label="Show image 1"></button>
                <button class="faq-testimonials__dot" type="button" aria-label="Show image 2"></button>
                <button class="faq-testimonials__dot" type="button" aria-label="Show image 3"></button>
              </div>
            </div>
            <div class="faq-testimonials__right">
              <h2 id="testimonials-heading" class="faq-testimonials__title">
                What People Are <span class="faq-testimonials__title-accent">Saying</span>
              </h2>
              <div class="faq-testimonials__cards">
                <blockquote class="faq-testimonial-card">
                  <p>They immediately transmitted the reports to me and then called me on my cell phone.</p>
                  <footer>Michael R, M.D.</footer>
                </blockquote>
                <blockquote class="faq-testimonial-card">
                  <p>I did not even realize I was wearing it</p>
                  <footer>R. Gall</footer>
                </blockquote>
                <blockquote class="faq-testimonial-card">
                  <p>If it was not for Specialized Medical's technology and service I am not sure if this patient would be around today.</p>
                  <footer>Dr. Catalina R.S.</footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="figma-section figma-cta faq-figma-cta" aria-labelledby="faq-cta-heading">
        <div class="figma-container">
          <div class="figma-cta__box">
            <h2 id="faq-cta-heading" class="figma-h2 figma-h2--center figma-h2--narrow">
              Start Your No-Risk<br>
              <span class="figma-h2__accent">Beta Trial</span>
            </h2>
            <p class="figma-cta__p figma-cta__p--lead">See how Specialized Medical can support your practice with: live-streaming ECG data; simplified office workflow.</p>
            <p class="figma-cta__p">Evaluate Specialized Medical with a small, no-obligation beta trial. If it isn’t the right fit, we’ll take everything back—no hassle.</p>
            <div class="figma-cta__actions">
              <a class="figma-btn figma-btn--solid" href="contact.html">Start Your No-Risk Beta Trial</a>
              <a class="figma-cta__talk" href="contact.html">Talk to Our Team→</a>
            </div>
          </div>
        </div>
      </section>
    </main>

${footerHtml}
  </div>
  <script src="js/main.js" defer></script>
</body>
</html>
`;

fs.writeFileSync(join(__dirname, "faq.html"), html, "utf8");
console.log("Wrote faq.html");
