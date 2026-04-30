/**
 * Injects static-site/partials/header.html and footer.html into each HTML page.
 * Edit those two files (or site-config.mjs for portal URL), then run:
 *   npm run static:partials
 */
import { readFileSync, writeFileSync, existsSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { renderHeader, renderFooter } from "../partials/render-layout.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const STATIC_ROOT = join(__dirname, "..")

/** faq.html is assembled by merge-faq-html.mjs (uses the same partials). */
const PAGES = [
  // Root pages
  { file: "index.html", base: "", active: "home" },
  { file: "404.html", base: "", active: "home" },
  { file: "about.html", base: "", active: "about" },
  { file: "contact.html", base: "", active: "contact" },
  { file: "faq.html", base: "", active: "faq" },
  { file: "services.html", base: "", active: "services" },
  { file: "clinical-stories.html", base: "", active: "services" },
  { file: "thanks.html", base: "", active: "contact" },
  // This page lives in a subfolder, but we inject <base href> so links should
  // be site-root-relative (no ../ prefixes), otherwise nav can escape the subfolder.
  { file: "services/equipment.html", base: "", active: "services" },

  // Pretty URLs (folder index.html)
  { file: "about/index.html", base: "../", active: "about" },
  { file: "contact/index.html", base: "../", active: "contact" },
  { file: "faq/index.html", base: "../", active: "faq" },
  { file: "services/index.html", base: "../", active: "services" },
  { file: "clinical-stories/index.html", base: "../", active: "services" },
  { file: "thanks/index.html", base: "../", active: "contact" },
  { file: "services/equipment/index.html", base: "../../", active: "services" },
]

const HEADER_RE =
  /\s*<header class="site-header site-header--figma">[\s\S]*?<\/header>/
const FOOTER_RE =
  /\s*<footer class="site-footer site-footer--figma">[\s\S]*?<\/footer>/

for (const { file, base, active } of PAGES) {
  const path = join(STATIC_ROOT, file)
  if (!existsSync(path)) {
    console.warn(`skip (missing file): ${file}`)
    continue
  }
  let html = readFileSync(path, "utf8")
  const header = renderHeader({ base, active })
  const footer = renderFooter({ base })
  if (!HEADER_RE.test(html)) {
    console.warn(`skip header (no figma header match): ${file}`)
  } else {
    html = html.replace(HEADER_RE, `\n${header.trimEnd()}\n`)
  }
  if (!FOOTER_RE.test(html)) {
    console.warn(`skip footer (no figma footer match): ${file}`)
  } else {
    html = html.replace(FOOTER_RE, `\n${footer.trimEnd()}\n`)
  }
  writeFileSync(path, html, "utf8")
  console.log("updated", file)
}
