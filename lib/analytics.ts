import { site } from "@/config/site.config";

/**
 * Google Analytics 4, switched on by NEXT_PUBLIC_GA_ID (a "G-…" measurement
 * id) on the Vercel project's **Production** target only. Without a valid id
 * — every preview, every local build, the careers project — no tag loads and
 * trackEvent does nothing. A fictional demonstration brand never loads it,
 * whatever the env.
 *
 * NEXT_PUBLIC_* is inlined at build time: setting or removing the variable
 * takes effect on the next production build, not on the running one.
 *
 * Event names follow the Compass CRM's GA4 provisioning, which marks
 * `phone_click` and `form_submit` as key events.
 */
const raw = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const GA_ID: string | null =
  !site.fictional && /^G-[A-Z0-9]{4,20}$/.test(raw) ? raw : null;

type Gtag = (command: "event", name: string, params?: Record<string, unknown>) => void;

export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (!GA_ID || typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === "function") gtag("event", name, params);
}
