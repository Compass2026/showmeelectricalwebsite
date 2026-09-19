/**
 * CORE PAGE REGISTRY — the site's non-collection pages, as data.
 *
 * Together with the service, article and legal registries this is the
 * complete list of published routes (lib/routes.ts). Each entry records the
 * page's parent, the relationships it links out to, and where it is linked
 * from — the "page manifest" the Build Standard asks for (§6). Paths here
 * must exist as routes; the QA crawl verifies that.
 *
 * `modifiedAt` is set only for a significant content change with a known
 * date; it is never touched by a build.
 */
export interface CorePage {
  path: string;
  title: string;
  parent?: string;
  /** Outgoing relationships the page renders as links. */
  related?: string[];
  /** Incoming link sources: paths, or "nav" / "footer" for site chrome. */
  incoming: string[];
  modifiedAt?: string;
}

export const corePages: CorePage[] = [
  {
    path: "/",
    title: "Home",
    related: ["/services", "/services/residential", "/services/commercial", "/services/industrial", "/service-area", "/about", "/contact"],
    incoming: ["nav", "footer"],
  },
  {
    path: "/about",
    title: "About",
    parent: "/",
    related: ["/services/residential", "/services/commercial", "/services/industrial", "/contact"],
    incoming: ["nav", "footer", "/"],
  },
  {
    path: "/services",
    title: "Services",
    parent: "/",
    related: ["/services/residential", "/services/commercial", "/services/industrial", "/contact"],
    incoming: ["nav", "footer", "/"],
  },
  {
    path: "/service-area",
    title: "Service area",
    parent: "/",
    related: ["/services/residential", "/services/commercial", "/services/industrial", "/contact"],
    incoming: ["nav", "footer", "/"],
  },
  {
    path: "/blog",
    title: "Blog",
    parent: "/",
    related: [],
    incoming: ["nav", "footer"],
  },
  {
    path: "/contact",
    title: "Contact",
    parent: "/",
    related: [],
    incoming: ["nav", "footer", "/", "every page's closing call to action"],
  },
];
