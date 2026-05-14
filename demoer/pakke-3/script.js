/* Atelier Nord – Demo Pakke 3 (Premium) */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Cormorant Garamond font for headlines ---- */
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap";
  document.head.appendChild(fontLink);

  /* ---- Sticky header shadow ---- */
  const header = document.getElementById("header");
  const progress = document.getElementById("scrollProgress");
  const onScroll = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
    if (progress) {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = pct + "%";
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile nav toggle ---- */
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

  /* ---- Reveal on scroll ---- */
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

  /* ---- Year ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Animated counters ---- */
  if (!prefersReduced && "IntersectionObserver" in window) {
    const counters = document.querySelectorAll("[data-counter]");
    counters.forEach((el) => {
      const end = parseFloat(el.getAttribute("data-counter")) || 0;
      const suffix = el.getAttribute("data-suffix") || "";
      const prefix = el.getAttribute("data-prefix") || "";
      const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      const duration = 1800;

      const animate = () => {
        const start = performance.now();
        const ease = (t) => 1 - Math.pow(1 - t, 3);
        const step = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const v = end * ease(t);
          el.textContent = prefix + v.toFixed(decimals) + suffix;
          if (t < 1) requestAnimationFrame(step);
          else el.textContent = prefix + end.toFixed(decimals) + suffix;
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

  /* ---- Project filter ---- */
  const filterContainer = document.querySelector("[data-filters]");
  if (filterContainer) {
    const buttons = filterContainer.querySelectorAll("button");
    const grid = document.querySelector("[data-filter-target]");
    if (grid) {
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const cat = btn.getAttribute("data-cat");
          buttons.forEach((b) => b.classList.toggle("is-active", b === btn));
          grid.querySelectorAll(".project-card").forEach((card) => {
            const cardCat = card.getAttribute("data-cat");
            const show = cat === "all" || cardCat === cat;
            card.classList.toggle("is-hidden", !show);
          });
        });
      });
    }
  }

  /* ---- Testimonial slider ---- */
  const slider = document.querySelector("[data-t-slider]");
  if (slider) {
    const slides = slider.querySelectorAll(".t-slide");
    const nav = slider.querySelector(".t-nav");
    let active = 0;
    let timer = null;

    const setActive = (i) => {
      active = (i + slides.length) % slides.length;
      slides.forEach((s, idx) => s.classList.toggle("is-active", idx === active));
      if (nav) {
        nav.querySelectorAll("button").forEach((b, idx) =>
          b.classList.toggle("is-active", idx === active)
        );
      }
    };

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

    if (slides.length) slides[0].classList.add("is-active");

    const restart = () => {
      if (timer) clearInterval(timer);
      if (!prefersReduced) {
        timer = setInterval(() => setActive(active + 1), 6500);
      }
    };
    restart();
  }

  /* ---- Demo notes toggle ---- */
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

  /* ---- Contact form ---- */
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
      status.textContent = "Takk! Vi tar kontakt innen 48 timer.";
      status.className = "form-status is-success";
      form.reset();
    });
  }

  /* ---- Cursor spotlight on dark surfaces ---- */
  if (!prefersReduced && window.matchMedia("(pointer: fine)").matches) {
    const spot = document.createElement("div");
    spot.className = "cursor-spotlight";
    document.body.appendChild(spot);
    let rafId = null;
    let tx = -300, ty = -300;
    let cx = -300, cy = -300;

    window.addEventListener("pointermove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
      spot.classList.add("is-active");
      if (!rafId) animate();
    });

    window.addEventListener("pointerleave", () => {
      spot.classList.remove("is-active");
    });

    const animate = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      spot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = null;
      }
    };
  }

  /* ---- Service card pointer-tracked glow ---- */
  if (!prefersReduced && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".svc-card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mx", x + "%");
        card.style.setProperty("--my", y + "%");
      });
    });
  }
})();
