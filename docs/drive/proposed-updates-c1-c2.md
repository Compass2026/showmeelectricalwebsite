# Proposed Drive updates after the C1/C2 correction pass

Exact replacement text for the three current Drive originals. Each block
names the document and the sentence(s) it replaces. Nothing else in the
documents changes. Evidence commits: the C1/C2 commit, the C1 recovery commit and the C1
simplification commit on `claude/template-completion` recorded in the
review package (referred to below by those names).

## 01 Compass Website Build Standard v1.1

**§1, paragraph "Current implementation" — replace** the sentence
"Shared templates and brand separation are implemented; final approval is
conditional on the bounded form-retry and QA corrections recorded in the
companion audit." **with:**

> Shared templates and brand separation are implemented. The bounded
> form-retry (C1) and verification (C2) corrections from the companion
> audit are implemented at the C1/C2 commit and are ready for final review;
> final Foundation v1 approval is the reviewer's decision on that commit.

**§9 "Implemented" paragraph — replace** the two sentences beginning
"Review correction C1:" and "Review correction C2:" **with:**

> C1 (implemented): the submission id is the email provider's idempotency
> key (`Idempotency-Key`, 24-hour retention at the provider) on every send,
> and the provider is the only authority for acceptance, duplicates,
> conflicts and retries. There is no local record, lock or lease in front
> of it, so handler instances that share nothing still agree and nothing
> local can synthesise a success or block a retry. Payloads are built only
> from normalised input and configuration, so an unchanged retry is
> byte-identical. Outcomes are explicit: an unchanged retry receives the
> original accepted result with nothing sent again; the same id with
> different content answers 409 `submission_changed`; a retry while the
> first send is in flight answers 409 `in_progress`. The form binds the id
> to the message content (unchanged retry keeps it, an edited message gets
> a new one) and captures the form element before asynchronous work so
> server-reported validation errors focus the reported field. All delivery
> goes through one provider adapter; mocked delivery uses a mock provider
> service that applies the same key contract on the same call path. Mocked
> tests cover independent handlers under one key, concurrent requests,
> delivery accepted but response lost, changed content, stale or corrupt
> former local records, a fresh handler instance, edited content after an
> ambiguous failure, and server validation with input preservation and
> focus recovery.
>
> C2 (implemented): `scripts/qa/browser-launch.mjs` resolves Chromium from
> `CHROMIUM_PATH` (then the bundled or a system Chromium) for both browser
> suites and prints setup instructions when none exists; `npm run verify`
> runs the browser suite on representative pages for both brands and asserts
> each production guard's own error message; `FRESH=1 npm run verify` is
> the documented clean-checkout run.

**§12, final paragraph of "Emerging interfaces" — replace** "Inquiry retry
corrections remain open; careers agent testing, other agents and production
crawler access remain unverified." **with:**

> Inquiry retry corrections are implemented (C1) and the inquiry agent task
> was re-run on both brands with mocked delivery after the change; careers
> agent testing, other agents and production crawler access remain
> unverified.

**"Implementation review and bounded exceptions", first paragraph —
replace** "final reusable-release approval remains pending C1/C2 in the
audit." **with:**

> C1/C2 are implemented at the C1/C2 commit with focused mocked tests and a
> clean-checkout verification run; final reusable-release approval is the
> reviewer's decision on that commit.

## 02 Compass Page Template Library v1.1

**Opening paragraph — replace** "Final Foundation v1 approval is
conditional on the form-retry and QA corrections in the companion audit."
**with:**

> The form-retry and QA corrections (C1/C2) from the companion audit are
> implemented at the C1/C2 commit; final Foundation v1 approval is the
> reviewer's decision on that commit.

**§12 "Current status" — replace** "Inquiry labels, validation and
hydration safeguards are implemented; cross-instance duplicate processing
and server-error focus recovery require C1 in the audit." **with:**

> Inquiry labels, validation and hydration safeguards are implemented.
> Duplicate processing is guarded by a durable idempotency store plus the
> provider's idempotency key, with explicit duplicate / changed / in-progress
> outcomes; the form captures its element before asynchronous work so
> server-reported errors focus the right field (C1).

