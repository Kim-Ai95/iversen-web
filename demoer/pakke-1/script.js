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
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
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
