/* Lune Salong – Demo Pakke 1 (Enkel) */
(function () {
  "use strict";

  /* Header shadow on scroll */
  const header = document.getElementById("header");
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile nav */
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

  /* Contact form */
  const form = document.getElementById("bookForm");
  const status = document.getElementById("formStatus");
  if (form && status) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const navn = form.elements["navn"].value.trim();
      const kontakt = form.elements["kontakt"].value.trim();
      if (!navn || !kontakt) {
        status.textContent = "Vennligst fyll ut navn og kontakt.";
        status.className = "form-status is-error";
        return;
      }
      status.textContent = "Takk! Vi tar kontakt så snart som mulig.";
      status.className = "form-status is-success";
      form.reset();
    });
  }
})();
