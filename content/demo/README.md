# Demonstration fixtures — FICTIONAL

Everything in this directory describes businesses, places and people that
**do not exist**. The fixtures exist so that page templates the reference
client does not need (a physical branch page, later a second brand) can be
built, rendered and verified without inventing facts about a real client.

Rules:

- A fixture is included in a build **only** when `COMPASS_DEMO=true` is set
  at build time. Without it the registries do not import the fixture, the
  route has no params, and the URL is a real 404.
- Fixtures are `fictional: true`, which renders a visible notice on the page,
  forces `noindex`, and keeps the page out of the route registry (so out of
  the sitemap, the route manifest and the link checker's expectations).
- Fixtures never reuse client photography, contact details, credentials or
  legal text. Names use reserved fictional forms (`.example` domains,
  555-01xx phone numbers, "Exampleton").
- Never set `COMPASS_DEMO` in a client's production environment.
