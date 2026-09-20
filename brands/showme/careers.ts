import type { Metadata } from "next";
import type { Job } from "@/lib/jobs";
import { site } from "./site.config";

/**
 * CAREERS PROPERTY CONTENT — Show Me Electrical. The careers site is LIVE at
 * careers.showmeelectrical.com; nothing here changes its output. Jobs and
 * the careers metadata are client content, so they live with the brand.
 * Application delivery recipients are overridable per environment
 * (RESEND_FROM, APPLICATION_RECIPIENT) — see app/api/apply/route.ts.
 */
const SITE_URL = site.careers?.url ?? site.productionUrl;
const WP_URL = site.careers?.wordpressUrl ?? site.productionUrl;

const jobs: Job[] = [
  {
    slug: "apprentice-electrician",
    title: "Apprentice Electrician",
    shortTitle: "Apprentice",
    employmentType: "FULL_TIME",
    typeLabel: "Full-time · Paid training",
    category: "Field",
    overview:
      "Learn the trade through first-hand experience alongside our certified electricians. No experience required — just a strong work ethic and the drive to build a career.",
    cardSummary:
      "Start your electrical career with paid on-the-job training alongside our certified electricians. Earn while you learn — no experience required.",
    highlights: ["Paid training", "No experience needed", "~4-year path to Journeyman"],
    sections: [
      {
        heading: "Qualifications",
        items: [
          "At least 18 years of age",
          "High School Diploma or GED",
          "Valid driver's license, automobile insurance, and reliable transportation",
          "Strong interest in an electrical career",
          "Communication skills, self-supervision, and respect for safety",
          "Hard working with a desire to learn",
          "Physically able to perform the work of the electrical trade",
          "Team spirit — works closely with maintenance, production, engineering, and outdoor services",
          "Willing to work overtime when needed",
          "Versatile work schedule (shift work)",
        ],
      },
      {
        heading: "What the apprenticeship looks like",
        body:
          "A blend of classroom and paid on-the-job training — typically 144 hours in the classroom and 2,000 hours on the job under the supervision of a certified electrician, lasting approximately 4 years. Apprentices learn theory, mathematics, blueprint and schematic reading, safety, and state and local codes. Once training is complete, apprentices are eligible to become Journeyman Electricians.",
      },
    ],
    datePosted: "2026-08-26",
  },
  {
    slug: "journeyman-electrician",
    title: "Journeyman Electrician",
    shortTitle: "Journeyman",
    employmentType: "FULL_TIME",
    typeLabel: "Full-time · Certified trade",
    category: "Field",
    overview:
      "Work alongside other Certified Journeymen and Electricians on high-profile residential, commercial, and industrial projects — installing, maintaining, and repairing electrical wiring, equipment, and fixtures. You may also work on power distribution, fire alarm, audio/visual, automation, and low-voltage systems.",
    cardSummary:
      "Join high-profile residential, commercial, and industrial projects across the Greater St. Louis area. Certified or certification-ready electricians welcome.",
    highlights: ["High-profile projects", "Varied systems & sites", "Room to specialize"],
    sections: [
      {
        heading: "Qualifications",
        items: [
          "Understanding and enthusiastic agreement with the vision and mission of Show Me Electrical Services",
          "Pass a background check, including drug test",
          "Journeyman certification, or equivalent experience and willingness to get certified",
          "Experience installing conduit and wiring systems",
          "Owns personal electrician tools",
          "Reliable transportation",
          "Proof of previous job stability",
          "Excellent safety record",
          "Ambitious, career-oriented desire to learn and advance",
          "Superior work ethic and eagerness to succeed",
        ],
      },
      {
        heading: "A plus, but not required",
        items: [
          "Large feeder distribution",
          "Medium-voltage installation",
          "Switchgear and generators",
          "Underground distribution",
          "Fire alarms and UPS systems",
          "Layout and supervisory experience",
        ],
      },
      {
        heading: "Responsibilities",
        items: [
          "Generate high-quality work in alignment with the company's vision and mission",
          "Install, maintain, and repair electrical wiring, equipment, and fixtures across varied job sites",
          "Work on a variety of power distribution and other systems",
          "Perform a variety of tasks as assigned",
        ],
      },
    ],
    datePosted: "2026-08-26",
  },
  {
    slug: "electrical-estimator",
    title: "Electrical Estimator",
    shortTitle: "Estimator",
    employmentType: "FULL_TIME",
    typeLabel: "Full-time · Office + site visits",
    category: "Office",
    overview:
      "Prepare accurate cost estimates for commercial, industrial, and residential electrical projects. Review project plans, specifications, and bid documents to determine labor, material, equipment, and subcontractor costs while ensuring competitive and profitable bids.",
    cardSummary:
      "Own the numbers behind our projects — takeoffs, vendor quotes, budgets, and bid proposals for work across the greater St. Louis area.",
    highlights: ["3+ yrs estimating", "Accubid / Bluebeam", "Salary + bonuses"],
    sections: [
      {
        heading: "Key responsibilities",
        items: [
          "Review project drawings, specifications, and contract documents",
          "Prepare detailed and accurate cost estimates for electrical construction projects",
          "Perform quantity takeoffs for labor, materials, and equipment",
          "Solicit and evaluate vendor and subcontractor quotations",
          "Develop project budgets and bid proposals",
          "Identify project risks and recommend cost-saving alternatives",
          "Collaborate with project managers, engineers, and clients during the bidding process",
          "Maintain current pricing databases for labor, materials, and equipment",
          "Attend pre-bid meetings and site visits as required",
          "Ensure estimates comply with project specifications, building codes, and company standards",
          "Assist with project handoff to operations after contract award",
        ],
      },
      {
        heading: "Qualifications",
        items: [
          "High school diploma or equivalent required; Associate's or Bachelor's degree in Construction Management, Electrical Engineering, or a related field preferred",
          "3+ years of electrical estimating experience (commercial, industrial, or residential)",
          "Strong understanding of electrical systems, construction methods, and applicable codes",
          "Proficiency with estimating software such as Accubid, McCormick, Bluebeam, or similar",
          "Ability to read and interpret electrical drawings and specifications",
          "Strong analytical, mathematical, and organizational skills",
          "Excellent written and verbal communication skills",
          "Proficiency in Microsoft Excel, Word, and Outlook",
        ],
      },
      {
        heading: "Preferred skills",
        items: [
          "Knowledge of NEC (National Electrical Code)",
          "Experience with design-build and negotiated projects",
          "Strong negotiation and vendor management skills",
          "Ability to manage multiple bids and meet tight deadlines",
          "High attention to detail and problem-solving abilities",
        ],
      },
      {
        heading: "Physical requirements",
        items: [
          "Ability to sit for extended periods while working on estimates",
          "Occasional travel to job sites for field verification and pre-bid meetings",
          "Ability to lift up to 25 pounds, as needed",
        ],
      },
      {
        heading: "Benefits",
        items: [
          "Competitive salary",
          "Health, dental, and vision insurance",
          "Paid time off and holidays",
          "Retirement savings plan (401(k))",
          "Professional development and training opportunities",
          "Performance-based bonuses",
        ],
      },
    ],
    datePosted: "2026-08-27",
  },
  {
    slug: "administrative-assistant",
    title: "Administrative Assistant",
    shortTitle: "Admin Assistant",
    employmentType: "FULL_TIME",
    typeLabel: "Full-time · Office-based",
    category: "Office",
    overview:
      "A dependable, organized, detail-oriented Administrative Assistant supporting daily operations — assisting management, project managers, estimators, field personnel, customers, vendors, and subcontractors in a fast-paced construction environment.",
    cardSummary:
      "Keep a fast-paced electrical contractor running smoothly — supporting project managers, estimators, field crews, and customers from our Affton office.",
    highlights: ["Health / dental / vision", "401(k) + PTO", "Growth & bonuses"],
    sections: [
      {
        heading: "Key responsibilities",
        items: [
          "Answer phones, emails, and customer inquiries professionally",
          "Assist project managers and estimators with administrative tasks and project documentation",
          "Prepare and maintain proposals, contracts, purchase orders, work orders, invoices, and change orders",
          "Enter and maintain customer, project, vendor, and employee information",
          "Track project paperwork, deadlines, permits, inspections, and required documentation",
          "Assist with scheduling service calls, crews, inspections, meetings, and project activities",
          "Communicate with customers, vendors, suppliers, subcontractors, and field employees",
          "Request pricing, obtain quotes, and assist with material and equipment orders",
          "Assist with AP/AR documentation",
          "Prepare reports, spreadsheets, and correspondence",
          "Maintain organized electronic and paper filing systems",
          "Assist with onboarding paperwork, timekeeping, and office administration",
          "Support management with special projects and other duties as needed",
        ],
      },
      {
        heading: "Qualifications",
        items: [
          "High school diploma or equivalent required; business or construction-related education a plus",
          "2+ years of administrative, office, construction, or contractor-office experience preferred",
          "Strong computer skills: Word, Excel, Outlook, PDF/document management",
          "Excellent organization and attention to detail",
          "Strong written and verbal communication",
          "Ability to prioritize multiple tasks and meet deadlines",
          "Professional, dependable, customer-service oriented",
          "Ability to learn electrical contracting terminology, procedures, and software",
        ],
      },
      {
        heading: "Preferred experience",
        items: [
          "Experience working for an electrical, mechanical, plumbing, HVAC, or general contractor",
          "Familiarity with construction documents, purchase orders, invoices, change orders, and project schedules",
          "Experience with construction management, estimating, accounting, or service software",
          "Basic understanding of electrical construction terminology is a plus",
        ],
      },
      {
        heading: "Work environment",
        body:
          "Primarily office-based with occasional job-site interaction; fast-paced; may occasionally require extended hours.",
      },
      {
        heading: "Benefits",
        items: [
          "Competitive salary",
          "Health, dental, and vision insurance",
          "PTO and holidays",
          "401(k)",
          "Professional development",
          "Performance-based bonuses when applicable",
        ],
      },
    ],
    datePosted: "2026-08-26",
  },
];

