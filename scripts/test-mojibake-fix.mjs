import fs from "node:fs"

function inspect(file) {
  const raw = fs.readFileSync(file, "utf8")
  const hits = new Map()

  for (let i = 0; i < raw.length - 2; i++) {
    const c0 = raw.charCodeAt(i) // â
    const c1 = raw.charCodeAt(i + 1) // €
    if (c0 === 0x00e2 && c1 === 0x20ac) {
      const c2 = raw.codePointAt(i + 2) // next char (quote/apostrophe-ish)
      const seq = raw.slice(i, i + 3)
      const prev = raw.slice(Math.max(0, i - 25), i)
      const next = raw.slice(i + 3, Math.min(raw.length, i + 25))
      const key = c2.toString(16)
      if (!hits.has(key)) hits.set(key, { count: 0, seqExample: seq, contexts: [] })
      const h = hits.get(key)
      h.count++
      if (h.contexts.length < 2) {
        h.contexts.push({ prev: prev.slice(-18), next: next.slice(0, 18), seq })
      }
    }
  }

  console.log("===", file)
  for (const [k, v] of [...hits.entries()].sort((a, b) => Number(a[0], 16) - Number(b[0], 16))) {
    console.log(
      "mojibake pattern â€ + codepoint:",
      "0x" + k,
      "count:",
      v.count,
      "example:",
      JSON.stringify(v.seqExample)
    )
    for (const c of v.contexts) {
      console.log("  context:", JSON.stringify(c.prev + c.seq + c.next))
    }
  }
}

inspect("d:/Desktop/specialized medical-html/static-site/index.html")
inspect("d:/Desktop/specialized medical-html/static-site/services.html")

