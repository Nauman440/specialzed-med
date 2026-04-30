/**
 * Generates `static-site/thanks.html` from `web/src/pages/thanks.js` (Figma layout).
 */
import fs from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { renderFooter, renderHeader } from "./partials/render-layout.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))

const main = `<main class="thanks-page">
      <section class="figma-section thanks-page__section" aria-labelledby="thanks-heading">
        <div class="figma-container">
          <div class="thanks-page__card">
            <div class="thanks-page__icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h1 id="thanks-heading" class="figma-h2 thanks-page__title">Thank you</h1>
            <p class="thanks-page__lead">
              Your message has been received. A member of our team will follow up shortly.
            </p>
            <p class="thanks-page__next" id="thanks-next">What happens next</p>
            <ul class="thanks-page__list" aria-labelledby="thanks-next">
              <li>We review your inquiry and route it to the right specialist.</li>
              <li>If you requested a demo or trial, we will reach out to schedule a time that works for your practice.</li>
              <li>If you need immediate assistance, call <a href="tel:+18557732633">1-855-773-2633</a>.</li>
            </ul>
            <div class="thanks-page__actions">
              <a class="figma-btn figma-btn--solid" href="index.html">Back to Home</a>
              <a class="figma-btn figma-btn--outline-dark" href="contact.html">Contact us again</a>
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
  <title>Thank you | Specialized Medical</title>
  <meta name="robots" content="noindex">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/home.css">
</head>
<body>
  <div class="site-root">
${renderHeader({ base: "", active: "contact" })}
${main}
${renderFooter({ base: "" })}
  </div>
  <script src="js/main.js" defer></script>
</body>
</html>`

fs.writeFileSync(join(__dirname, "thanks.html"), html, "utf8")
console.log("Wrote thanks.html")

