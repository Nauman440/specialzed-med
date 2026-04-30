import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const repoRoot = path.resolve(__dirname, "..", "..")
const gatsbyFaqSource = path.join(repoRoot, "web", "src", "pages", "faq.js")
const staticFaqHtml = path.join(repoRoot, "static-site", "faq.html")

function decodeEntities(s) {
  if (!s) return ""
  return s
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      const cp = parseInt(hex, 16)
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : _
    })
    .replace(/&#([0-9]+);/g, (_, dec) => {
      const cp = parseInt(dec, 10)
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : _
    })
    .replaceAll("&ldquo;", "“")
    .replaceAll("&rdquo;", "”")
    .replaceAll("&lsquo;", "‘")
    .replaceAll("&rsquo;", "’")
    .replaceAll("&mdash;", "—")
    .replaceAll("&ndash;", "–")
    .replaceAll("&hellip;", "…")
}

function norm(s) {
  return decodeEntities(s)
    .replace(/\s+/g, " ")
    .trim()
}

function extractStaticFaqQuestions(html) {
  // Question text is inside: <span class="faq-item__q">...</span>
  const re = /<span class="faq-item__q">([\s\S]*?)<\/span>/gim
  const out = []
  let m
  while ((m = re.exec(html))) {
    out.push(norm(m[1]))
  }
  return out
}

function extractGatsbyFaqQuestions(source) {
  // In web/src/pages/faq.js, each item is: { q: "..." }
  const out = []
  const re = /q:\s*"([^"]+)"/g
  let m
  while ((m = re.exec(source))) out.push(norm(m[1]))
  return out
}

function extractGatsbyFaqSectionTitles(source) {
  // titles inside FAQ_SECTIONS: { title: "..." , items: [...] }
  const out = []
  const re = /FAQ_SECTIONS\s*=\s*\[\s*([\s\S]*?)\]\s*const TESTIMONIALS/m
  const m = re.exec(source)
  const block = m ? m[1] : source
  const titles = block.match(/title:\s*"([^"]+)"/g) || []
  for (const t of titles) {
    const mm = /title:\s*"([^"]+)"/.exec(t)
    if (mm) out.push(norm(mm[1]))
  }
  return out
}

function main() {
  const gatsbySource = fs.readFileSync(gatsbyFaqSource, "utf8")
  const staticHtml = fs.readFileSync(staticFaqHtml, "utf8")

  const gQ = extractGatsbyFaqQuestions(gatsbySource)
  const sQ = extractStaticFaqQuestions(staticHtml)

  const okCount = Math.min(gQ.length, sQ.length)
  let firstDiff = -1
  for (let i = 0; i < okCount; i++) {
    if (gQ[i] !== sQ[i]) {
      firstDiff = i
      break
    }
  }

  const result = {
    gatsbyQuestions: gQ.length,
    staticQuestions: sQ.length,
    firstDiffIndex: firstDiff,
    gatsbyFirstDiff: firstDiff >= 0 ? gQ[firstDiff] : null,
    staticFirstDiff: firstDiff >= 0 ? sQ[firstDiff] : null,
  }

  const gTitles = extractGatsbyFaqSectionTitles(gatsbySource)
  result.gatsbySectionTitles = gTitles

  fs.writeFileSync(
    path.join(repoRoot, "static-site", "faq-gatsby-parity.json"),
    JSON.stringify(result, null, 2),
    "utf8"
  )

  const missingInStatic = gQ.filter((q) => !sQ.includes(q))
  const extraInStatic = sQ.filter((q) => !gQ.includes(q))
  console.log("FAQ parity result:", result)
  console.log("Missing in static:", missingInStatic)
  console.log("Extra in static:", extraInStatic)
  console.log("Wrote: static-site/faq-gatsby-parity.json")
}

main()

