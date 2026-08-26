import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getJob } from "@/lib/jobs";

export const runtime = "nodejs";

/** Verified Resend sending domain. Override with RESEND_FROM. */
const FROM = "Show Me Electrical Careers <careers@send.compassmarketing.ai>";
/** Override with APPLICATION_RECIPIENT (comma-separated for multiple). */
const TO = ["info@showmeelectrical.com", "thomas@compassmarketing.ai"];

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const RESUME_TYPES: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
};

/* ---------- Simple in-memory rate limit (per serverless instance) ---------- */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Keep the map from growing unbounded on a long-lived instance.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

/* ---------- Helpers ---------- */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function field(form: FormData, name: string, maxLen = 200): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim().slice(0, maxLen) : "";
}

function row(label: string, value: string): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:10px 16px;border-bottom:1px solid #e6e9ef;font-weight:600;color:#0a1b33;white-space:nowrap;vertical-align:top;">${esc(label)}</td>
    <td style="padding:10px 16px;border-bottom:1px solid #e6e9ef;color:#33415c;">${esc(value).replace(/\n/g, "<br/>")}</td>
  </tr>`;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[apply] RESEND_API_KEY is not configured");
    return NextResponse.json(
      { error: "Application service is not configured. Please call us at 314-571-9756." },
      { status: 500 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  // Honeypot: real users never fill this. Pretend success for bots.
  if (field(form, "company")) {
    return NextResponse.json({ ok: true });
  }

  const firstName = field(form, "firstName", 100);
  const lastName = field(form, "lastName", 100);
  const email = field(form, "email", 200);
  const phone = field(form, "phone", 30);
  const roleSlug = field(form, "role", 60);
  const job = getJob(roleSlug);

  if (!firstName || !lastName || !job) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address." },
      { status: 400 }
    );
  }
  if (phone.replace(/\D/g, "").length !== 10) {
    return NextResponse.json(
      { error: "Invalid phone number." },
      { status: 400 }
    );
  }

  /* ---------- Role-specific fields ---------- */
  const roleRows: string[] = [];
  if (roleSlug === "apprentice-electrician") {
    roleRows.push(
      row("18 or older", field(form, "over18")),
      row("HS Diploma / GED", field(form, "diploma")),
      row("Driver's license & reliable transportation", field(form, "licenseTransport")),
      row("Why they want to become an electrician", field(form, "whyElectrician", 3000))
    );
  } else if (roleSlug === "journeyman-electrician") {
    roleRows.push(
      row("License status", field(form, "licenseStatus")),
      row("Years of experience", field(form, "yearsExperience", 10)),
      row("Owns personal tools", field(form, "ownTools")),
      row("Experience summary", field(form, "experienceSummary", 3000))
    );
  } else {
    roleRows.push(
      row("Years of admin/office experience", field(form, "yearsExperience", 10)),
      row("Contractor-office experience", field(form, "contractorOffice")),
      row("Software familiarity", field(form, "software", 500)),
      row("Background summary", field(form, "adminSummary", 3000))
    );
  }

  /* ---------- Optional resume attachment ---------- */
  const attachments: { filename: string; content: string }[] = [];
  const resume = form.get("resume");
  if (resume instanceof File && resume.size > 0) {
    if (resume.size > MAX_RESUME_BYTES) {
      return NextResponse.json(
        { error: "Resume is too large (max 5MB)." },
        { status: 400 }
      );
    }
    if (!RESUME_TYPES[resume.type]) {
      return NextResponse.json(
        { error: "Resume must be a PDF or Word document." },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await resume.arrayBuffer());
    const safeName =
      resume.name.replace(/[^\w.\- ]/g, "_").slice(0, 100) ||
      `resume${RESUME_TYPES[resume.type]}`;
    attachments.push({ filename: safeName, content: buffer.toString("base64") });
  }

  /* ---------- Compose email ---------- */
  const fullName = `${firstName} ${lastName}`;
  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:640px;margin:0 auto;padding:24px 16px;">
      <div style="background:#0a1b33;border-radius:12px 12px 0 0;padding:24px 28px;">
        <p style="margin:0;color:#c0d634;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">New Job Application</p>
        <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;">${esc(job.title)} — ${esc(fullName)}</h1>
      </div>
      <div style="background:#ffffff;border-radius:0 0 12px 12px;padding:8px 12px 20px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${row("Name", fullName)}
          ${row("Email", email)}
          ${row("Phone", phone)}
          ${row("Role", job.title)}
          ${roleRows.join("")}
          ${row("Resume", attachments.length ? attachments[0].filename : "Not attached")}
        </table>
        <p style="margin:20px 16px 0;font-size:12px;color:#8a94a6;">
          Submitted via careers.showmeelectrical.com · Reply directly to this email to contact the applicant.
        </p>
      </div>
    </div>
  </body>
</html>`;

  const recipients = process.env.APPLICATION_RECIPIENT
    ? process.env.APPLICATION_RECIPIENT.split(",").map((a) => a.trim()).filter(Boolean)
    : TO;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM ?? FROM,
      to: recipients,
      replyTo: email,
      subject: `New Job Application — ${job.title} — ${fullName}`,
      html,
      ...(attachments.length ? { attachments } : {}),
    });

    if (error) {
      console.error("[apply] Resend send failed:", error);
      return NextResponse.json(
        { error: "We couldn't send your application. Please try again or call 314-571-9756." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[apply] Resend threw:", err);
    return NextResponse.json(
      { error: "We couldn't send your application. Please try again or call 314-571-9756." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
