# Megan Garcia — Portfolio

A hand-built, static recreation of [meg-garcia.webflow.io](https://meg-garcia.webflow.io/),
moved off Webflow. Plain HTML, CSS, and vanilla JavaScript — no build step, no
framework, no external runtime dependencies (fonts are self-hosted).

## Structure

```
index.html              Home
about/                  About — bio, experience, education, certs
work/                   All projects
resume/                 Embedded resume PDF + download
contact/                Contact form
project-reset/          Case study
under-one-brand/        Case study
pizza/                  Case study
small-town/             Case study
css/style.css           Design system + all page styles
js/main.js              Nav, menu, title animation, scroll reveal, About tabs
js/contact.js           Contact form submission
fonts/                  Self-hosted fonts (Dela Gothic One, Chivo, Montserrat)
images/                 Images, SVGs, GIFs
files/                  Resume + case-study process-deck PDFs
google-apps-script/     Backend for the contact form (see its README)
```

## Local preview

No build needed — serve the folder and open it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying & the contact form

See [`DEPLOY.md`](./DEPLOY.md) for GitHub Pages setup, pointing a custom
domain, and wiring up the contact form.

## Design notes

- **Fonts:** Dela Gothic One (display titles), Chivo (headings), Montserrat
  (body) — self-hosted in `fonts/` so the site has no external dependency.
- **Accessibility:** semantic landmarks, skip link, labelled form fields,
  keyboard-operable tabs and menu, visible focus states, and a
  `prefers-reduced-motion` path that disables animation.
- **Progressive enhancement:** every page renders fully without JavaScript;
  animations and the mobile menu are layered on top.
