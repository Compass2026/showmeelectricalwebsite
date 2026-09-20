"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  INQUIRY_LIMITS,
  normaliseInquiry,
  validateInquiry,
  type InquiryErrorCode,
  type InquiryErrors,
  type InquiryField,
  type InquiryInput,
  type ServiceOptionGroup,
} from "@/lib/inquiry";

/**
 * INQUIRY FORM — reusable. Every visible string comes from `labels`; the
 * service choices from `groups`; the delivery endpoint from `endpoint`;
 * the phone/email fallback from `fallback`. The component owns behaviour
 * only: validation (shared with the server), submit states, and keeping
 * the visitor's input intact after a failure.
 *
 * Success is shown ONLY after the server answers 2xx with `{ ok: true }`.
 *
 * Before hydration (and forever without JavaScript) the submit button is
 * rendered disabled, so the browser can never perform a native submission
 * that would put the visitor's details into a URL. `method="post"` +
 * `action` are a second guard for the same reason. The phone and email are
 * always on the page beside the form.
 */
export interface InquiryFormLabels {
  name: string;
  email: string;
  phone: string;
  contactHint: string;
  service: string;
  servicePlaceholder: string;
  details: string;
  detailsHint: string;
  submit: string;
  submitting: string;
  errors: {
    name: { required: string; tooLong: string };
    email: { invalid: string; tooLong: string };
    phone: { invalid: string; tooLong: string };
    service: { invalid: string };
    details: { required: string; tooLong: string };
    contact: string;
    fix: string;
  };
  success: { heading: string; body: string; again: string };
  failure: { heading: string; body: string; network: string };
  /** Shown only when JavaScript is off — the form cannot submit without it. */
  noscript: string;
}

export interface InquiryFallback {
  phone: string;
  phoneHref: string;
  email: string;
}

type Status = "idle" | "submitting" | "success" | "error";

const empty: InquiryInput = { name: "", email: "", phone: "", service: "", details: "" };

const inputBase =
  "mt-1.5 block w-full rounded-lg border bg-white px-4 py-3 text-base text-ink shadow-sm outline-none transition-colors placeholder:text-ink/40 focus:border-accent-700 focus:ring-2 focus:ring-accent-500/40";
const inputOk = "border-primary-900/20";
const inputBad = "border-red-500 focus:border-red-500 focus:ring-red-200";

