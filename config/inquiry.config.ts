/**
 * INQUIRY DELIVERY — client-specific recipient settings. SERVER ONLY: this
 * file is imported by `app/api/inquiry/route.ts` and never by a component.
 *
 * Every value here can be overridden per environment without a code change
 * (see README "Environment variables"). Credentials never live here — the
 * Resend API key is `RESEND_API_KEY` in the deployment environment only.
 */
export const inquiryConfig = {
  /**
   * Where website inquiries are delivered. Owner-confirmed 2026-09-19 (Tom):
   * info@showmeelectrical.com. Override with INQUIRY_RECIPIENT (comma-
   * separated for several).
   */
  recipients: ["info@showmeelectrical.com"],
  /**
   * Verified sender. Resend has no showmeelectrical.com sending domain yet,
   * so this uses the agency's verified send.compassmarketing.ai domain — the
   * same domain the live careers form sends from. Override with INQUIRY_FROM
   * once a client domain is verified.
   */
  from: "Show Me Electrical Website <inquiries@send.compassmarketing.ai>",
  /** Subject prefix; the visitor's name and chosen service are appended. */
  subjectPrefix: "Website inquiry",
  /** Shown inside the email footer so the recipient knows the source. */
  sourceLabel: "showmeelectrical.com/contact",
  /** Env var names, so the route and the docs agree. */
  env: {
    apiKey: "RESEND_API_KEY",
    recipient: "INQUIRY_RECIPIENT",
    from: "INQUIRY_FROM",
    /** "mock" | "fail" — honoured only outside production. See route. */
    delivery: "INQUIRY_DELIVERY",
  },
  rateLimit: { windowMs: 10 * 60 * 1000, maxPerWindow: 5 },
  /** Submissions faster than this after the form loaded are treated as bots. */
  minFillMs: 3000,
} as const;
