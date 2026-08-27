"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { jobs, type RoleSlug } from "@/lib/jobs";

type YesNo = "yes" | "no" | "";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: RoleSlug | "";
  // Apprentice
  over18: YesNo;
  diploma: YesNo;
  licenseTransport: YesNo;
  whyElectrician: string;
  // Journeyman
  licenseStatus: string;
  ownTools: YesNo;
  experienceSummary: string;
  // Shared (journeyman + admin)
  yearsExperience: string;
  // Admin
  contractorOffice: YesNo;
  software: string;
  adminSummary: string;
}

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  over18: "",
  diploma: "",
  licenseTransport: "",
  whyElectrician: "",
  licenseStatus: "",
  ownTools: "",
  experienceSummary: "",
  yearsExperience: "",
  contractorOffice: "",
  software: "",
  adminSummary: "",
};

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function ApplicationForm() {
  return (
    <Suspense fallback={<ApplicationFormInner preselectedRole="" />}>
      <RoleAwareForm />
    </Suspense>
  );
}

function RoleAwareForm() {
  const params = useSearchParams();
  return <ApplicationFormInner preselectedRole={params.get("role") ?? ""} />;
}

function ApplicationFormInner({ preselectedRole }: { preselectedRole: string }) {
  const validRole = jobs.find((j) => j.slug === preselectedRole)?.slug ?? "";
  const [form, setForm] = useState<FormState>({
    ...initialState,
    role: validRole,
  });

  // Sync role when the user clicks "Apply" on a job card after the form
  // has already mounted (client navigation only changes the query string).
  useEffect(() => {
    if (validRole) {
      setForm((f) => (f.role === validRole ? f : { ...f, role: validRole }));
    }
  }, [validRole]);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resume, setResume] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  const roleTitle = useMemo(
    () => jobs.find((j) => j.slug === form.role)?.title ?? "",
    [form.role]
  );

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function validateStep1(): boolean {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length !== 10)
      e.phone = "Enter a valid 10-digit phone number.";
    if (!form.role) e.role = "Select the role you're applying for.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2(): boolean {
    const e: Record<string, string> = {};
    if (form.role === "apprentice-electrician") {
      if (!form.over18) e.over18 = "Required.";
      if (!form.diploma) e.diploma = "Required.";
      if (!form.licenseTransport) e.licenseTransport = "Required.";
      if (!form.whyElectrician.trim())
        e.whyElectrician = "Tell us briefly why you're interested.";
    } else if (form.role === "journeyman-electrician") {
      if (!form.licenseStatus) e.licenseStatus = "Select your license status.";
      if (!form.yearsExperience)
        e.yearsExperience = "Enter your years of experience.";
      if (!form.ownTools) e.ownTools = "Required.";
      if (!form.experienceSummary.trim())
        e.experienceSummary = "Give us a brief summary of your experience.";
    } else if (form.role === "electrical-estimator") {
      if (!form.yearsExperience)
        e.yearsExperience = "Enter your years of estimating experience.";
      if (!form.software.trim())
        e.software = "List the estimating software you've used.";
      if (!form.experienceSummary.trim())
        e.experienceSummary = "Tell us briefly about your estimating background.";
    } else if (form.role === "administrative-assistant") {
      if (!form.yearsExperience)
        e.yearsExperience = "Enter your years of experience.";
      if (!form.contractorOffice) e.contractorOffice = "Required.";
      if (!form.software.trim())
        e.software = "List the software you're familiar with.";
      if (!form.adminSummary.trim())
        e.adminSummary = "Tell us briefly about your background.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleResume(file: File | null) {
    setErrors((e) => {
      const next = { ...e };
      delete next.resume;
      return next;
    });
    if (!file) {
      setResume(null);
      return;
    }
    if (!RESUME_TYPES.includes(file.type)) {
      setErrors((e) => ({ ...e, resume: "Please upload a PDF or Word document." }));
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      setErrors((e) => ({ ...e, resume: "File is too large (max 5MB)." }));
      return;
    }
    setResume(file);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setServerError("");

    const data = new FormData();
    const honeypot = (
      event.currentTarget.elements.namedItem("company") as HTMLInputElement | null
    )?.value;
    data.set("company", honeypot ?? "");
    Object.entries(form).forEach(([k, v]) => data.set(k, v));
    if (resume) data.set("resume", resume);

    try {
      const res = await fetch("/api/apply", { method: "POST", body: data });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
      scrollTop();
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div ref={topRef} className="rounded-2xl border border-lime-500/40 bg-white p-10 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime-500/15">
          <svg className="h-8 w-8 text-lime-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-5 text-2xl font-bold text-navy-900">
          Thanks — we&apos;ll be in touch!
        </h3>
        <p className="mx-auto mt-3 max-w-md text-navy-900/70">
          Your application for <strong>{roleTitle}</strong> has been sent to our
          hiring team. We review every application and will reach out soon.
        </p>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full rounded-lg border bg-white px-4 py-3 text-navy-900 outline-none transition placeholder:text-navy-900/40 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/30 ${
      errors[field] ? "border-red-500" : "border-navy-900/15"
    }`;

  return (
    <div ref={topRef} className="rounded-2xl bg-white p-6 shadow-xl sm:p-10">
      {/* Step indicator */}
      <ol className="mb-8 flex items-center gap-2" aria-label="Application progress">
        {[
          { n: 1, label: "Your info" },
          { n: 2, label: "Role questions" },
          { n: 3, label: "Review" },
        ].map((s, i) => (
          <li key={s.n} className="flex flex-1 items-center gap-2">
            <span
              aria-current={step === s.n ? "step" : undefined}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                step >= s.n
                  ? "bg-lime-500 text-navy-950"
                  : "bg-navy-900/10 text-navy-900/50"
              }`}
            >
              {s.n}
            </span>
            <span
              className={`hidden text-xs font-semibold uppercase tracking-wide sm:block ${
                step >= s.n ? "text-navy-900" : "text-navy-900/40"
              }`}
            >
              {s.label}
            </span>
            {i < 2 && (
              <span
                aria-hidden="true"
                className={`h-0.5 flex-1 rounded ${step > s.n ? "bg-lime-500" : "bg-navy-900/10"}`}
              />
            )}
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit} noValidate>
        {/* Honeypot — hidden from real users */}
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {step === 1 && (
          <fieldset className="grid gap-5 sm:grid-cols-2">
            <legend className="sr-only">Contact information</legend>
            <Field label="First Name" required error={errors.firstName}>
              <input
                className={inputClass("firstName")}
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                autoComplete="given-name"
                aria-invalid={!!errors.firstName}
              />
            </Field>
            <Field label="Last Name" required error={errors.lastName}>
              <input
                className={inputClass("lastName")}
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                autoComplete="family-name"
                aria-invalid={!!errors.lastName}
              />
            </Field>
            <Field label="Email" required error={errors.email}>
              <input
                type="email"
                className={inputClass("email")}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
                aria-invalid={!!errors.email}
              />
            </Field>
            <Field label="Phone" required error={errors.phone}>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="(314) 555-0123"
                className={inputClass("phone")}
                value={form.phone}
                onChange={(e) => set("phone", formatPhone(e.target.value))}
                autoComplete="tel-national"
                aria-invalid={!!errors.phone}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Desired Role" required error={errors.role}>
                <select
                  className={inputClass("role")}
                  value={form.role}
                  onChange={(e) => set("role", e.target.value as RoleSlug | "")}
                  aria-invalid={!!errors.role}
                >
                  <option value="">Select a role…</option>
                  {jobs.map((j) => (
                    <option key={j.slug} value={j.slug}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </fieldset>
        )}

        {step === 2 && form.role === "apprentice-electrician" && (
          <fieldset className="grid gap-6">
            <legend className="sr-only">Apprentice Electrician questions</legend>
            <YesNoField
              label="Are you at least 18 years of age?"
              value={form.over18}
              onChange={(v) => set("over18", v)}
              error={errors.over18}
            />
            <YesNoField
              label="Do you have a High School Diploma or GED?"
              value={form.diploma}
              onChange={(v) => set("diploma", v)}
              error={errors.diploma}
            />
            <YesNoField
              label="Do you have a valid driver's license and reliable transportation?"
              value={form.licenseTransport}
              onChange={(v) => set("licenseTransport", v)}
              error={errors.licenseTransport}
            />
            <Field
              label="Why do you want to become an electrician?"
              required
              error={errors.whyElectrician}
            >
              <textarea
                rows={4}
                className={inputClass("whyElectrician")}
                value={form.whyElectrician}
                onChange={(e) => set("whyElectrician", e.target.value)}
                aria-invalid={!!errors.whyElectrician}
              />
            </Field>
            <ResumeField resume={resume} error={errors.resume} onChange={handleResume} />
          </fieldset>
        )}

        {step === 2 && form.role === "journeyman-electrician" && (
          <fieldset className="grid gap-6">
            <legend className="sr-only">Journeyman Electrician questions</legend>
            <Field label="License status" required error={errors.licenseStatus}>
              <select
                className={inputClass("licenseStatus")}
                value={form.licenseStatus}
                onChange={(e) => set("licenseStatus", e.target.value)}
                aria-invalid={!!errors.licenseStatus}
              >
                <option value="">Select…</option>
                <option>Licensed Journeyman</option>
                <option>Equivalent experience — willing to get licensed</option>
              </select>
            </Field>
            <Field label="Years of electrical experience" required error={errors.yearsExperience}>
              <input
                type="number"
                min={0}
                max={60}
                className={inputClass("yearsExperience")}
                value={form.yearsExperience}
                onChange={(e) => set("yearsExperience", e.target.value)}
                aria-invalid={!!errors.yearsExperience}
              />
            </Field>
            <YesNoField
              label="Do you own your personal electrician tools?"
              value={form.ownTools}
              onChange={(v) => set("ownTools", v)}
              error={errors.ownTools}
            />
            <Field label="Brief summary of your experience" required error={errors.experienceSummary}>
              <textarea
                rows={4}
                className={inputClass("experienceSummary")}
                value={form.experienceSummary}
                onChange={(e) => set("experienceSummary", e.target.value)}
                aria-invalid={!!errors.experienceSummary}
              />
            </Field>
            <ResumeField resume={resume} error={errors.resume} onChange={handleResume} />
          </fieldset>
        )}

        {step === 2 && form.role === "electrical-estimator" && (
          <fieldset className="grid gap-6">
            <legend className="sr-only">Electrical Estimator questions</legend>
            <Field label="Years of electrical estimating experience" required error={errors.yearsExperience}>
              <input
                type="number"
                min={0}
                max={60}
                className={inputClass("yearsExperience")}
                value={form.yearsExperience}
                onChange={(e) => set("yearsExperience", e.target.value)}
                aria-invalid={!!errors.yearsExperience}
              />
            </Field>
            <Field
              label="Estimating software you've used (Accubid, McCormick, Bluebeam…)"
              required
              error={errors.software}
            >
              <input
                className={inputClass("software")}
                value={form.software}
                onChange={(e) => set("software", e.target.value)}
                aria-invalid={!!errors.software}
              />
            </Field>
            <Field
              label="Brief summary of your estimating background"
              required
              error={errors.experienceSummary}
            >
              <textarea
                rows={4}
                className={inputClass("experienceSummary")}
                value={form.experienceSummary}
                onChange={(e) => set("experienceSummary", e.target.value)}
                aria-invalid={!!errors.experienceSummary}
              />
            </Field>
            <ResumeField resume={resume} error={errors.resume} onChange={handleResume} />
          </fieldset>
        )}

        {step === 2 && form.role === "administrative-assistant" && (
          <fieldset className="grid gap-6">
            <legend className="sr-only">Administrative Assistant questions</legend>
            <Field label="Years of admin/office experience" required error={errors.yearsExperience}>
              <input
                type="number"
                min={0}
                max={60}
                className={inputClass("yearsExperience")}
                value={form.yearsExperience}
                onChange={(e) => set("yearsExperience", e.target.value)}
                aria-invalid={!!errors.yearsExperience}
              />
            </Field>
            <YesNoField
              label="Have you worked in a contractor office before?"
              value={form.contractorOffice}
              onChange={(v) => set("contractorOffice", v)}
              error={errors.contractorOffice}
            />
            <Field
              label="Software familiarity (Word, Excel, Outlook, accounting/estimating software…)"
              required
              error={errors.software}
            >
              <input
                className={inputClass("software")}
                value={form.software}
                onChange={(e) => set("software", e.target.value)}
                aria-invalid={!!errors.software}
              />
            </Field>
            <Field label="Tell us briefly about your background" required error={errors.adminSummary}>
              <textarea
                rows={4}
                className={inputClass("adminSummary")}
                value={form.adminSummary}
                onChange={(e) => set("adminSummary", e.target.value)}
                aria-invalid={!!errors.adminSummary}
              />
            </Field>
            <ResumeField resume={resume} error={errors.resume} onChange={handleResume} />
          </fieldset>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-lg font-bold text-navy-900">Review your application</h3>
            <dl className="mt-5 divide-y divide-navy-900/10 rounded-lg border border-navy-900/10">
              <ReviewRow label="Name" value={`${form.firstName} ${form.lastName}`} />
              <ReviewRow label="Email" value={form.email} />
              <ReviewRow label="Phone" value={form.phone} />
              <ReviewRow label="Role" value={roleTitle} />
              {form.role === "apprentice-electrician" && (
                <>
                  <ReviewRow label="18 or older" value={form.over18} />
                  <ReviewRow label="Diploma / GED" value={form.diploma} />
                  <ReviewRow label="License & transportation" value={form.licenseTransport} />
                  <ReviewRow label="Why electrical" value={form.whyElectrician} />
                </>
              )}
              {form.role === "journeyman-electrician" && (
                <>
                  <ReviewRow label="License status" value={form.licenseStatus} />
                  <ReviewRow label="Years of experience" value={form.yearsExperience} />
                  <ReviewRow label="Owns tools" value={form.ownTools} />
                  <ReviewRow label="Experience summary" value={form.experienceSummary} />
                </>
              )}
              {form.role === "electrical-estimator" && (
                <>
                  <ReviewRow label="Years of estimating experience" value={form.yearsExperience} />
                  <ReviewRow label="Estimating software" value={form.software} />
                  <ReviewRow label="Estimating background" value={form.experienceSummary} />
                </>
              )}
              {form.role === "administrative-assistant" && (
                <>
                  <ReviewRow label="Years of experience" value={form.yearsExperience} />
                  <ReviewRow label="Contractor-office experience" value={form.contractorOffice} />
                  <ReviewRow label="Software" value={form.software} />
                  <ReviewRow label="Background" value={form.adminSummary} />
                </>
              )}
              <ReviewRow label="Resume" value={resume ? resume.name : "Not attached"} />
            </dl>
            {serverError && (
              <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {serverError}
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setStep((s) => (s === 3 ? 2 : 1));
                scrollTop();
              }}
              className="rounded-lg border border-navy-900/20 px-6 py-3 text-sm font-bold text-navy-900 transition hover:border-navy-900/40"
            >
              Back
            </button>
          ) : (
            <span />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && validateStep1()) {
                  setStep(2);
                  scrollTop();
                } else if (step === 2 && validateStep2()) {
                  setStep(3);
                  scrollTop();
                }
              }}
              className="rounded-lg bg-navy-900 px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-navy-800"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={status === "submitting"}
              className="rounded-lg bg-lime-500 px-8 py-3 text-sm font-bold uppercase tracking-wide text-navy-950 transition hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Submit Application"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-navy-900">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
      {error && (
        <span role="alert" className="mt-1.5 block text-sm font-medium text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

function YesNoField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
  error?: string;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-navy-900">
        {label}
        <span className="text-red-500"> *</span>
      </legend>
      <div className="flex gap-3">
        {(["yes", "no"] as const).map((v) => (
          <label
            key={v}
            className={`cursor-pointer rounded-lg border px-6 py-2.5 text-sm font-bold capitalize transition ${
              value === v
                ? "border-lime-500 bg-lime-500/15 text-navy-900"
                : "border-navy-900/15 text-navy-900/60 hover:border-navy-900/35"
            }`}
          >
            <input
              type="radio"
              className="sr-only"
              name={label}
              value={v}
              checked={value === v}
              onChange={() => onChange(v)}
            />
            {v}
          </label>
        ))}
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function ResumeField({
  resume,
  error,
  onChange,
}: {
  resume: File | null;
  error?: string;
  onChange: (f: File | null) => void;
}) {
  return (
    <Field label="Resume (optional — PDF or Word, max 5MB)" error={error}>
      <input
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        className="block w-full cursor-pointer rounded-lg border border-dashed border-navy-900/25 px-4 py-3 text-sm text-navy-900/70 file:mr-4 file:rounded-md file:border-0 file:bg-navy-900 file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:text-white hover:border-lime-500"
      />
      {resume && (
        <span className="mt-1.5 block text-sm text-navy-900/70">
          Attached: <strong>{resume.name}</strong> (
          {(resume.size / 1024 / 1024).toFixed(1)}MB)
        </span>
      )}
    </Field>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 px-4 py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-sm font-semibold text-navy-900/60">{label}</dt>
      <dd className="text-sm break-words text-navy-900">{value || "—"}</dd>
    </div>
  );
}
