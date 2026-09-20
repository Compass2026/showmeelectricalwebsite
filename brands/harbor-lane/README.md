# Harbor Lane Plumbing — FICTIONAL second-brand demonstration

Everything in this directory is invented. Harbor Lane Plumbing, its people,
branches, addresses, phone numbers (reserved 555-01xx range), domain
(`harbor-lane.example`, a reserved TLD) and services do not exist.

Purpose: prove that the Compass website system is a reusable framework, not
Show Me Electrical's site with the name changed. This brand has its own
identity, palette, fonts, decoration, navigation, footer, metadata,
structured data (`Plumber`), contact details, service hubs, a served-city
page, two physical locations with a `/locations` index, policies, and **no
careers property**. Build it with:

    COMPASS_BRAND=harbor-lane npm run build

Protection: `site.fictional = true` renders a site-wide notice, forces
`noindex` on every page and `Disallow: /` in robots.txt, and
`next.config.ts` refuses to build this brand when `VERCEL_ENV=production`.
The inquiry config sets `forceMock`, so the contact form can never deliver.
