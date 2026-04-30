import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const siteRoot = path.resolve(__dirname, "..")

const MAP = new Map([
  // These are Windows-1252 mojibake sequences produced when UTF-8 punctuation
  // was decoded as cp1252. We detect them as: "â" (0x00E2) + "€" (0x20AC) + <third char>.
  [0x201d, "—"], // â€” (em dash)
  [0x201c, "–"], // â€“ (en dash)
  [0x2122, "’"], // â€™
  [0x02dc, "‘"], // â€˜
  [0x0153, "“"], // â€œ
  [0x009d, "”"], // â€
  [0x2026, "…"], // â€¦
  [0x00a6, "…"], // â€¦ (variant)
])

function fixText(raw) {
  let out = ""
  for (let i = 0; i < raw.length; i++) {
    if (
      i + 2 < raw.length &&
      raw.charCodeAt(i) === 0x00e2 && // â
      raw.charCodeAt(i + 1) === 0x20ac // €
    ) {
      const c2 = raw.charCodeAt(i + 2)
      const mapped = MAP.get(c2)
      if (mapped) {
        out += mapped
        i += 2 // consume 3 chars total
        continue
      }
    }
    out += raw[i]
  }
  return out
}

function walk(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const it of items) {
    const p = path.join(dir, it.name)
    if (it.isDirectory()) files.push(...walk(p))
    else files.push(p)
  }
  return files
}

const files = walk(siteRoot).filter((p) => p.endsWith(".html") || p.endsWith(".js") || p.endsWith(".css"))

let changed = 0
for (const p of files) {
  // read as utf8 (these mojibake chars are already in the file text)
  const raw = fs.readFileSync(p, "utf8")
  const fixed = fixText(raw)
  if (fixed !== raw) {
    fs.writeFileSync(p, fixed, "utf8")
    changed++
    process.stdout.write(".")
  }
}
process.stdout.write("\n")
console.log("Changed files:", changed)

