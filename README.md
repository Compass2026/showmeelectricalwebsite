# Show Me Electrical — Careers Site

Standalone careers page for [showmeelectrical.com](https://showmeelectrical.com), built with Next.js (App Router), TypeScript, and Tailwind CSS v4. Deployed to Vercel at **careers.showmeelectrical.com** and designed to feel like a seamless (but more polished) extension of the WordPress site.

## Environment variables

Set these in Vercel → Project → Settings → Environment Variables:

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | **Yes** | — | Resend API key used by `/api/apply` to send application emails. Server-side only — never exposed to the client. |
| `RESEND_FROM` | No | `applications@send.compassmarketing.ai` | The verified "from" address. Switch to a verified `showmeelectrical.com` sender later without touching code. |
| `APPLICATION_RECIPIENT` | No | `info@showmeelectrical.com` | Where applications are delivered. Reply-to is always set to the applicant's email. |

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (runs the logo download prebuild step)
```

Create a `.env.local` with `RESEND_API_KEY=re_...` to test the application form end-to-end.

## Brand notes

- **Colors** live in one place: the `@theme` block in `app/globals.css`. The build environment for the initial scaffold could not reach the live site's CSS, so the navy (`--color-navy-900: #0a1b33`) and lime (`--color-lime-500: #a6ce39`) values are close matches to the brand — verify them against **WP Admin → Elementor → Site Settings → Global Colors** and adjust the two tokens if needed. Every color on the page derives from them.
- **Logo**: `scripts/download-logo.mjs` runs automatically before every build (`prebuild`) and downloads the white logo from the WordPress media library into `public/logo-white.png` (skipped if the file already exists). On Vercel this succeeds on the first deploy. To pin it permanently, download it once and commit it:
  ```bash
  curl -o public/logo-white.png https://showmeelectrical.com/wp-content/uploads/2024/08/Show-me-electric-white-logo-4.png
  ```
  If the file is ever missing, the header/footer fall back to a styled text wordmark.
- **Fonts**: Poppins (headings) + Inter (body) via `next/font` — self-hosted at build time, zero layout shift.

## Architecture

- `app/page.tsx` — fully static home page: hero (animated SVG circuit motif), "Why Show Me Electrical" cards, Apprentice → Journeyman → Master timeline, job cards, and the multi-step application form.
- `app/jobs/[slug]/page.tsx` — statically generated detail page per role with `JobPosting` JSON-LD structured data (Google Jobs eligible).
- `app/api/apply/route.ts` — validates the submission (honeypot + per-IP rate limiting + field validation), formats an HTML email, base64-encodes the optional resume (PDF/DOC/DOCX, max 5MB), and sends via the Resend API with `reply_to` set to the applicant.
- `lib/jobs.ts` — single source of truth for role content, contact info, and structured data.
- All sections are server-rendered/static; client JS is limited to the header menu, scroll reveals, and the form.

## Deploying to Vercel

1. Import the repo in Vercel; framework preset **Next.js** (no custom config needed — there is intentionally no `vercel.json`).
2. Add the environment variables above.
3. Assign the domain `careers.showmeelectrical.com` and add the matching CNAME in DNS.
4. Point the WordPress site's "Career" nav item at `https://careers.showmeelectrical.com`.
