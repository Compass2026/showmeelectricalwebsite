import { servicePages } from "@/content/services";
import { contact } from "@/content/contact";

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

/**
 * DUPLICATE-SAFE SUBMISSIONS.
 *
 * The form mints one `submissionId` (UUID) per message and sends it with
 * every attempt of that message. The id is bound to the message CONTENT:
 * a retry of unchanged content reuses it; an edited message gets a new id
 * (the form re-mints when the content differs from the last attempt).
 *
 * The route treats the id as an idempotency key with two layers:
 *   - a durable store (lib/idempotency.ts) that records the content
 *     fingerprint and completion per id, shared across handler instances
 *     that share a disk, with atomic claims for simultaneous requests;
 *   - the email provider's own idempotency key (Resend `Idempotency-Key`),
 *     which is the guard across serverless instances that share nothing.
 *
 * Outcomes are explicit: unchanged repeat → `{ ok: true, duplicate: true }`
 * with nothing sent; same id + different content → 409 `submission_changed`;
 * same id while the first send is still in flight → 409 `in_progress`.
 * Nothing is ever reported as success without a completed delivery.
 *
 * Retention: `SUBMISSION_ID_RETENTION_MS` (24 h), matching the provider's
 * documented idempotency window, after which an id may be reused as new.
 */
export const SUBMISSION_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const SUBMISSION_ID_RETENTION_MS = 24 * 60 * 60 * 1000;

export type InquiryConflictCode = "submission_changed" | "in_progress";

/** The response body shape the form understands. */
export interface InquiryResponse {
  ok?: boolean;
  duplicate?: boolean;
  delivery?: string;
  error?: string;
  code?: InquiryConflictCode;
  errors?: InquiryErrors;
}

export function readSubmissionId(raw: unknown): string | null {
  return typeof raw === "string" && SUBMISSION_ID_RE.test(raw) ? raw.toLowerCase() : null;
}

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

export const OTHER_SERVICE = contact.otherService;

export const inquiryServiceGroups: ServiceOptionGroup[] = [
  ...servicePages.map((page) => ({
    label: page.schema.name,
    options: page.services.items.map((item) => item.name),
  })),
  { label: contact.otherGroup, options: [OTHER_SERVICE] },
];

const knownServices = new Set(inquiryServiceGroups.flatMap((g) => g.options));

export function isKnownService(value: string) {
  return knownServices.has(value);
}
