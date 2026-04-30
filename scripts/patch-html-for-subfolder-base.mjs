/**
 * One-off / repeatable patch: inject <base> + strip root-absolute internal URLs
 * so the static site works under any subdirectory (e.g. /specialized-medical-static/).
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const siteRoot = path.resolve(__dirname, "..")

const BASE_SNIPPET = `  <script>
    (function (w, d) {
      function siteRootPathname() {
        var segs = w.location.pathname.split("/").filter(Boolean)
        // Some hosting panels / preview URLs can include a filesystem-like prefix
        // such as /home/<user>/public_html/<site>/... . If present, strip it so
        // <base href> always points at the public site path.
        var ph = segs.lastIndexOf("public_html")
        if (ph !== -1) segs = segs.slice(ph + 1)
        var leaf = { about: 1, services: 1, faq: 1, contact: 1, "clinical-stories": 1, thanks: 1, "404": 1 }
        while (segs.length) {
          var last = segs[segs.length - 1]
          if (last === "equipment" && segs.length >= 2 && segs[segs.length - 2] === "services") {
            segs.length -= 2
            break
          }
          if (/\\.html$/i.test(last)) {
            segs.pop()
            continue
          }
          if (leaf[last]) {
            segs.pop()
            continue
          }
          break
        }
        return "/" + (segs.join("/") + (segs.length ? "/" : ""))
      }
      var p = siteRootPathname()
      var h = w.location.origin + (p === "/" ? "/" : p)
      var b = d.createElement("base")
      b.href = h
      var m = d.head.querySelector("meta[charset]")
      if (m && typeof m.insertAdjacentElement === "function") {
        m.insertAdjacentElement("afterend", b)
      } else if (m && m.nextSibling) {
        d.head.insertBefore(b, m.nextSibling)
      } else {
        d.head.insertBefore(b, d.head.firstChild)
      }
    })(window, document)
  </script>
  <!-- sm-site-base -->`

function walkHtml(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walkHtml(p, out)
    else if (ent.name.endsWith(".html")) out.push(p)
  }
  return out
}

function patchContent(absPath, relFromSite, raw) {
  let c = raw
  if (!c.includes("<!-- sm-site-base -->")) {
    const m = c.match(/<meta\s+charset="utf-8"\s*>/i)
    if (!m) {
      console.warn("skip (no charset meta):", relFromSite)
      return c
    }
    c = c.replace(m[0], `${m[0]}\n${BASE_SNIPPET}`)
  } else {
    // Keep the injected base logic up-to-date (replace the old injected snippet).
    c = c.replace(
      /<script>\s*\(\s*function\s*\(w,\s*d\)\s*\{[\s\S]*?<!-- sm-site-base -->/m,
      BASE_SNIPPET
    )
  }
  c = c.replace(/href="\/"/g, 'href="./"')
  c = c.replace(/href="\/(?!\/)/g, 'href="')
  c = c.replace(/src="\/(?!\/)/g, 'src="')
  c = c.replace(/action="\/(?!\/)/g, 'action="')

  if (relFromSite.replace(/\\/g, "/") === "services/equipment.html") {
    c = c.replace(/href="\.\.\/"/g, 'href="./"')
    c = c.replace(/href="\.\.\//g, 'href="')
    c = c.replace(/src="\.\.\//g, 'src="')
    c = c.replace(/href="services\.html"/g, 'href="services/"')
  }
  return c
}

const htmlFiles = walkHtml(siteRoot).filter((p) => {
  const rel = path.relative(siteRoot, p).replace(/\\/g, "/")
  if (rel.startsWith("node_modules")) return false
  return true
})

for (const abs of htmlFiles) {
  const rel = path.relative(siteRoot, abs)
  const before = fs.readFileSync(abs, "utf8")
  const after = patchContent(abs, rel.replace(/\\/g, "/"), before)
  if (after !== before) {
    fs.writeFileSync(abs, after, "utf8")
    console.log("patched", rel)
  }
}