const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Careers | Show Me Electrical — Electrician Jobs in St. Louis, MO",
    template: "%s | Show Me Electrical Careers",
  },
  description:
    "Build your electrical career with Show Me Electrical Services. Now hiring Apprentice Electricians, Journeyman Electricians, an Electrical Estimator, and an Administrative Assistant in the greater St. Louis area. Paid training and a clear path from Apprentice to certified Journeyman.",
  openGraph: {
    type: "website",
    siteName: "Show Me Electrical Careers",
    title: "Careers | Show Me Electrical — Electrician Jobs in St. Louis, MO",
    description:
      "Now hiring Apprentice Electricians, Journeyman Electricians, an Electrical Estimator, and an Administrative Assistant. Paid training, steady work, and a clear path from Apprentice to certified Journeyman.",
    url: SITE_URL,
    images: [
      {
        url: `${WP_URL}/wp-content/uploads/2024/08/Show-me-electric-white-logo-4.png`,
        alt: "Show Me Electrical Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers | Show Me Electrical",
    description:
      "Electrician jobs in St. Louis, MO — paid training and a clear path from Apprentice to certified Journeyman.",
  },
  alternates: { canonical: SITE_URL },
};


export const careers = {
  jobs,
  metadata,
  apply: {
    from: "Show Me Electrical Careers <careers@send.compassmarketing.ai>",
    recipients: ["info@showmeelectrical.com", "thomas@compassmarketing.ai"],
  },
};
