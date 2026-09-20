import type { Article } from "@/content/blog/types";

/**
 * MIGRATED FROM WORDPRESS — top-5-signs-your-home-needs-electrical-rewiring
 *
 * Source: https://showmeelectrical.com/top-5-signs-your-home-needs-electrical-rewiring/ (fetched 2026-09-19).
 * Byline and date as shown on the source post. The byline is the WordPress
 * author account (Tom Dombrowski, Compass Marketing), not the business owner;
 * it is preserved as published and flagged for a decision.
 *
 * Wording is reproduced as published except for the owner-approved edits of
 * 2026-09-19 (docs/launch-review.md A1, A3, B1, B2, B4): unsupported fire
 * statistic and "increase property value" removed; service area narrowed to
 * the confirmed area; closing CTA lines, tagline and the "inspection" heading
 * removed. Byline and date preserved. The WordPress featured image is a stock
 * download and is not carried over.
 */
export const post: Article = {
  slug: "top-5-signs-your-home-needs-electrical-rewiring",
  path: "/blog/top-5-signs-your-home-needs-electrical-rewiring",
  title: "Top 5 Signs Your Home Needs Electrical Rewiring",
  seo: {
    description: "Flickering lights, tripping breakers, burning smells, two-prong outlets and buzzing: five signs a home may need rewiring, from Show Me Electrical.",
  },
  publishedAt: "2025-06-14",
  author: "Tom Dombrowski",
  /** Substantive owner-approved edits applied 2026-09-19 (docs/launch-review.md). */
  modifiedAt: "2026-09-19",
  relatedServices: ["/services/residential"],
  relatedArticles: ["the-most-common-electrical-hazards-found-in-missouri-homes", "top-signs-you-need-to-call-an-electrician-immediately"],
  excerpt: "If you live in an older home or have been noticing strange electrical issues, your wiring could be trying to tell you something. Here are the top five signs your home may need rewiring, and what to do about it.",
  body: [
    { type: "p", text: "If you live in an older home or have been noticing strange electrical issues, your wiring could be trying to tell you something. Outdated or damaged electrical wiring isn’t just an inconvenience — it can be a serious safety hazard." },
    { type: "p", text: ["Here are the top 5 signs your home may need ", { type: "link", text: "electrical rewiring", href: "/services/residential#services" }, ", and what to do about it."] },
    { type: "h2", text: "1. Flickering or Dimming Lights" },
    { type: "p", text: "If your lights flicker or dim when you turn on appliances, it’s a sign your wiring may be overloaded or outdated. This is especially common in homes built before the 1970s that still have original wiring. Flickering can indicate loose connections or circuits that are not up to today’s electrical standards." },
    { type: "h2", text: "2. Frequent Breaker Trips or Blown Fuses" },
    { type: "p", text: ["Does your circuit breaker keep tripping when you use multiple devices? Or do you still have a fuse box instead of a modern breaker panel? These are both red flags. Your electrical system may not be able to keep up with today’s energy demands from computers, TVs, HVAC systems, and kitchen appliances. A ", { type: "link", text: "panel upgrade", href: "/services/residential/electrical-panel-upgrades" }, " is the usual answer."] },
    { type: "h2", text: "3. Burning Smell or Discolored Outlets" },
    { type: "p", text: "A persistent burning smell with no clear source could be your wiring overheating. Look out for scorched outlets, melted switch plates, or a warm-to-the-touch wall around an outlet. These are urgent signs of electrical failure and should be addressed immediately to prevent fire hazards." },
    { type: "h2", text: "4. Two-Prong Outlets and Lack of Grounding" },
    { type: "p", text: "Still using two-prong outlets throughout your home? These outdated receptacles offer no grounding, increasing the risk of shock and damage to electronics. Modern homes require three-prong, grounded outlets to meet current electrical safety codes." },
    { type: "h2", text: "5. Buzzing Sounds or Mild Shocks" },
    { type: "p", text: "Hearing a buzzing or humming from your outlets, switches, or lights? Or feeling a slight shock when plugging something in? These are signs of unsafe wiring or poor connections that can worsen over time — and become dangerous if left unaddressed." },
    { type: "h2", text: "Why Electrical Rewiring Matters" },
    { type: "p", text: "Rewiring your home can:" },
    { type: "ul", items: [
      "Prevent electrical fires",
      "Ensure code compliance",
      "Support today’s electrical loads",
      "Protect your family and home",
    ] },
    { type: "h2", text: "Call Show Me Electrical" },
    { type: "p", text: ["If you’re experiencing any of the signs above, don’t wait — faulty wiring can quickly turn into a serious safety issue. At Show Me Electrical, we specialize in ", { type: "link", text: "residential electrical rewiring and upgrades", href: "/services/residential" }, ". Our licensed electricians serve homeowners across the ", { type: "link", text: "Greater St. Louis area, including Edwardsville and Belleville, Illinois", href: "/service-area" }, ", with safe, reliable, and code-compliant solutions. ", { type: "link", text: "Send us the details", href: "/contact" }, " or call."] },
  ],
  flags: [],
};
