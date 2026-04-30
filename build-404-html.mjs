/**
 * Generates `static-site/404.html` from `web/src/pages/404.js`.
 */
import fs from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { renderFooter, renderHeader } from "./partials/render-layout.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))

const main = `<main class="page-404">
      <div class="container">
        <h1 class="page-404__title">Page not found</h1>
        <p class="page-404__text">Sorry, we couldn&apos;t find what you were looking for.</p>
        <a href="index.html" class="btn btn--primary">Go home</a>
      </div>
    </main>`

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page not found | Specialized Medical</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/home.css">
</head>
<body>
  <div class="site-root">
${renderHeader({ base: "", active: "home" })}
${main}
${renderFooter({ base: "" })}
  </div>
  <script src="js/main.js" defer></script>
</body>
</html>`

fs.writeFileSync(join(__dirname, "404.html"), html, "utf8")
console.log("Wrote 404.html")

