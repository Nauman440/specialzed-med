/**
 * Mirrors web/src/pages/services.js reporting carousel (scroll + slide advance).
 */
;(function () {
  const REPORT_SCROLL_SPEED_PX_PER_SEC = 52
  const REPORT_SCROLL_DELAY_MS = 450
  const REPORT_PAUSE_AFTER_ANIM_MS = 1200
  const REPORT_STATIC_SLIDE_MS = 6500

  // Image paths are relative to <base href> (injected in <head> on every page).
  const SLIDES = [
    {
      src: "images/figma-services/report-sample.jpg",
      alt: "Sample cardiac monitoring report",
    },
    {
      src: `images/figma-services/${encodeURIComponent("image 381.webp")}`,
      alt: "Sample cardiac monitoring report (page 2)",
    },
  ]

  const frame = document.getElementById("svc-report-frame")
  const imgEl = document.getElementById("svc-report-img")
  if (!frame || !imgEl || SLIDES.length === 0) return

  let reportIdx = 0
  let reportPaused = false
  let reportInView = false
  let reportAdvanceTimer = null
  let forceStartOnNextLoad = false

  function clearAdvance() {
    if (reportAdvanceTimer != null) {
      window.clearTimeout(reportAdvanceTimer)
      reportAdvanceTimer = null
    }
  }

  function scheduleReportAdvance(delayMs) {
    clearAdvance()
    reportAdvanceTimer = window.setTimeout(() => {
      reportAdvanceTimer = null
      if (reportPaused || !reportInView) return
      reportIdx = (reportIdx + 1) % SLIDES.length
      applySlide()
    }, delayMs)
  }

  function setDotActive(i) {
    frame.querySelectorAll("[data-report-dot]").forEach((btn, j) => {
      btn.classList.toggle("is-active", j === i)
    })
  }

  function applySlide() {
    clearAdvance()
    imgEl.getAnimations?.().forEach((a) => a.cancel())
    imgEl.style.transform = "translateY(0px)"
    const slide = SLIDES[reportIdx]
    imgEl.removeAttribute("src")
    imgEl.alt = slide.alt
    imgEl.src = slide.src
    setDotActive(reportIdx)
  }

  function startReportScroll({ delayMs = REPORT_SCROLL_DELAY_MS, force = false } = {}) {
    const img = imgEl
    if (!img) return

    clearAdvance()
    img.getAnimations?.().forEach((a) => a.cancel())
    img.style.transform = "translateY(0px)"

    if (!force && reportPaused) return

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      scheduleReportAdvance(REPORT_STATIC_SLIDE_MS)
      return
    }

    const frameH = frame.clientHeight
    const frameW = frame.clientWidth
    const nw = img.naturalWidth || 0
    const nh = img.naturalHeight || 0
    if (!frameH || !frameW || !nw || !nh) return

    const displayedH = frameW * (nh / nw)
    const maxScroll = Math.max(0, Math.round(displayedH - frameH))
    if (maxScroll < 4) {
      scheduleReportAdvance(REPORT_STATIC_SLIDE_MS)
      return
    }

    const duration = Math.round(
      (maxScroll / REPORT_SCROLL_SPEED_PX_PER_SEC) * 1000
    )
    const anim = img.animate(
      [
        { transform: "translateY(0px)" },
        { transform: `translateY(-${maxScroll}px)` },
      ],
      {
        duration,
        easing: "linear",
        fill: "forwards",
        delay: delayMs,
      }
    )

    anim.finished
      .then(() => {
        if (reportPaused) return
        scheduleReportAdvance(REPORT_PAUSE_AFTER_ANIM_MS)
      })
      .catch(() => {})
  }

  frame.addEventListener("pointerenter", () => {
    reportPaused = true
  })
  frame.addEventListener("pointerleave", () => {
    reportPaused = false
  })

  imgEl.addEventListener("load", () => {
    // Only start when the report section is actually visible (matches Gatsby behavior).
    if (!reportInView) return
    const force = forceStartOnNextLoad
    forceStartOnNextLoad = false
    startReportScroll({ force, delayMs: force ? 0 : REPORT_SCROLL_DELAY_MS })
  })

  frame.querySelectorAll("[data-report-dot]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.getAttribute("data-report-dot"))
      if (Number.isNaN(i)) return
      reportIdx = i
      applySlide()

      // If the user clicks a dot while hovering, `pointerenter` pauses autoplay.
      // Still start the scroll immediately for responsiveness.
      forceStartOnNextLoad = true
      if (
        reportInView &&
        (imgEl.naturalWidth || 0) > 0 &&
        (imgEl.naturalHeight || 0) > 0
      ) {
        startReportScroll({ force: true, delayMs: 0 })
      }
    })
  })

  // Start auto-scroll only when in view.
  // (Prevents animating off-screen and matches Gatsby's IntersectionObserver logic.)
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries && entries[0]
      if (!entry) return
      reportInView = Boolean(entry.isIntersecting)

      if (!reportInView) {
        clearAdvance()
        reportPaused = false
        imgEl.getAnimations?.().forEach((a) => a.cancel())
        imgEl.style.transform = "translateY(0px)"
        return
      }

      // If already loaded, begin immediately.
      if (!reportPaused) {
        if ((imgEl.naturalWidth || 0) > 0 && (imgEl.naturalHeight || 0) > 0) {
          startReportScroll()
        }
      }
    },
    { root: null, threshold: 0.25 }
  )
  observer.observe(frame)

  applySlide()
})()
