import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const siteRoot = path.resolve(__dirname, "..")

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, out)
    else if (ent.name.endsWith(".html")) out.push(p)
  }
  return out
}

const FILES = walk(siteRoot).filter((p) => p.endsWith(".html"))
const FROM = "â†’"
const TO = "→"

let changed = 0
for (const f of FILES) {
  const raw = fs.readFileSync(f, "utf8")
  if (!raw.includes(FROM)) continue
  const next = raw.split(FROM).join(TO)
  fs.writeFileSync(f, next, "utf8")
  changed++
}

console.log(`Changed ${changed} HTML file(s).`)

