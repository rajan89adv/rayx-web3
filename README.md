# RayX — Building What Comes Next

A responsive React + Vite landing page for RayX, with cinematic scroll experiences, GSAP reveals, Lenis smooth scrolling, interactive product cards, linked technology references, and a validated contact form.

## Run the project

1. Install Node.js LTS.
2. Open a terminal in this project folder.
3. Run `npm install`.
4. Run `npm run dev` and open the local URL Vite prints.
5. Run `npm run build` to verify a production build.
6. Run `npm run preview` to preview the built site.

## Product links and Coming Soon behavior

Edit `src/data/siteData.js` and set the `projectLinks` values to real deployed project URLs. A valid HTTP/HTTPS URL opens in a new tab. An empty or placeholder URL opens a Coming Soon dialog instead of sending visitors to a broken page. No product is presented as live until a real URL is configured.

## Technology stack

Every listed technology tag links to its official documentation or authoritative project documentation. Add or update mappings in `technologyLinks` in `src/data/siteData.js`.

## Contact form

The contact form validates name, email, and message in the browser. To deliver messages, set `contactEmail` in `src/data/siteData.js` to an inbox that you control. Until a real inbox is configured, the form explains that delivery is not connected; it does not pretend that a message was sent. For reliable server-side email delivery, connect a backend or email service and keep any API keys in server-side environment variables, never in frontend code.

## Project structure

- `index.html` — page metadata and root element
- `src/main.jsx` — React entry point
- `src/App.jsx` — landing page, navigation, products, contact form, dialog, and animations
- `src/style.css` — responsive design and motion styling
- `src/ScrollExperiences.jsx` — scroll-driven visual experiences
- `src/GhostCursor.tsx` — cursor visual effect
- `src/data/siteData.js` — product URLs, technology groups, official documentation links, and contact email
- `vite.config.js` — Vite configuration
- `package.json` — dependencies and scripts

## Important distinction

This is a working frontend website. It does not automatically create deployed RayX products, a database, a login service, or a production email backend. Configure real URLs and backend services when those products are ready. The site intentionally labels unconfigured product links as Coming Soon.
