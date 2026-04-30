import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const siteRoot = path.resolve(__dirname, "..")

const OLD = `      var m = d.head.querySelector("meta[charset]")
      if (m && m.nextSibling) d.head.insertBefore(b, m.nextSibling)
      else d.head.insertBefore(b, d.head.firstChild)`

const NEW = `      var m = d.head.querySelector("meta[charset]")
      if (m && typeof m.insertAdjacentElement === "function") {
        m.insertAdjacentElement("afterend", b)
      } else if (m && m.nextSibling) {
        d.head.insertBefore(b, m.nextSibling)
      } else {
        d.head.insertBefore(b, d.head.firstChild)
      }`

function walkHtml(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walkHtml(p, out)
    else if (ent.name.endsWith(".html")) out.push(p)
  }
  return out
}

for (const abs of walkHtml(siteRoot)) {
  const raw = fs.readFileSync(abs, "utf8")
  if (!raw.includes(OLD)) continue
  fs.writeFileSync(abs, raw.replace(OLD, NEW), "utf8")
  console.log("updated", path.relative(siteRoot, abs))
}
