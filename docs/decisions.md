# Owner-Confirmed Decisions

Decisions made by the business owner (via Tom) that override earlier
assumptions in the build. Each entry records what was decided, what changed in
the code as a result, and any limits that still apply.

Anything **not** listed here is still an assumption — see
`docs/open-questions.md`.

---

## D-001 · Emergency electrical service is offered

**Confirmed:** 2026-09-17 · Tom, relaying the owner
**Supersedes:** open question §1 (previously BLOCKING for service pages)

Show Me Electrical **does** offer emergency electrical service. The approved
keyword map's *Emergency Electrical Service* page and the
`emergency electrician st louis` money keyword are both **retained**.

The live WordPress FAQ answer — *"No, we do not offer emergency electrical
services"* — is now known to be wrong and does not carry over to the rebuild.

**Limits that still apply.** Hours and response times are **unconfirmed**, so
the site must not claim:

- 24/7 or round-the-clock availability
- after-hours, overnight or weekend coverage
- guaranteed arrival times, response windows or "we'll be there in X"

Emergency service may be stated as a service offered, with a phone number.
Nothing about *when* it is available may be stated until hours are confirmed.
That remains an open item in `docs/open-questions.md` §6.

**Applied in code:**

| Where | Change |
|---|---|
| `config/site.config.ts` | `offersEmergencyService: true`, with the no-hours-claim limits recorded alongside it |
| `content/home.ts` | Emergency repairs named in the services section; no availability claim |
| `lib/seo.ts` | Emergency service enters the structured-data offer catalog via the config catalog; no `openingHours`, no availability property |
| `docs/migration-inventory.md` | Emergency Electrical Service added to the service-page plan; the FAQ answer flagged for rewrite, not reuse |

---

## D-002 · Dan may be described as a Master Electrician

**Confirmed:** 2026-09-17 · Tom, relaying the owner
**Supersedes:** open question §2 (previously BLOCKING for the About page)

Dan's **Master Electrician** credential may be used on the main website — in
the About content and in trust messaging. This matches what the client already
publishes on their live `/about/` page and the brand board's positioning line,
*"Owner-led, licensed Master Electrician."*

**Scope limit — the careers site is unchanged.** Tom's September instruction to
remove master and foreman levels from the **careers progression** still stands
in full. That was about the employee career ladder; this decision is about the
owner's own credential. The two do not interact:

| Property | Master Electrician |
|---|---|
| Main site — owner's credential | **Allowed** (this decision) |
| Careers site — career ladder rungs | **Still removed** (unchanged) |

`lib/jobs.ts` and every careers route are untouched by this decision.

**Applied in code:**

| Where | Change |
|---|---|
| `config/site.config.ts` | `founderCredential: "Master Electrician"` |
| `content/home.ts` | About paragraphs restore the credential; trust bar leads with it |
| `app/page.tsx` | Meta description carries the credential as a differentiator |

---

## D-003 · Edwardsville and Belleville, Illinois are served

**Confirmed:** 2026-09-19 · Tom, relaying the owner
**Supersedes:** open question "Illinois coverage"

Show Me Electrical serves **Edwardsville and Belleville, Illinois**. The
approved keyword map had listed both as Tier-2 targets while every published
coverage statement was Missouri-only; the map was right.

**Limits.** This confirms **those two cities only**. Nothing is inferred about
their counties, the wider Metro East, or Illinois generally. No Illinois
office, hours or response claims exist. Dedicated city pages for either stay
in the later SEO expansion plan.

**Applied in code:**

| Where | Change |
|---|---|
| `config/site.config.ts` | `confirmedCities: ["Edwardsville, IL", "Belleville, IL"]` — the county list is unchanged |
| `lib/seo.ts` | `areaServed` gains two `City` entries alongside the seven `AdministrativeArea`s |
| `content/service-area.ts` | New "Illinois / Metro East" group with the two cities; hero, FAQ and description mention them |
| `app/page.tsx` | Service-area chips and intro include both cities |
| `content/services/*.ts`, `content/about.ts` | "Which areas do you serve?" answers include both cities |

## D-004 — Website inquiries go to info@showmeelectrical.com (2026-09-19)

**Decision (Tom):** the `/contact` inquiry form delivers to
`info@showmeelectrical.com`, by email only — no SMS, no marketing
subscription, no CRM hand-off.

**Applied:** `config/inquiry.config.ts` (default recipient), overridable per
environment with `INQUIRY_RECIPIENT`. Sender is a verified agency address
(`inquiries@send.compassmarketing.ai`) until a showmeelectrical.com sending
domain is verified; Reply-To is the visitor's email when given.

**Not decided by this:** whether the careers application recipients change
(they do not — `/api/apply` is untouched), and the verified client sending
domain.
