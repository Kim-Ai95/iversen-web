/* =========================================================
   Iversen Web – script.js
   Mobile nav, scroll effects, reveal animations, form UX
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Header shadow on scroll ---------- */
  const header = document.getElementById("header");
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Åpne meny");
  };

  const openNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Lukk meny");
  };

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("is-open");
      if (isOpen) closeNav();
      else openNav();
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    let lastWidth = window.innerWidth;
    window.addEventListener("resize", () => {
      if (Math.abs(window.innerWidth - lastWidth) > 60 && window.innerWidth > 860) {
        closeNav();
      }
      lastWidth = window.innerWidth;
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sectionIds = ["services", "portfolio", "why", "contact"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = document.querySelectorAll(".nav-list a");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((a) => {
              const matches = a.getAttribute("href") === `#${id}`;
              a.classList.toggle("is-active", matches);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Subtle hero parallax (pointer + scroll) ---------- */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!prefersReducedMotion) {
    const hero = document.getElementById("hero");
    const heroGlow = hero ? hero.querySelector("[data-parallax]") : null;
    const tiltEl = hero ? hero.querySelector("[data-tilt]") : null;

    if (hero && (heroGlow || tiltEl)) {
      let rafId = null;
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;

      const animate = () => {
        // Smooth lerp toward target
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        if (heroGlow) {
          heroGlow.style.transform = `translate3d(calc(-50% + ${currentX * 30}px), ${currentY * 24}px, 0)`;
        }
        if (tiltEl) {
          // Very gentle tilt
          const rx = (-currentY * 4).toFixed(2);
          const ry = (currentX * 5).toFixed(2);
          tiltEl.style.transform = `rotate(-1.2deg) rotateX(${rx}deg) rotateY(${ry}deg)`;
        }

        if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
          rafId = requestAnimationFrame(animate);
        } else {
          rafId = null;
        }
      };

      const schedule = () => {
        if (!rafId) rafId = requestAnimationFrame(animate);
      };

      hero.addEventListener("pointermove", (e) => {
        const rect = hero.getBoundingClientRect();
        // Normalize -1 .. 1
        targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        schedule();
      });

      hero.addEventListener("pointerleave", () => {
        targetX = 0;
        targetY = 0;
        schedule();
      });
    }
  }

  /* ---------- Tilt-card interaction on package previews ---------- */
  if (!prefersReducedMotion) {
    const tiltCards = document.querySelectorAll(".package-preview");
    tiltCards.forEach((card) => {
      let raf = null;

      const apply = (rx, ry) => {
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      };

      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        // Cap the tilt very low for a subtle effect
        const rx = (-y * 4).toFixed(2);
        const ry = (x * 4).toFixed(2);
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => apply(rx, ry));
      });

      card.addEventListener("pointerleave", () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = "";
      });
    });
  }

  /* ---------- Animated KPI counters (Premium demo) ---------- */
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const counters = document.querySelectorAll("[data-counter]");
    if (counters.length) {
      const animateCounter = (el) => {
        const end = parseFloat(el.getAttribute("data-counter")) || 0;
        const suffix = el.getAttribute("data-suffix") || "";
        const duration = 1400;
        const start = performance.now();
        // Ease-out cubic for a tasteful curve
        const ease = (t) => 1 - Math.pow(1 - t, 3);

        const step = (now) => {
          const elapsed = now - start;
          const t = Math.min(1, elapsed / duration);
          const value = end * ease(t);
          el.textContent = Math.round(value) + suffix;
          if (t < 1) requestAnimationFrame(step);
          else el.textContent = end + suffix;
        };

        requestAnimationFrame(step);
      };

      const counterObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((el) => counterObserver.observe(el));
    }
  }

  /* ---------- Contact form (Formspree-ready) ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  const setStatus = (msg, type) => {
    if (!status) return;
    status.textContent = msg;
    status.classList.remove("is-success", "is-error");
    if (type) status.classList.add(`is-${type}`);
  };

  if (form) {
    form.addEventListener("submit", async (e) => {
      const action = form.getAttribute("action") || "";
      const isPlaceholder =
        !action || action.includes("your-form-id") || action === "#";

      // Basic validation
      const name = form.querySelector("#name");
      const email = form.querySelector("#email");
      const message = form.querySelector("#message");

      const missing = [name, email, message].filter(
        (f) => !f || !f.value.trim()
      );

      if (missing.length) {
        e.preventDefault();
        setStatus("Vennligst fyll ut alle feltene.", "error");
        if (missing[0]) missing[0].focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email.value.trim())) {
        e.preventDefault();
        setStatus("Vennligst skriv inn en gyldig e-postadresse.", "error");
        email.focus();
        return;
      }

      // If Formspree (or similar) is not yet wired up,
      // give friendly feedback instead of POSTing nowhere.
      if (isPlaceholder) {
        e.preventDefault();
        setStatus(
          "Skjemaet er klart, men ikke koblet til en tjeneste ennå. Send gjerne direkte til kimatcode@gmail.com.",
          "error"
        );
        return;
      }

      // AJAX submit to Formspree (or compatible) for inline success
      e.preventDefault();
      const submitBtn = form.querySelector("button[type='submit']");
      const originalText = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Sender...";
      }
      setStatus("Sender forespørselen din...", null);

      try {
        const data = new FormData(form);
        const res = await fetch(action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          form.reset();
          setStatus(
            "Takk! Forespørselen er sendt. Jeg tar kontakt så snart som mulig.",
            "success"
          );
        } else {
          const json = await res.json().catch(() => ({}));
          const msg =
            (json && json.errors && json.errors[0] && json.errors[0].message) ||
            "Noe gikk galt. Prøv igjen, eller send en e-post til kimatcode@gmail.com.";
          setStatus(msg, "error");
        }
      } catch (err) {
        setStatus(
          "Nettverksfeil. Prøv igjen, eller send en e-post til kimatcode@gmail.com.",
          "error"
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }
})();
