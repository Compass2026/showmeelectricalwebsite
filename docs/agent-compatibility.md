# AI-agent compatibility report — Compass website system

Build Standard §12 and Page Template Library §15 require evidence that an
actual AI agent can read, navigate and act on the rendered site — separate
from scripted browser automation and raw-HTML checks. This report records
both, and keeps them apart.

## Scope and honesty statement

- **Actual agent trials** were run by a Claude agent (model
  `claude-fable-5-1`, the same family as the build session) operating a
  real browser (Chromium 141.0.7390.37 via playwright-core 1.56.1, Node
  22.22.2) and plain HTTP fetches, with **no access to the repository
  source, content files or docs** — only the rendered site. The agent was
  told never to guess and to answer "not stated on the site" for missing
  facts. Expected answers were **not** given to the agent; results were
  graded afterwards against the approved facts below.
- The trials cover **one agent family and one browser**. They are evidence
  that the pages expose the right facts and controls in a form an agent can
  use; they are **not** a claim of compatibility with every AI agent,
  browser or future protocol.
- **Scripted checks** (`scripts/qa/forms.test.mjs`, `scripts/qa/browser.test.mjs`,
  `scripts/qa/crawl.mjs`) are deterministic regression checks. They are
  reported in the QA section, never as agent trials.
- Delivery was mocked (`INQUIRY_DELIVERY=mock`; Harbor Lane also
  `forceMock`). **No real inquiry, application, email or booking was sent.**

Build under test: branch `claude/template-completion`, commit recorded in
the review package (the trials ran against local production builds of that
tree, Show Me on `showmeelectrical.com.localhost:3330`, Harbor Lane on
`harbor-lane.example.localhost:3331`). Date: 2026-09-20.

## Task fixtures (the prompts, verbatim in `scripts/qa/agent-tasks.md`)

| # | Task | Expected fact (approved source) |
|---|---|---|
| R1 | Identify the business: name, trade, address, phone, email | Show Me Electrical (legal: Show Me Electrical Services), electrical contractor, 5602 Heege Rd, Affton, MO 63123 (D-005), 314-571-9756, info@showmeelectrical.com (D-004) |
| R2 | Find the panel-upgrades page; what happens first when breakers trip | The cause is assessed first ("We find out whether the panel, a circuit or what's plugged in is the cause") |
| R3 | Edwardsville, IL: served? office? run from where? | Served (D-003); no office; run from the Affton shop |
| R4 | Distinguish served area from physical office | Edwardsville = served area; only physical location = Affton shop |
| R5 | Opening hours; 24/7 or same-day promise? | Hours: not stated on the site (D-001); no availability promise anywhere |
| R6 | Every contact route with exact values | Phone, email, form at `/contact`, shop address; careers link is jobs-only |
| A1 | From the homepage, reach the form by the site's links, submit a mocked inquiry, quote the result, try a second click | One POST, `{ok:true, delivery:"mock"}`, explicit success text, form replaced, nothing sent twice |
| A2 | Submit with name only | Readable errors bound to fields, no request sent, values preserved |
| H1–H9 | Harbor Lane equivalents: identity (and "is it real?"), water-heater page, Northgate served vs. office, both branches with Saturday hours and which does backflow testing, emergency promise, contact routes, mocked form incl. "is it clear nothing is delivered?", careers presence | Per `brands/harbor-lane` content; correct answers: fictional; no Northgate office (Westfield branch); Westfield Sat 8–12 / Eastgate Sat closed; backflow = Eastgate only; no 24/7; no careers |

## Results — Show Me Electrical (reference client)

| Task | Result | Evidence the agent cited |
|---|---|---|
| R1 | **Pass** | Homepage bar/footer, `/about` FAQ, `/contact` "Our shop" |
| R2 | **Pass** — quoted "We find out whether the panel, a circuit or what's plugged in is the cause." | Nav → `/services` → "Electrical Panel Upgrades & Replacement" link |
| R3 | **Pass** — served, no office, run from Affton | `/service-area/edwardsville-il` hero + fact list; reached from the hub's Edwardsville pill and the panel page's related card |
| R4 | **Pass** — "served area", only physical location is the Affton shop | Edwardsville FAQ |
| R5 | **Pass** — hours "not stated on the site"; no 24/7 or response-time promise; quoted the "call to discuss the problem and current availability" wording | Homepage callout, `/services` FAQ, residential hub, Edwardsville page; schema carries no `openingHours` |
| R6 | **Pass** — phone, email, form (fields listed), shop address; careers noted as jobs-only; correctly reported no chat/SMS/social | Header, footer, `/contact`, `/terms-of-service` §14 |
| A1 | **Pass** — reached `/contact` by the header link; one POST; success text quoted verbatim; form replaced; "Send another message" restored an empty form; POST count stayed 1 | Browser network log |
| A2 | **Pass** — three errors quoted verbatim, zero requests, name preserved | Browser |

