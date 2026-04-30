import { readFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { PATIENT_PORTAL_URL } from "./site-config.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))

const headerTpl = readFileSync(join(__dirname, "header.html"), "utf8")
const footerTpl = readFileSync(join(__dirname, "footer.html"), "utf8")

const NAV = ["home", "about", "services", "faq", "contact"]

/**
 * @param {object} opts
 * @param {string} [opts.base] Path prefix: "" for site root pages, "../" for services/* etc.
 * @param {string} [opts.active] One of: home | about | services | faq | contact
 */
export function renderHeader({ base = "", active = "home" } = {}) {
  const vars = {
    BASE: base,
    // Home link should resolve under <base href> (supports subfolder hosting)
    BASE_HOME: base || "./",
    PORTAL_URL: PATIENT_PORTAL_URL,
  }
  for (const key of NAV) {
    const token = `ACTIVE_${key.toUpperCase()}`
    vars[token] = active === key ? " is-active" : ""
  }
  return fillTemplate(headerTpl, vars)
}

/**
 * @param {object} opts
 * @param {string} [opts.base] Path prefix: "" or "../"
 */
export function renderFooter({ base = "" } = {}) {
  return fillTemplate(footerTpl, {
    BASE: base,
    BASE_HOME: base || "./",
    PORTAL_URL: PATIENT_PORTAL_URL,
  })
}

function fillTemplate(str, vars) {
  return str.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, name) => {
    if (Object.prototype.hasOwnProperty.call(vars, name)) {
      return vars[name]
    }
    return ""
  })
}
