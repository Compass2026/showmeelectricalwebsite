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
    /** Base URL of the QA mock provider service (scripts/qa/mock-provider.mjs); used only in mock mode. */
    mockProviderUrl: "INQUIRY_MOCK_PROVIDER_URL",
  },
  /**
   * PER-INSTANCE rate limit. The counter lives in the memory of one
   * serverless instance, so on Vercel it bounds bursts against a single warm
   * function, not the deployment as a whole (each instance, region and cold
   * start has its own map). It is a cheap brake on naive scripts, nothing
   * more — see README "Contact form" for the platform-level protection.
   */
  rateLimit: { windowMs: 10 * 60 * 1000, maxPerWindow: 5 },
  /**
   * When true the route never contacts the provider (always "mock"),
   * whatever the environment says. Off for a real client; a fictional
   * demonstration brand sets it so no message can ever leave.
   */
  forceMock: false,
} as const;
