# Starting the next client website — checklist

The Compass website system is the framework in this repository (`app/`,
`components/`, `lib/`, `content/*/types.ts`, `scripts/qa/`) plus one brand
directory per client under `brands/`. A new client is a new brand directory
and nothing else. Nothing under `brands/showme/` (the reference client) or
`brands/harbor-lane/` (the fictional demonstration) is reused as content.

## 1. Create the brand

- [ ] Copy `brands/harbor-lane/` to `brands/<client>/` — it is the neutral
      shape with no real-client facts. Register it in `brands/registry.ts`
      with `fictional: false` and its own `redirects`.
- [ ] `site.config.ts`: identity, legal name, logo asset + alt + wordmark
      fallback, phone/email/address (owner-confirmed), service area,
      `schemaType`, catalog, `productionUrl`, CTAs, nav, footer copy,
      `notFound` copy, `metadata` defaults, `careers` (`null` unless the
      client has a careers property), `offersEmergencyService`, `sameAs`,
      `geo` (only a verified pin), `fictional: false`.
- [ ] **Service-area business?** Set `address.street` and `address.zip` to
      `null` (both are `string | null`). The footer and the contact card then
      show `City, ST` — the contact card puts `serviceAreaLong` where the
      street was — and the LocalBusiness and JobPosting JSON-LD omit
      `streetAddress` and `postalCode` rather than emit empty strings. Never
      invent a street address for a business that goes to the customer: it is
      a false claim, and Google asks that one is not published for a
      service-area business. `city`, `state` and `country` are still required
      and must be true.
- [ ] `theme.css`: the semantic tokens (`--brand-primary-*`, `--brand-accent-*`,
      `--brand-surface`, `--brand-ink`, fonts). Check `accent-700` meets 4.5:1
      on white and on `surface`. `fonts.ts`: the two `next/font` families.
      `theme.config.ts`: `motionColors` in step with the palette; `decoration`
      (`heroBackdrop`, `storyRail`) — add a treatment under `components/decor`
      only if the client needs a motif.
- [ ] `inquiry.config.ts`: recipients (owner-confirmed), verified sender,
      subject/source labels, `forceMock: false`. Secrets stay in the
      environment (`RESEND_API_KEY`).
- [ ] `redirects.ts`: every retained legacy URL → a built route; `gone` for
      paths that were never content.
- [ ] `careers.ts`: jobs and careers metadata, or the empty shape when
      `site.careers` is `null`.

## 2. Populate content (only sourced facts)

- [ ] `content/shared.ts` trust points and process steps.
- [ ] `content/home.ts`, `about.ts`, `contact.ts` (form labels incl. the
      "other" option), `services-directory.ts`, `service-area.ts`,
      `reviewer-notes.ts` (banner copy + provisional notes), `pages.ts`.
- [ ] Service hubs under `content/services/`, registered in `index.ts`
      (`servicePages`); child pages with `parent`, registered in
      `serviceDetailPages`, and linked from the hub item's `href`.
- [ ] Served cities under `content/cities/` only after the city gate:
      owner-confirmed coverage + distinctive sourced local facts. Reference
      the slug from `service-area.ts` communities so the hub links it.
- [ ] Physical locations in `content/locations.ts` only for real, verified
      places (hours only when confirmed). `locationsIndex` when there is
      more than none.
- [ ] Articles under `content/blog/` (typed blocks, inline links to built
      pages, real dates and bylines) or an empty registry (then `/blog` is a
      404 and must not be in nav).
- [ ] Legal documents under `content/legal/` — the client's own text,
      reviewed by the client.
- [ ] Assets in `public/<client>/…` (logo, share image 1200×630, photos with
      honest alt text). Never present stock imagery as the client's work.
- [ ] Mark every unavailable fact as absent, not guessed: no hours, response
      times, review counts, credentials, prices or guarantees without a
      client-owned source. Record decisions in `docs/decisions.md`.

## 3. Verify

- [ ] `npm run typecheck` (default brand) and
      `node scripts/qa/typecheck-brand.mjs <client>`; `npm run lint`.
- [ ] `COMPASS_BRAND=<client> npm run build`, start it, then
      `COMPASS_BRAND=<client> npm run qa:manifest` and
      `node scripts/qa/crawl.mjs http://localhost:<port> --host <domain> --assets remap`.
- [ ] `node scripts/qa/forms.test.mjs …` against a server started with
      `INQUIRY_DELIVERY=mock`; `node scripts/qa/browser.test.mjs … --paths …`.
- [ ] Desktop + mobile screenshots of every page family; Lighthouse mobile.
- [ ] Agent trial: the reading/navigation/inquiry tasks in
      `docs/agent-compatibility.md` run by an actual AI agent against the
      preview; record model, browser, commit, results, exceptions.
- [ ] Leak scan: no reference-client or demo strings in the new brand's HTML.

## 4. Deploy and launch (separate checklist)

- [ ] Vercel project with `COMPASS_BRAND=<client>` in every environment,
      `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ALLOW_INDEXING=true` in
      production only, `RESEND_API_KEY`, recipient/from overrides.
- [ ] Never set `COMPASS_DEMO` or a fictional brand in production — the build
      refuses, by design.
- [ ] Then `docs/launch-checklist.md` (DNS, backups, GBP parity, redirects
      on the real host, post-launch checks).