Agent's observations (kept as findings, with disposition):

| Observation | Disposition |
|---|---|
| After an invalid submit, focus stayed on the button rather than the first error | **Fixed in this batch:** focus now moves to the first invalid field; covered by `forms.test.mjs` |
| `/contact` says "during business hours" but no hours are stated anywhere | Correct behaviour (D-001: hours unconfirmed); wording kept — it does not state hours |
| Success message does not say delivery was mocked | Correct for a real client; the mock flag is an API detail. Harbor Lane's success copy does say so (see below) |
| Reviewer notes in the preview banner expose decision IDs | Preview only; the banner does not render when indexing is on |
| "Send another message" clears all fields | Accepted; a follow-up is a new message by design |
| Client-side navigation fires no load event | Informational |

## Results — Harbor Lane Plumbing (fictional second brand)

| Task | Result | Evidence the agent cited |
|---|---|---|
| H1 | **Pass** — name, trade, head office (Eastgate, 100 Example Way), phone, email; "Real? No", quoting the banners, footer and About FAQ | `/`, `/contact`, `/about` |
| H2 | **Pass** — quoted "we do not pick before looking" | Nav → Services → "Water Heater Replacement" |
| H3 | **Pass** — served, no office, Westfield branch; also caught the backflow-by-Eastgate nuance | `/service-area/northgate`, hub FAQ |
| H4 | **Pass** — both branches with addresses, phones, Saturday hours (Westfield 8 am–12 pm; Eastgate closed); backflow = Eastgate only | `/locations`, both branch pages (hours tables) |
| H5 | **Pass** — "a served area, not a branch", and described how the site separates `/locations/*` (address, hours, access, staff) from `/service-area/*` (who serves it, from where) | Northgate page copy |
| H6 | **Pass** — no 24/7; quoted the FAQ answers that make no promise | Residential and commercial FAQs |
| H7 | **Pass** — office and branch phones/emails, walk-in addresses, form; no social/chat | Header, footer, branch pages |
| H8 | **Pass** — reached `/contact` by the header link; one POST; success text quoted; acceptance clear; "nothing is delivered" clear before and after submission | Browser |
| H9 | **Pass** — no careers/jobs link in nav or footer | `/` |

Agent's observations, with disposition:

| Observation | Disposition |
|---|---|
| Main number equals the Eastgate number; "Two branches, one number" vs. a distinct Westfield number | Fictional content nuance; the site does say the main number routes you. No change |
| Honeypot "Website" field could be filled by a naive agent reading raw HTML | Known trade-off: the field is `aria-hidden`, visually hidden and `tabindex=-1`; an agent using accessible names (as required by §12) never sees it. An agent that fills every raw input would be silently accepted, as a bot is. Documented, not changed |
| Without JavaScript "nav links render as icons/empty text in places" (agent's text extractor) | Not reproduced: `browser.test.mjs` no-JS checks pass on both brands; treated as an extractor artefact, **unverified** |

## Scripted checks (automation, not agent trials)

| Suite | Show Me | Harbor Lane |
|---|---|---|
| `crawl.mjs` (raw HTML, canonical, sitemap, links, fragments, schema refs, orphans, 404) | PASS, 16 routes | PASS, 14 routes |
| `forms.test.mjs` (API contract + browser: validation, honeypot, cross-origin, rate limit, failure recovery, duplicate-safe retry, double-click, focus) | 22 checks pass | 22 checks pass (re-run after the focus fix: see review package) |
| `browser.test.mjs` (no-JS content, reduced motion, 390px overflow, touch targets, tables, skip link, nav focus) | 46 checks pass (5 paths) | 40 checks pass (4 paths) |
| Leak scan (reference-client strings in the second brand) | — | 0 matches |
| Production guard (fictional brand / demo fixtures with `VERCEL_ENV=production`) | build refused | build refused |

## Not verified / limits

- Other agent families (OpenAI, Google, open-weight browser agents) and
  other browsers: **not tested**. Compatibility beyond the trial above is
  provisional.
- Real crawler access, search inclusion and third-party AI citation:
  post-launch observations, not part of this evidence.
- The careers workflow was **not** exercised by an agent (it is the live
  property; mocked application tests exist only in the earlier careers
  review). Harbor Lane has no careers, so the "disabled" path was covered.
- WebMCP / MCP / llms.txt: not added (no demonstrated need); the
  validation and delivery logic in `lib/inquiry.ts` and the API route is
  the reusable surface a future adapter would call.
