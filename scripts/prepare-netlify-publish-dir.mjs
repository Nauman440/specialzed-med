/**
 * Netlify UI can sometimes be mis-set to:
 *   base = static-site
 *   publish = static-site
 * which makes Netlify look for: static-site/static-site
 *
 * This script creates that publish directory and mirrors the repo's Netlify
 * functions into static-site/netlify/functions so deploys don't fail.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
 
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const staticRoot = path.resolve(__dirname, "..") // .../static-site
const repoRoot = path.resolve(staticRoot, "..")
 
const publishDir = path.join(staticRoot, "static-site")
 
function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true })
}
 
function rmDirIfExists(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true })
}
 
function copyDirRecursive(from, to, { filter } = {}) {
  if (!fs.existsSync(from)) return
  ensureDir(to)
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name)
    const dest = path.join(to, entry.name)

    if (filter && !filter(src)) continue

    if (entry.isDirectory()) {
      copyDirRecursive(src, dest, { filter })
    } else if (entry.isSymbolicLink()) {
      const linkTarget = fs.readlinkSync(src)
      fs.symlinkSync(linkTarget, dest)
    } else {
      ensureDir(path.dirname(dest))
      fs.copyFileSync(src, dest)
    }
  }
}
 
// 1) Create static-site/static-site with the contents of static-site (excluding itself).
rmDirIfExists(publishDir)
ensureDir(publishDir)
 
copyDirRecursive(staticRoot, publishDir, {
  filter: (src) => {
    // Avoid recursion: don't copy the publishDir into itself.
    if (src === publishDir) return false
    if (src.startsWith(publishDir + path.sep)) return false
    return true
  },
})
 
// 2) Mirror repo-root netlify/functions into static-site/netlify/functions
const functionsFrom = path.join(repoRoot, "netlify", "functions")
const functionsTo = path.join(staticRoot, "netlify", "functions")
rmDirIfExists(path.join(staticRoot, "netlify"))
copyDirRecursive(functionsFrom, functionsTo)
 
console.log(`prepare-netlify-publish-dir: wrote ${publishDir}`)
console.log(`prepare-netlify-publish-dir: mirrored functions into ${functionsTo}`)

