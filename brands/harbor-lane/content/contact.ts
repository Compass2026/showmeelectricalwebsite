import type { InquiryFormLabels } from "@/components/site/InquiryForm";

/** CONTACT — Harbor Lane (fictional demo). Delivery is always mocked (inquiry.config forceMock). */
export const contact = {
  path: "/contact",
  otherGroup: "Other",
  otherService: "Not sure yet / something else",
  seo: {
    title: "Contact Harbor Lane Plumbing (Fictional Demo)",
    description: "Fictional demo: book a free walkthrough with Harbor Lane Plumbing. Messages on this demonstration site are never delivered.",
  },
  hero: {
    eyebrow: "Contact",
    headline: "Book a free walkthrough",
    intro: "Tell us what's happening, or what you're planning, and the nearer branch will call you back. This is a demonstration site: messages are accepted but never delivered anywhere.",
  },
  cards: {
    call: { heading: "Call the office", body: "The main number routes you to the nearer branch." },
    email: { heading: "Email", body: "Send the details and photos if you have them." },
    shop: { heading: "Head office (Eastgate)", note: "Two branches: Westfield (north) and Eastgate (south)." },
  },
  form: {
    eyebrow: "Send the details",
    heading: "Tell us what you need",
    intro: "A name, a way to reach you and a few lines about the job. We reply by phone or email.",
  },
  formLabels: {
    name: "Your name",
    email: "Email",
    phone: "Phone",
    contactHint: "Give us at least one — email or phone.",
    service: "What do you need help with?",
    servicePlaceholder: "Choose a service (optional)",
    details: "Job details",
    detailsHint: "What's happening, where, and anything you've already noticed.",
    submit: "Send message",
    submitting: "Sending…",
    errors: {
      name: { required: "Please tell us your name.", tooLong: "Please keep your name under 100 characters." },
      email: { invalid: "That email address doesn't look right.", tooLong: "Please keep your email under 200 characters." },
      phone: { invalid: "Please enter a 10-digit phone number.", tooLong: "Please keep your phone number under 30 characters." },
      service: { invalid: "Please choose a service from the list." },
      details: { required: "Please tell us a little about the job.", tooLong: "Please keep the details under 3,000 characters." },
      contact: "Add an email address or a phone number so we can reply.",
      fix: "Please check the highlighted fields.",
    },
    success: {
      heading: "Thanks — your message was accepted.",
      body: "On a real site the nearer branch would call you back. On this demonstration nothing is delivered. If it were urgent, you would call:",
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
