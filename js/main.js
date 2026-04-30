/**
 * Specialized Medical — static site behaviors (nav, FAQ, contact form, hero CSS bg fallback).
 */
(function () {
  function getSiteRootPath() {
    // We deploy sometimes under a subfolder (e.g. /specialized-medical/static-site/).
    // Derive the site "root" from this script tag URL so asset paths always resolve.
    var scripts = Array.prototype.slice.call(document.scripts || []);
    var script = scripts.find(function (s) {
      return (s.getAttribute("src") || "").indexOf("js/main.js") !== -1;
    });
    var src = script && script.src;
    if (!src) return "";

    try {
      var u = new URL(src, window.location.href);
      var p = u.pathname || "";
      var idx = p.lastIndexOf("/js/main.js");
      return idx >= 0 ? p.slice(0, idx) : "";
    } catch (e) {
      return "";
    }
  }

  var SITE_ROOT = getSiteRootPath();

  function siteBaseUrl() {
    var r = SITE_ROOT || "";
    if (!r) return String(window.location.origin || "") + "/";
    return String(window.location.origin || "") + (r.endsWith("/") ? r : r + "/");
  }

  /** Root-absolute internal paths like /about/ → stay under SITE_ROOT when hosted in a subfolder. */
  function normalizeRootAbsoluteHref(href) {
    if (!href || typeof href !== "string") return href;
    if (href.startsWith("//")) return href;
    if (!href.startsWith("/")) return href;
    try {
      var tail = href.slice(1) || "./";
      return String(new URL(tail, siteBaseUrl()));
    } catch (e) {
      return href;
    }
  }

  function initInternalRootLinks() {
    qsa("a[href]").forEach(function (a) {
      var h = a.getAttribute("href") || "";
      if (!h.startsWith("/") || h.startsWith("//")) return;
      try {
        a.setAttribute("href", normalizeRootAbsoluteHref(h));
      } catch (_) {}
    });
  }

  /**
   * Without a working <base>, href="faq/" on /folder/services/ resolves to /folder/services/faq/ (404).
   * Resolve same-directory-style links against the real site root (from js/main.js path).
   */
  function fixRelativeAnchorsToSiteRoot() {
    var root = siteBaseUrl();
    qsa("a[href]").forEach(function (a) {
      var h = a.getAttribute("href") || "";
      if (!h) return;
      if (/^(https?:|mailto:|tel:|#)/i.test(h)) return;
      if (h.startsWith("//")) return;
      if (h.startsWith("/")) return;
      if (h.startsWith("../")) return;
      try {
        a.setAttribute("href", String(new URL(h, root)));
      } catch (_) {}
    });
  }

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function pauseOtherVideos(current) {
    qsa("video").forEach(function (v) {
      if (v === current) return;
      try {
        if (!v.paused) v.pause();
      } catch (_) {}
    });
  }

  function initNav() {
    var toggle = qs(".nav-toggle");
    var inner = qs(".site-header__inner");
    var overlay = qs(".nav-overlay");
    if (!toggle || !inner) return;

    function setOpen(open) {
      inner.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
      if (overlay) {
        overlay.hidden = !open;
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(!inner.classList.contains("nav-open"));
    });

    if (overlay) {
      overlay.addEventListener("click", function () {
        setOpen(false);
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && inner.classList.contains("nav-open")) {
        setOpen(false);
      }
    });

    qsa(".site-nav a, .figma-nav a", inner).forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });
  }

  function initFooterYear() {
    var el = document.getElementById("footer-year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function initHeroVisualFallback() {
    var img = qs(".figma-hero__photo");
    if (img) {
      var fallback =
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=85";
      img.addEventListener("error", function onHeroImgErr() {
        img.removeEventListener("error", onHeroImgErr);
        img.src = fallback;
      });
      return;
    }
    var el = qs(".hero.hero--reference");
    if (!el) return;
    var local = "images/hero-banner.jpg";
    var fallback =
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=85";
    var probe = new Image();
    probe.onerror = function () {
      el.style.backgroundImage = "url(" + fallback + ")";
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "70% center";
    };
    probe.src = local;
  }

  function initFaqAccordion() {
    var root = qs(".faq-accordion");
    if (!root) return;

    qsa(".faq-item__trigger", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".faq-item");
        if (!item) return;
        var wasOpen = item.classList.contains("is-open");

        qsa(".faq-item", root).forEach(function (other) {
          other.classList.remove("is-open");
          var p = other.querySelector(".faq-item__panel");
          var t = other.querySelector(".faq-item__trigger");
          if (p) p.hidden = true;
          if (t) t.setAttribute("aria-expanded", "false");
          var ch = other.querySelector(".faq-item__chevron");
          if (ch) ch.classList.remove("is-open");
        });

        if (!wasOpen) {
          item.classList.add("is-open");
          var panel = item.querySelector(".faq-item__panel");
          if (panel) panel.hidden = false;
          btn.setAttribute("aria-expanded", "true");
          var chev = btn.querySelector(".faq-item__chevron");
          if (chev) chev.classList.add("is-open");
        }
      });
    });
  }

  function initFaqTestimonialsCarousel() {
    var photoWrap = qs(".faq-testimonials__photo");
    if (!photoWrap) return;
    var img = qs("img", photoWrap);
    if (!img) return;

    var dotsWrap = qs(".faq-testimonials__dots", photoWrap);
    var slides = [
      {
        src: SITE_ROOT + "/images/figma-faq/faq-testimonial-portrait.jpg",
        alt: "Patient during daily activity",
      },
      {
        src: SITE_ROOT + "/images/figma-services/case-01.jpg",
        alt: "Patient-friendly design and wear experience",
      },
      {
        src: SITE_ROOT + "/images/figma-services/four-tests-device.jpg",
        alt: "Cardiac monitoring device for four test types",
      },
    ];

    var idx = 0;
    var paused = false;

    function syncDots() {
      if (!dotsWrap) return;
      var dots = qsa(".faq-testimonials__dot", dotsWrap);
      dots.forEach(function (d, di) {
        d.classList.toggle("is-active", di === idx);
      });
    }

    function setSlide(i) {
      idx = (i + slides.length) % slides.length;
      img.src = slides[idx].src;
      img.alt = slides[idx].alt;
      syncDots();
    }

    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      slides.forEach(function (_, i) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "faq-testimonials__dot" + (i === 0 ? " is-active" : "");
        btn.setAttribute("aria-label", "Show image " + String(i + 1));
        btn.addEventListener("click", function () {
          setSlide(i);
        });
        dotsWrap.appendChild(btn);
      });
    }

    photoWrap.addEventListener("pointerenter", function () {
      paused = true;
    });
    photoWrap.addEventListener("pointerleave", function () {
      paused = false;
    });

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    window.setInterval(function () {
      if (paused) return;
      setSlide(idx + 1);
    }, 3500);
  }

  function initContactPage() {
    var form = qs(".contact-form");
    if (!form) return;

    var submitBtn = qs('button[type="submit"]', form);
    var statusEl = qs(".contact-form__status", form);

    function setStatus(msg, isError) {
      if (!statusEl) return;
      statusEl.textContent = msg || "";
      statusEl.style.color = isError ? "#c9222f" : "rgba(35,31,30,0.7)";
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (submitBtn && submitBtn.disabled) return;

      var fd = new FormData(form);
      // Web3Forms requires an absolute redirect URL; set it at submit time.
      try {
        var redirectEl = form.querySelector('input[name="redirect"]');
        if (redirectEl && !redirectEl.value) {
          redirectEl.value = String(new URL("thanks.html", siteBaseUrl()));
        }
      } catch (_) {}
      // If access_key isn't in the form for any reason, add it (client-side mode).
      if (!fd.get("access_key")) {
        fd.append("access_key", "8ec7a28a-1979-4c39-8791-18fbf60bba44");
      }
      fd.append("subject", "New contact request — Specialized Medical");
      fd.append(
        "name",
        (String(fd.get("firstName") || "") + " " + String(fd.get("lastName") || "")).trim()
      );

      var originalText = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;
      }
      setStatus("Sending…", false);

      try {
        var response = await fetch(form.getAttribute("action") || "https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: fd,
        });
        var data = await response.json().catch(function () {
          return null;
        });

        if (response.ok && data && data.success === true) {
          setStatus("Success! Your message has been sent.", false);

          var redirectEl = null;
          var dest = String(new URL("thanks/", siteBaseUrl()));
          try {
            redirectEl = form.querySelector('input[name="redirect"]');
            if (redirectEl && redirectEl.value) dest = String(redirectEl.value);
          } catch (_) {}

          try {
            window.sessionStorage.setItem("sm_form_submitted", "1");
            window.sessionStorage.setItem("sm_form_submitted_at", String(Date.now()));
          } catch (_) {}

          // Redirect first (some browsers/extensions can interfere after form.reset()).
          try {
            window.setTimeout(function () {
              window.location.assign(dest);
            }, 50);
            return;
          } catch (_) {}

          form.reset();
        } else {
          // If the server didn't return JSON (common when PHP isn't executing on a static server),
          // fall back to normal form submit so the server can handle it.
          if (!data) {
            try {
              form.submit();
              return;
            } catch (_) {}
            setStatus("Error: Server returned an unexpected response. (Is PHP running on your host?)", true);
            return;
          }
          var msg = data.message || "Unable to send."
          setStatus("Error: " + msg, true);
        }
      } catch (error) {
        // If fetch is blocked (ad blockers / network / bot protection), fall back to normal form POST.
        try {
          form.submit();
          return;
        } catch (_) {}
        setStatus("Something went wrong. Please try again.", true);
      } finally {
        if (submitBtn) {
          submitBtn.textContent = originalText || "Submit";
          submitBtn.disabled = false;
        }
      }
    });

    qsa(".contact-action-card").forEach(function (card) {
      card.addEventListener("click", function () {
        var hash = card.getAttribute("data-interest") || "";
        var wrap = qs(".contact-main__form-wrap");
        if (wrap) {
          wrap.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        if (hash && form) {
          var select = form.querySelector('select[name="interest"]');
          if (select) select.value = hash;
        }
      });
    });
  }

  function initVideoPlayStub() {
    qsa(".video-frame__play").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
      });
    });
  }

  function initEcgVideoEndTrim() {
    var v = qs(".figma-ecg__video");
    if (!v) return;
    var trim = 1.5;
    function capTime() {
      if (!v.duration || isNaN(v.duration)) return;
      if (v.duration < trim + 1) return;
      var end = v.duration - trim;
      if (v.currentTime > end) v.currentTime = end;
    }
    function onTimeUpdate() {
      if (!v.duration || isNaN(v.duration)) return;
      if (v.duration < trim + 1) return;
      if (v.currentTime >= v.duration - trim - 0.04) {
        v.pause();
        if (v.loop) {
          v.currentTime = 0;
          v.play().catch(function () {});
        }
      }
    }
    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("seeking", capTime);
    v.addEventListener("loadedmetadata", capTime);
  }

  function initOverviewVideo() {
    var frame = qs("[data-overview-video]");
    var video = frame ? frame.querySelector(".figma-video__media") : null;
    var overlay = qs("[data-overview-overlay]");
    var btn = qs("[data-overview-play]");
    var muteBtn = frame ? frame.querySelector("[data-overview-mute]") : null;
    if (!frame || !video || !overlay || !btn) return;

    function setPlaying(on) {
      frame.classList.toggle("is-playing", on);
      btn.setAttribute("aria-label", on ? "Pause overview video" : "Play overview video");
    }

    function syncMuteUi() {
      if (!muteBtn) return;
      var muted = video.muted;
      muteBtn.classList.toggle("figma-video__mute--muted", muted);
      muteBtn.setAttribute("aria-pressed", muted ? "true" : "false");
      muteBtn.setAttribute("aria-label", muted ? "Unmute video" : "Mute video");
    }

    // Default: sound ON (user requested). Browsers still may block autoplay-with-sound,
    // but user-initiated play will be unmuted.
    video.muted = false;
    try {
      video.volume = 1;
    } catch (_) {}
    syncMuteUi();

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (video.paused) {
        pauseOtherVideos(video);
        video.play().catch(function () {});
      } else {
        video.pause();
      }
    });

    if (muteBtn) {
      muteBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (video.muted) {
          video.muted = false;
          video.volume = 1;
        } else {
          video.muted = true;
        }
        syncMuteUi();
      });
      video.addEventListener("volumechange", syncMuteUi);
      syncMuteUi();
    }

    // Clicking the video pauses (matches Gatsby).
    video.addEventListener("click", function () {
      if (!video.paused) {
        video.pause();
      }
    });

    video.addEventListener("playing", function () {
      setPlaying(true);
    });

    video.addEventListener("pause", function () {
      setPlaying(false);
    });

    video.addEventListener("ended", function () {
      setPlaying(false);
      try {
        video.currentTime = 0;
      } catch (_) {}
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    fixRelativeAnchorsToSiteRoot();
    initInternalRootLinks();

    // Ensure only one video plays at a time (applies to all pages).
    // Use capture because `play` doesn't bubble.
    document.addEventListener(
      "play",
      function (e) {
        var t = e && e.target;
        if (!t || String(t.tagName).toLowerCase() !== "video") return;
        pauseOtherVideos(t);
      },
      true
    );

    initNav();
    initFooterYear();
    initHeroVisualFallback();
    initFaqAccordion();
    initFaqTestimonialsCarousel();
    initContactPage();
    initVideoPlayStub();
    initOverviewVideo();
    initEcgVideoEndTrim();
  });
})();
