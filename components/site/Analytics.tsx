"use client";

import { useEffect } from "react";
import Script from "next/script";
import { GA_ID, trackEvent } from "@/lib/analytics";

/**
 * Loads GA4 once, from the root layout, only when NEXT_PUBLIC_GA_ID is a
 * valid measurement id (lib/analytics.ts). One gtag.js script and one
 * `config` call per page load; App Router navigations are reported by GA4's
 * enhanced measurement (history changes), so no manual page_view is sent.
 *
 * Every click on a tel: link anywhere on the site (header, footer, page
 * CTAs, the inquiry form's fallback) is reported as `phone_click`. The
 * contact form reports `form_submit` itself, on a confirmed server success
 * only (components/site/InquiryForm.tsx).
 */
export default function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="tel:"]');
      if (!link) return;
      trackEvent("phone_click", {
        phone_number: link.getAttribute("href")?.slice(4),
        link_text: link.textContent?.trim().slice(0, 100),
        page_path: window.location.pathname,
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
