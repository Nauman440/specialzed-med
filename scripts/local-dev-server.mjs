import http from "node:http"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const siteRoot = path.resolve(__dirname, "..")

const PORT = Number(process.env.PORT || 5173)

function safeJoin(root, reqPath) {
  const p = decodeURIComponent(reqPath.split("?")[0] || "/")
  const clean = p.replace(/\\/g, "/")
  const rel = clean.startsWith("/") ? clean.slice(1) : clean
  const full = path.resolve(root, rel)
  if (!full.startsWith(root)) return null
  return full
}

const MIME = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
  [".pdf", "application/pdf"],
  [".mp4", "video/mp4"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
])

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Cache-Control": "no-store", ...headers })
  res.end(body)
}

function fileExists(p) {
  try {
    const st = fs.statSync(p)
    return st.isFile()
  } catch {
    return false
  }
}

function serveFile(res, absPath) {
  const ext = path.extname(absPath).toLowerCase()
  const type = MIME.get(ext) || "application/octet-stream"
  try {
    const buf = fs.readFileSync(absPath)
    send(res, 200, buf, { "Content-Type": type })
  } catch {
    send(res, 404, "Not Found")
  }
}

function resolvePrettyUrl(urlPath) {
  // Prefer exact files first
  const direct = safeJoin(siteRoot, urlPath)
  if (direct && fileExists(direct)) return direct

  // Directory-style routes map to flat .html pages
  const p = (urlPath || "/").split("?")[0]
  if (p === "/" || p === "") return path.join(siteRoot, "index.html")

  // /services/equipment/ => services/equipment.html
  const noTrail = p.replace(/\/+$/, "")
  if (noTrail.includes("/services/equipment")) {
    return path.join(siteRoot, "services", "equipment.html")
  }

  const leaf = noTrail.split("/").filter(Boolean).pop()
  if (!leaf) return path.join(siteRoot, "index.html")

  return path.join(siteRoot, `${leaf}.html`)
}

const server = http.createServer((req, res) => {
  const urlPath = req.url || "/"
  const abs = resolvePrettyUrl(urlPath)
  if (!abs) return send(res, 400, "Bad Request")
  return serveFile(res, abs)
})

server.listen(PORT, "127.0.0.1", () => {
  // eslint-disable-next-line no-console
  console.log(`Static site running at http://localhost:${PORT}/`)
  // eslint-disable-next-line no-console
  console.log(`Pretty URLs supported (e.g. /about/, /services/, /faq/).`)
})

