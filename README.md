# Iversen Web

Produksjonsklar one-page nettside for **Iversen Web** – moderne nettsider for små og mellomstore bedrifter i Norge.

Bygget med ren HTML og CSS (Flexbox + Grid) og en liten JS-fil. Ingen rammeverk, ingen build-step.

## Filstruktur

```
Iversen Web/
├── index.html      Semantisk HTML med alle seksjoner
├── styles.css      Premium, responsivt design (mobile-first)
├── script.js       Mobilmeny, scroll-effekter, skjema-validering
└── README.md
```

## Kom i gang

Åpne `index.html` direkte i nettleseren – det er alt som trengs.

For utvikling med live reload kan du bruke en av disse:

```bash
# Python
python -m http.server 5500

# Node (npx)
npx serve .
```

Gå deretter til `http://localhost:5500` (eller porten som vises).

## Koble til Formspree

Skjemaet i kontaktseksjonen er klargjort for [Formspree](https://formspree.io). Det støtter både vanlig POST-innsending og AJAX (med inline suksess-/feilmelding).

1. Opprett et gratis skjema på Formspree og kopier endepunktet (f.eks. `https://formspree.io/f/abcdwxyz`).
2. Åpne `index.html`.
3. Bytt ut placeholder-en i `<form>`-taggen:

```html
<form
  class="contact-form"
  id="contactForm"
  action="https://formspree.io/f/abcdwxyz"
  method="POST"
  novalidate
>
```

Det er alt – `script.js` oppdager automatisk at endepunktet er ekte og sender via AJAX, slik at brukeren får en pen suksessmelding uten omdirigering.

### Andre tjenester
Det samme oppsettet fungerer med f.eks. **Getform**, **Web3Forms** eller **Netlify Forms**. Bytt bare ut `action`-URL-en. For Netlify Forms legg også til `data-netlify="true"` på `<form>`-taggen.

## Tilpasning

### Farger
Alle farger og avstander er definert som CSS-variabler øverst i `styles.css` under `:root`. Hovedaksent kan endres via:

```css
--color-primary: #2563eb;        /* Hovedfarge */
--color-primary-dark: #1d4ed8;
--gradient-primary: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
```

### Innhold
All tekst ligger i `index.html`. Bytt ut overskrifter, beskrivelser og prosjekter direkte der.

### Bilder i porteføljen
Prosjektkortene bruker stiliserte CSS-«mockups» som plassholdere. Når du har ekte skjermbilder, bytt ut hver `<a class="project-media ...">`-blokk med:

```html
<a href="lenke-til-prosjekt" class="project-media">
  <img src="bilder/frisor.jpg" alt="Frisør nettside" loading="lazy" />
</a>
```

og legg til denne regelen i `styles.css` (eller utvid `.project-media img`):

```css
.project-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 480ms cubic-bezier(.2,.8,.2,1);
}
.project:hover .project-media img { transform: scale(1.04); }
```

## Funksjoner

- Sticky header med blur og skygge når man scroller
- Mobilmeny (hamburger) med tilgjengelighet (ARIA, ESC, fokus)
- Smooth scroll og automatisk markering av aktiv seksjon i menyen
- Subtile fade-in-animasjoner via IntersectionObserver
- Respekterer `prefers-reduced-motion`
- Skjema med klient-validering, honeypot mot spam og AJAX-innsending
- Open Graph-metadata og semantisk HTML for god SEO

## Lisens

Privat prosjekt for Iversen Web. Tilpass og bruk fritt.