export default function InquiryForm({
  endpoint,
  labels,
  groups,
  fallback,
}: {
  endpoint: string;
  labels: InquiryFormLabels;
  groups: ServiceOptionGroup[];
  fallback: InquiryFallback;
}) {
  const id = useId();
  const [values, setValues] = useState<InquiryInput>(empty);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState<string>("");
  /** False in server HTML and until React has attached the submit handler. */
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  /**
   * One id per message, minted on the client after hydration and reused for
   * every attempt of that message (so a retry after a network error can
   * never deliver twice — the server recognises the id). Reset with the form.
   */
  const submissionId = useRef<string>("");
  useEffect(() => {
    if (!submissionId.current) submissionId.current = newSubmissionId();
  }, []);
  const alertRef = useRef<HTMLDivElement>(null);

  // Move focus to the failure notice once it has rendered.
  useEffect(() => {
    if (status === "error") alertRef.current?.focus();
  }, [status]);

  const message = (field: InquiryField | "contact", code: InquiryErrorCode | undefined) => {
    if (!code) return "";
    if (field === "contact") return labels.errors.contact;
    const table = labels.errors[field] as Partial<Record<InquiryErrorCode, string>>;
    return table[code] ?? labels.errors.fix;
  };

  const set = (field: InquiryField) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field] || errors.contact) {
      setErrors((e) => {
        const next = { ...e };
        delete next[field];
        if (field === "email" || field === "phone") delete next.contact;
        return next;
      });
    }
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const data = normaliseInquiry(values);
    const found = validateInquiry(data);
    if (Object.keys(found).length) {
      setErrors(found);
      setStatus("idle");
      focusFirstInvalid(event.currentTarget, found);
      return;
    }

    setStatus("submitting");
    setFailure("");
    const honeypot = (event.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, website: honeypot, submissionId: submissionId.current }),
        signal: controller.signal,
      });
      clearTimeout(timer);

      let body: { ok?: boolean; error?: string; errors?: InquiryErrors } = {};
      try {
        body = await res.json();
      } catch {
        body = {};
      }

      if (res.ok && body.ok === true) {
        setStatus("success");
        return;
      }
      if (res.status === 400 && body.errors && Object.keys(body.errors).length) {
        setErrors(body.errors);
        setStatus("idle");
        focusFirstInvalid(event.currentTarget, body.errors);
        return;
      }
      setFailure(body.error ?? "");
      setStatus("error");
    } catch {
      setFailure(labels.failure.network);
      setStatus("error");
    }
    // Values are untouched on every non-success path.
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-accent-700/30 bg-accent-500/10 p-8"
      >
        <p className="text-xl font-extrabold text-primary-900">{labels.success.heading}</p>
        <p className="mt-3 leading-relaxed text-ink/80">{labels.success.body}</p>
        <p className="mt-3">
          <a
            href={fallback.phoneHref}
            className="-my-1 inline-block py-1 text-lg font-extrabold text-primary-900 underline underline-offset-4 hover:text-accent-700"
          >
            {fallback.phone}
          </a>
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(empty);
            setErrors({});
            setStatus("idle");
            submissionId.current = newSubmissionId();
          }}
          className="mt-6 text-sm font-bold text-accent-700 underline underline-offset-4"
        >
          {labels.success.again}
        </button>
      </div>
    );
  }

  const fieldId = (f: string) => `${id}-${f}`;
  const errId = (f: string) => `${id}-${f}-error`;
  const contactHintId = `${id}-contact-hint`;
  const describedBy = (f: InquiryField, hintId?: string) =>
    [errors[f] ? errId(f) : null, hintId ?? null].filter(Boolean).join(" ") || undefined;

  return (
    <form
      onSubmit={onSubmit}
      method="post"
      action={endpoint}
      noValidate
      aria-busy={status === "submitting"}
    >
      <noscript>
        <p className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          {labels.noscript}{" "}
          <a href={fallback.phoneHref} className="font-bold underline">
            {fallback.phone}
          </a>
          <span aria-hidden="true"> · </span>
          <a href={`mailto:${fallback.email}`} className="font-bold underline">
            {fallback.email}
          </a>
        </p>
      </noscript>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={fieldId("name")}
          label={labels.name}
          error={message("name", errors.name)}
          errorId={errId("name")}
          className="sm:col-span-2"
        >
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete="name"
            maxLength={INQUIRY_LIMITS.name}
            required
            value={values.name}
            onChange={(e) => set("name")(e.target.value)}
            aria-invalid={!!errors.name || undefined}
            aria-describedby={describedBy("name")}
            className={`${inputBase} ${errors.name ? inputBad : inputOk}`}
          />
        </Field>

        <Field
          id={fieldId("email")}
          label={labels.email}
          error={message("email", errors.email)}
          errorId={errId("email")}
        >
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={INQUIRY_LIMITS.email}
            value={values.email}
            onChange={(e) => set("email")(e.target.value)}
            aria-invalid={!!errors.email || !!errors.contact || undefined}
            aria-describedby={describedBy("email", contactHintId)}
            className={`${inputBase} ${errors.email || errors.contact ? inputBad : inputOk}`}
          />
        </Field>

        <Field
          id={fieldId("phone")}
          label={labels.phone}
          error={message("phone", errors.phone)}
          errorId={errId("phone")}
        >
          <input
            id={fieldId("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={INQUIRY_LIMITS.phone}
            value={values.phone}
            onChange={(e) => set("phone")(e.target.value)}
            aria-invalid={!!errors.phone || !!errors.contact || undefined}
            aria-describedby={describedBy("phone", contactHintId)}
            className={`${inputBase} ${errors.phone || errors.contact ? inputBad : inputOk}`}
          />
        </Field>

        <div className="-mt-2 sm:col-span-2">
          {errors.contact ? (
            <p id={contactHintId} role="alert" className="text-sm font-medium text-red-600">
              {labels.errors.contact}
            </p>
          ) : (
            <p id={contactHintId} className="text-sm text-ink/60">
              {labels.contactHint}
            </p>
          )}
        </div>

        <Field
          id={fieldId("service")}
          label={labels.service}
          error={message("service", errors.service)}
          errorId={errId("service")}
          className="sm:col-span-2"
        >
          <select
            id={fieldId("service")}
            name="service"
            value={values.service}
            onChange={(e) => set("service")(e.target.value)}
            aria-invalid={!!errors.service || undefined}
            aria-describedby={describedBy("service")}
            className={`${inputBase} ${errors.service ? inputBad : inputOk} ${values.service ? "" : "text-ink/60"}`}
          >
            <option value="">{labels.servicePlaceholder}</option>
            {groups.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>

        <Field
          id={fieldId("details")}
          label={labels.details}
          error={message("details", errors.details)}
          errorId={errId("details")}
          hint={labels.detailsHint}
          hintId={`${id}-details-hint`}
          className="sm:col-span-2"
        >
          <textarea
            id={fieldId("details")}
            name="details"
            rows={6}
            maxLength={INQUIRY_LIMITS.details}
            required
            value={values.details}
            onChange={(e) => set("details")(e.target.value)}
            aria-invalid={!!errors.details || undefined}
            aria-describedby={describedBy("details", `${id}-details-hint`)}
            className={`${inputBase} resize-y ${errors.details ? inputBad : inputOk}`}
          />
        </Field>
      </div>

      {/* Honeypot — hidden from people, filled by bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={fieldId("website")}>Website</label>
        <input id={fieldId("website")} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div aria-live="assertive">
        {status === "error" && (
          <div
            ref={alertRef}
            tabIndex={-1}
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 outline-none"
          >
            <p className="font-bold">{labels.failure.heading}</p>
            {failure && <p className="mt-1">{failure}</p>}
            <p className="mt-1">{labels.failure.body}</p>
            <p className="mt-2 font-semibold">
              <a href={fallback.phoneHref} className="-my-1 inline-block py-1 underline underline-offset-2">
                {fallback.phone}
              </a>
              <span aria-hidden="true"> · </span>
              <a href={`mailto:${fallback.email}`} className="-my-1 inline-block py-1 underline underline-offset-2">
                {fallback.email}
              </a>
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={!ready || status === "submitting"}
          aria-disabled={!ready || undefined}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-950 shadow-lg shadow-accent-500/20 transition-colors hover:bg-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 disabled:cursor-wait disabled:opacity-70"
        >
          {status === "submitting" && (
            <span
              aria-hidden="true"
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-950/30 border-t-primary-950"
            />
          )}
          {status === "submitting" ? labels.submitting : labels.submit}
        </button>
        {Object.keys(errors).length > 0 && status === "idle" && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {labels.errors.fix}
          </p>
        )}
      </div>
    </form>
  );
}

/**
 * After a failed validation, move focus to the first field with a problem
 * (in form order) so keyboard and screen-reader users land on what to fix.
 * The "contact" rule points at the email field.
 */
function focusFirstInvalid(form: HTMLFormElement, errors: InquiryErrors) {
  const order: (InquiryField | "contact")[] = ["name", "email", "phone", "service", "details"];
  const first = order.find((f) => errors[f]) ?? (errors.contact ? "contact" : undefined);
  const name = first === "contact" ? "email" : first;
  if (!name) return;
  const el = form.elements.namedItem(name) as HTMLElement | null;
  requestAnimationFrame(() => el?.focus());
}

function newSubmissionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  // Very old browsers: still a well-formed UUID v4 shape.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function Field({
  id,
  label,
  error,
  errorId,
  hint,
  hintId,
  className = "",
  children,
}: {
  id: string;
  label: string;
  error: string;
  errorId: string;
  hint?: string;
  hintId?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-bold text-primary-900">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-sm text-ink/60">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
