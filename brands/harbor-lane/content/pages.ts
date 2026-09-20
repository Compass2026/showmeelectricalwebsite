import type { CorePage } from "@/content/pages";
export type { CorePage };

/** CORE PAGES — Harbor Lane (fictional demo). No blog, no careers. */
export const corePages: CorePage[] = [
  { path: "/", title: "Home", related: ["/services", "/services/residential", "/services/commercial", "/service-area", "/about", "/contact"], incoming: ["nav", "footer"] },
  { path: "/about", title: "About", parent: "/", related: ["/services/residential", "/services/commercial", "/locations", "/contact"], incoming: ["nav", "footer", "/"] },
  { path: "/services", title: "Services", parent: "/", related: ["/services/residential", "/services/commercial", "/contact"], incoming: ["nav", "footer", "/"] },
  { path: "/service-area", title: "Where we work", parent: "/", related: ["/services/residential", "/services/commercial", "/locations", "/contact"], incoming: ["nav", "footer", "/"] },
  { path: "/contact", title: "Contact", parent: "/", related: [], incoming: ["nav", "footer", "/"] },
];
