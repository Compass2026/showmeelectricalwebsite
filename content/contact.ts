import type { InquiryFormLabels } from "@/components/site/InquiryForm";

/**
 * CONTACT PAGE CONTENT — /contact. Page copy and every string the inquiry
 * form shows. The form component carries no wording of its own.
 */
export const contact = {
  path: "/contact",
  seo: {
    title: "Contact Show Me Electrical | Free Quotes in St. Louis, MO",
    description:
      "Tell us about your electrical project and we'll come back with a clear scope. Call, email or send the details — free consultations in the St. Louis area.",
  },
  hero: {
    eyebrow: "Contact",
    headline: "Let's talk about your project",
    intro:
      "Free consultation, straight answers and a clear scope before any work starts. Call, email, or send us the details below and we'll get you on the schedule.",
  },
  cards: {
    call: {
      heading: "Call us",
      body: "Fastest way to reach us during business hours.",
    },
    email: {
      heading: "Email us",
      body: "Send project details and we'll come back to you.",
    },
    shop: { heading: "Our shop" },
  },
  form: {
    eyebrow: "Send the details",
    heading: "Tell us what you need",
    intro:
      "A name, a way to reach you and a few lines about the job. We read every message and reply by phone or email — no automated follow-ups.",
  },
  formLabels: {
    name: "Your name",
    email: "Email",
    phone: "Phone",
    contactHint: "Give us at least one — email or phone.",
    service: "What do you need help with?",
    servicePlaceholder: "Choose a service (optional)",
    details: "Project details",
    detailsHint: "What's happening, where, and anything you've already noticed.",
    submit: "Send message",
    submitting: "Sending…",
    errors: {
      name: {
        required: "Please tell us your name.",
        tooLong: "Please keep your name under 100 characters.",
      },
      email: {
        invalid: "That email address doesn't look right.",
        tooLong: "Please keep your email under 200 characters.",
      },
      phone: {
        invalid: "Please enter a 10-digit phone number.",
        tooLong: "Please keep your phone number under 30 characters.",
      },
      service: { invalid: "Please choose a service from the list." },
      details: {
        required: "Please tell us a little about the project.",
        tooLong: "Please keep the details under 3,000 characters.",
      },
      contact: "Add an email address or a phone number so we can reply.",
      fix: "Please check the highlighted fields.",
    },
    success: {
      heading: "Thanks — your message is on its way.",
      body: "We'll read it and get back to you by phone or email. If it's urgent, call us directly:",
      again: "Send another message",
    },
    failure: {
      heading: "We couldn't send your message.",
      body: "Nothing you typed has been lost. Please try again in a moment, or reach us directly:",
      network: "We couldn't reach the server. Check your connection and try again.",
    },
    noscript: "This form needs JavaScript to send. You can reach us directly instead:",
  } satisfies InquiryFormLabels,
};