**§14 "Verification" paragraph — replace** "At the reviewed SHA,
forms.test.mjs hard-codes /opt/pw-browsers/chromium and verify.sh omits
browser.test.mjs; C2 must fix portability and command coverage before this
becomes the approved one-command recipe." **with:**

> Both browser suites resolve Chromium through `CHROMIUM_PATH` (see the
> README "Browser setup"); `npm run verify` includes `browser.test.mjs` for
> representative pages on both brands and asserts the production guards'
> own error messages; `FRESH=1 npm run verify` is the clean-checkout run
> (C2). This is the one-command recipe pending the reviewer's acceptance.

**§14, sentence "These capabilities are present, but the reviewer
identified C1/C2 corrections. Keep the starter labeled release candidate
until their focused tests pass and the resulting SHA is accepted." —
replace with:**

> These capabilities are present and the C1/C2 corrections are implemented
> with focused tests at the C1/C2 commit. Keep the starter labelled release
> candidate until the reviewer accepts that commit.

**§15, last sentence "Rerun affected inquiry tasks after C1;" — replace
with:**

> The inquiry tasks were re-run after C1 on both brands with mocked
> delivery (recorded in docs/agent-compatibility.md);

## 03 Compass Website Foundation v1: Review and Completion Brief

**Decision paragraph — append:**

> C1 and C2 were implemented at the C1/C2 commit and returned for final
> acceptance review with focused mocked test results, a clean-checkout
> verification run and re-run agent inquiry tasks. Status: ready for final
> review, not finally approved.

**§3 G8 "Current finding" — append:**

> Corrected in C2: `forms.test.mjs` and `browser.test.mjs` resolve Chromium
> through `scripts/qa/browser-launch.mjs` (`CHROMIUM_PATH` first);
> `verify.sh` runs `browser.test.mjs` for representative pages on both
> brands; each production-guard test asserts its own error message;
> `FRESH=1` is documented; the completion checklist no longer depends on
> the client launch.

**§3 G9 "Current evidence" — append:**

> Corrected in C1: the provider idempotency key is authoritative on every
> send (no local claim store), with explicit same-id/different-content and
> in-progress outcomes and a 24-hour retention window; form element
> captured before asynchronous work; mocked delivery exercises the
> provider-call path through a shared mock provider service. Mocked tests
> cover independent handlers, simultaneous requests, lost responses,
> changed content, stale former local records, a fresh handler instance,
> edited content and server validation; the inquiry agent task was re-run
> on both brands.

**§6 "Code status" — replace** "Final template release remains conditional
on C1/C2 and review of their focused results at the resulting SHA." **with:**

> C1/C2 are implemented at the C1/C2 commit; the C1 local-claim layer was
> removed at the C1 simplification commit, where the provider key is
> authoritative; final template release depends on the reviewer's
> acceptance of the focused results at that commit.

**"Current correction review: C1 cross-worker takeover race" — append
to the section:**

> Corrected at the C1 simplification commit: the custom filesystem
> claim/lease layer is removed from the inquiry delivery path. The route
> consults no local record; every send carries the submission id as the
> provider idempotency key and the provider's answer is the outcome
> (original accepted result on an unchanged retry, `submission_changed`
> for a different payload under a used key, `in_progress` while a send is
> in flight). Payloads are normalised and stable, submission ids remain
> content-bound, and form error recovery is unchanged. Delivery goes
> through one provider adapter; mocked delivery uses a shared mock provider
> service that applies the same contract, with no file lock anywhere.
> Acceptance tests: independent handlers with isolated state retry
> unchanged content under one key and receive the original accepted result
> with one send; concurrent same-key requests receive that result or an
> explicit in-progress outcome; changed content under a used key is
> rejected; a lost response is retried to the original result; stale,
> "done" and corrupt former local records neither block nor fake a send.
> Input preservation, focus recovery and edited-content/new-id checks
> pass. Status: ready for final review, not finally approved.

**§6 "Agent status" — replace** "Inquiry-action correctness remains open
under C1." **with:**

> Inquiry-action correctness was corrected under C1 and re-trialled with
> mocked delivery; acceptance is the reviewer's decision.
