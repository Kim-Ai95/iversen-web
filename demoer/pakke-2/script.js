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
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
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
