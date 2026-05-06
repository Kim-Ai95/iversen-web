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
