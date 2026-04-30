import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const repoRoot = path.resolve(__dirname, "..", "..")
const gatsbyPublic = path.join(repoRoot, "web", "public")
const staticRoot = path.join(repoRoot, "static-site")

const PAIRS = [
  { route: "/", gatsbyHtml: path.join(gatsbyPublic, "index.html"), statHtml: path.join(staticRoot, "index.html") },
  { route: "/about/", gatsbyHtml: path.join(gatsbyPublic, "about", "index.html"), statHtml: path.join(staticRoot, "about.html") },
  { route: "/services/", gatsbyHtml: path.join(gatsbyPublic, "services", "index.html"), statHtml: path.join(staticRoot, "services.html") },
  { route: "/services/equipment/", gatsbyHtml: path.join(gatsbyPublic, "services", "equipment", "index.html"), statHtml: path.join(staticRoot, "services", "equipment.html") },
  { route: "/faq/", gatsbyHtml: path.join(gatsbyPublic, "faq", "index.html"), statHtml: path.join(staticRoot, "faq.html") },
  { route: "/clinical-stories/", gatsbyHtml: path.join(gatsbyPublic, "clinical-stories", "index.html"), statHtml: path.join(staticRoot, "clinical-stories.html") },
  { route: "/contact/", gatsbyHtml: path.join(gatsbyPublic, "contact", "index.html"), statHtml: path.join(staticRoot, "contact.html") },
  { route: "/thanks/", gatsbyHtml: path.join(gatsbyPublic, "thanks", "index.html"), statHtml: path.join(staticRoot, "thanks.html") },
]

function readIfExists(p) {
  try {
    return fs.readFileSync(p, "utf8")
  } catch {
    return null
  }
}

function decodeBasicEntities(s) {
  let out = s
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")

  // Decode numeric entities like &#x27; and &#8217;
  out = out.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
    const cp = parseInt(hex, 16)
    return Number.isFinite(cp) ? String.fromCodePoint(cp) : _
  })
  out = out.replace(/&#([0-9]+);/g, (_, dec) => {
    const cp = parseInt(dec, 10)
    return Number.isFinite(cp) ? String.fromCodePoint(cp) : _
  })

  // Decode common named entities.
  out = out
    .replaceAll("&ldquo;", "“")
    .replaceAll("&rdquo;", "”")
    .replaceAll("&lsquo;", "‘")
    .replaceAll("&rsquo;", "’")
    .replaceAll("&mdash;", "—")
    .replaceAll("&ndash;", "–")
    .replaceAll("&hellip;", "…")

  return out
}

function normalize(s) {
  return decodeBasicEntities(s)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function extractSnippets(html) {
  // Prefer visible text containers.
  // Gatsby output can contain tons of navigation/footer text, so we keep longer snippets only.
  const re = /<(p|h1|h2|h3|li)\b[^>]*>([\s\S]*?)<\/\1>/gim
  const set = new Set()
  let m
  while ((m = re.exec(html))) {
    const raw = m[2]
    const txt = normalize(raw)
    if (!txt) continue
    // Filter too-short boilerplate.
    if (txt.length < 25) continue
    // Avoid menu items repeated everywhere.
    if (/^(Home|About Us|Services|FAQs|Contact)$/i.test(txt)) continue
    set.add(txt)
  }
  return [...set]
}

function comparePage({ route, gatsbyHtml, statHtml }) {
  const gHtml = readIfExists(gatsbyHtml)
  const sHtml = readIfExists(statHtml)
  if (!gHtml || !sHtml) {
    return { route, status: "missing_files", gatsbyHtmlExists: !!gHtml, statHtmlExists: !!sHtml }
  }

  const gSnips = extractSnippets(gHtml)
  const sText = normalize(sHtml)

  const missing = []
  for (const snip of gSnips) {
    const n = normalize(snip)
    if (!n) continue
    // Substring check with normalized snippet.
    if (!sText.includes(n)) {
      missing.push(n)
      if (missing.length >= 25) break
    }
  }

  return { route, gSnips: gSnips.length, missingCount: missing.length, missing }
}

const results = []
for (const pair of PAIRS) results.push(comparePage(pair))

const outPath = path.join(staticRoot, "gatsby-vs-static-tally-report.json")
fs.writeFileSync(outPath, JSON.stringify(results, null, 2), "utf8")

// Also print a short summary to terminal.
for (const r of results) {
  if (r.status === "missing_files") {
    console.log(`[${r.route}] missing_files gatsby:${r.gatsbyHtmlExists} static:${r.statHtmlExists}`)
    continue
  }
  console.log(`[${r.route}] GatsbySnips=${r.gSnips} MissingTop=${r.missingCount}`)
}
console.log("Report:", outPath)

