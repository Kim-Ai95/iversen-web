/* Klar Renhold – Demo Pakke 2 */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header shadow on scroll */
  const header = document.getElementById("header");
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile nav toggle */
  const burger = document.getElementById("navBurger");
  const nav = document.querySelector(".nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll(".reveal");
  const REVEAL_IO_MARGIN = "80px 0px 140px 0px";

  function pulseReveals() {
    const vh =
      window.innerHeight || document.documentElement.clientHeight || 0;
    const vw = window.innerWidth || document.documentElement.clientWidth || 0;
    const extY = Math.min(vh * 0.65, Math.max(vh + 260, 400));

    revealEls.forEach((el) => {
      if (el.classList.contains("is-visible")) return;
      const r = el.getBoundingClientRect();
      if (
        r.bottom >= -extY &&
        r.top <= vh + extY &&
        r.right >= -120 &&
        r.left <= vw + 120
      ) {
        el.classList.add("is-visible");
      }
    });
  }

  let revealGate = false;
  const scheduleRevealPulse = () => {
    if (revealGate) return;
    revealGate = true;
    requestAnimationFrame(() => {
      revealGate = false;
      pulseReveals();
    });
  };

  if (revealEls.length) {
    requestAnimationFrame(() => requestAnimationFrame(pulseReveals));

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0, rootMargin: REVEAL_IO_MARGIN }
      );

      pulseReveals();
      revealEls.forEach((el) => io.observe(el));

      window.addEventListener(
        "scroll",
        scheduleRevealPulse,
        { passive: true }
      );
      window.addEventListener("resize", pulseReveals, { passive: true });
      window.addEventListener(
        "pageshow",
        (e) => {
          pulseReveals();
          if (e.persisted) scheduleRevealPulse();
        },
        { passive: true }
      );

      window.setTimeout(() => {
        revealEls.forEach((el) => el.classList.add("is-visible"));
      }, 8500);
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  }

  /* Footer year */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Animated counters */
  if (!prefersReduced && "IntersectionObserver" in window) {
    const counters = document.querySelectorAll("[data-counter]");
    counters.forEach((el) => {
      const end = parseFloat(el.getAttribute("data-counter")) || 0;
      const suffix = el.getAttribute("data-suffix") || "";
      const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      const duration = 1600;

      const animate = () => {
        const start = performance.now();
        const ease = (t) => 1 - Math.pow(1 - t, 3);
        const step = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const v = end * ease(t);
          el.textContent = v.toFixed(decimals) + suffix;
          if (t < 1) requestAnimationFrame(step);
          else el.textContent = end.toFixed(decimals) + suffix;
        };
        requestAnimationFrame(step);
      };

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate();
              obs.unobserve(el);
            }
          });
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
    });
  }

  /* Testimonial slider */
  const slider = document.querySelector("[data-slider]");
  if (slider) {
    const slides = slider.querySelectorAll(".testimonial-slide");
    const nav = slider.querySelector(".testimonial-nav");
    let active = 0;
    let timer = null;

    const setActive = (i) => {
      active = (i + slides.length) % slides.length;
      slides.forEach((s, idx) => {
        s.style.opacity = idx === active ? "1" : "0";
        s.style.transform = idx === active ? "none" : "translateY(10px)";
        s.style.pointerEvents = idx === active ? "auto" : "none";
        s.style.position = idx === active ? "relative" : "absolute";
      });
      if (nav) {
        nav.querySelectorAll("button").forEach((b, idx) =>
          b.classList.toggle("is-active", idx === active)
        );
      }
    };

    slides.forEach((s, i) => {
      s.style.transition = "opacity 500ms cubic-bezier(.2,.8,.2,1), transform 500ms cubic-bezier(.2,.8,.2,1)";
      if (i !== 0) {
        s.style.opacity = "0";
        s.style.transform = "translateY(10px)";
        s.style.position = "absolute";
        s.style.inset = "0";
      }
    });

    if (nav && slides.length > 1) {
      slides.forEach((_, i) => {
        const b = document.createElement("button");
        b.setAttribute("aria-label", `Vis vurdering ${i + 1}`);
        if (i === 0) b.classList.add("is-active");
        b.addEventListener("click", () => {
          setActive(i);
          restart();
        });
        nav.appendChild(b);
      });
    }

    const restart = () => {
      if (timer) clearInterval(timer);
      if (!prefersReduced) {
        timer = setInterval(() => setActive(active + 1), 6500);
      }
    };
    restart();
  }

  /* Demo notes toggle */
  const notes = document.getElementById("demoNotes");
  const notesToggle = document.getElementById("demoNotesToggle");
  if (notes && notesToggle) {
    notes.setAttribute("data-open", "true");
    notesToggle.addEventListener("click", () => {
      const open = notes.getAttribute("data-open") === "true";
      notes.setAttribute("data-open", open ? "false" : "true");
      notesToggle.setAttribute("aria-expanded", open ? "false" : "true");
    });
  }

  /* Contact form (no-op submit) */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (form && status) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const required = form.querySelectorAll("[required]");
      const missing = Array.from(required).filter((f) => !f.value.trim());
      if (missing.length) {
        status.textContent = "Vennligst fyll ut alle påkrevde felter.";
        status.className = "form-status is-error";
        missing[0].focus();
        return;
      }
      status.textContent = "Takk! Vi kontakter deg innen 24 timer.";
      status.className = "form-status is-success";
      form.reset();
    });
  }
})();
