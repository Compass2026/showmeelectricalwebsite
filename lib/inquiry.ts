import { servicePages } from "@/content/services";

/**
 * INQUIRY FORM — shared model and validation.
 *
 * Imported by both the client form (pre-submit checks) and the route handler
 * (authoritative checks), so the two can never disagree. No copy lives here:
 * validation returns CODES, and the caller maps them to wording (the form
 * from its labels object, the route from generic server messages).
 */
export const INQUIRY_LIMITS = {
  name: 100,
  email: 200,
  phone: 30,
  service: 120,
  details: 3000,
} as const;

export interface InquiryInput {
  name: string;
  email: string;
  phone: string;
  service: string;
  details: string;
}

export type InquiryField = keyof InquiryInput;
export type InquiryErrorCode = "required" | "invalid" | "tooLong" | "contact";
export type InquiryErrors = Partial<Record<InquiryField | "contact", InquiryErrorCode>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normaliseInquiry(raw: Partial<Record<InquiryField, unknown>>): InquiryInput {
  const str = (v: unknown, max: number) =>
    typeof v === "string" ? v.replace(/\r\n?/g, "\n").trim().slice(0, max + 1) : "";
  return {
    name: str(raw.name, INQUIRY_LIMITS.name),
    email: str(raw.email, INQUIRY_LIMITS.email),
    phone: str(raw.phone, INQUIRY_LIMITS.phone),
    service: str(raw.service, INQUIRY_LIMITS.service),
    details: str(raw.details, INQUIRY_LIMITS.details),
  };
}

export function isValidEmail(email: string) {
  return EMAIL_RE.test(email);
}

/** Ten US digits, with or without a leading 1. */
export function phoneDigits(phone: string) {
  const d = phone.replace(/\D/g, "");
  return d.length === 11 && d.startsWith("1") ? d.slice(1) : d;
}

export function isValidPhone(phone: string) {
  return phoneDigits(phone).length === 10;
}

/**
 * Rules: name and details required; at least one VALID contact method
 * (email or phone); whatever is supplied must be well-formed and within
 * limits; service, if given, must be one of the offered options.
 */
export function validateInquiry(input: InquiryInput): InquiryErrors {
  const errors: InquiryErrors = {};
  (Object.keys(INQUIRY_LIMITS) as InquiryField[]).forEach((f) => {
    if (input[f].length > INQUIRY_LIMITS[f]) errors[f] = "tooLong";
  });
  if (!input.name) errors.name = "required";
  if (!input.details) errors.details = "required";
  if (input.email && !isValidEmail(input.email)) errors.email = "invalid";
  if (input.phone && !isValidPhone(input.phone)) errors.phone = "invalid";
  if (input.service && !isKnownService(input.service)) errors.service = "invalid";

  const hasEmail = input.email && !errors.email;
  const hasPhone = input.phone && !errors.phone;
  if (!hasEmail && !hasPhone) {
    if (!input.email && !input.phone) errors.contact = "contact";
    // If they typed something invalid, the field error already explains it.
  }
  return errors;
}

/* ------------------------------------------------------------------ *
 * Service choices — generated from the registry of built service pages,
 * so the form can only ever offer services the site actually describes.
 * ------------------------------------------------------------------ */
export interface ServiceOptionGroup {
  label: string;
  options: string[];
}

export const OTHER_SERVICE = "Not sure yet / something else";

export const inquiryServiceGroups: ServiceOptionGroup[] = [
  ...servicePages.map((page) => ({
    label: page.schema.name,
    options: page.services.items.map((item) => item.name),
  })),
  { label: "Other", options: [OTHER_SERVICE] },
];

const knownServices = new Set(inquiryServiceGroups.flatMap((g) => g.options));

export function isKnownService(value: string) {
  return knownServices.has(value);
}
