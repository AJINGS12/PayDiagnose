# PayDiagnose

Debug payment webhooks in seconds, not hours — an AI agent that diagnoses integration failures and hands you the fix.

Built for the OpenAI Codex Build Week (Developer Tools track) using Codex CLI and GPT-5.6.

## Inspiration

I was building a merchant payment platform and kept running into the same problem, an error would come back from a webhook, and there was no clear signal for what actually went wrong. After hitting the same handful of failure patterns over and over, I realized the real gap wasn't documentation, it was diagnosis speed and that a reasoning model, one that could actually work through *why* an error happened instead of just matching keywords, was the right tool for that. That's what PayDiagnose is built for.

## What it does

PayDiagnose takes a webhook payload, error log, or failed request and diagnoses the root cause of a payment integration failure — authentication issues, signature verification errors, timeout/retry misconfiguration, DNS/routing problems, environment variable mistakes, or malformed payloads. It returns a plain-English explanation and a working code fix.

It's provider-agnostic. It's been tested against Nomba, Stripe, and Paystack error formats, since the underlying failure patterns are largely the same regardless of which payment API is involved.

If an error is ambiguous or incomplete, the tool doesn't guess. It returns a low-confidence "unclear" result, states what information is missing, and suggests a diagnostic step instead of inventing a fix.

## Live demo

- App: https://pay-diagnose.vercel.app/
- Demo video: https://youtu.be/8084XIQcHO4
- No login required. Nothing pasted into the tool is stored.

## Tech stack

- Next.js (App Router) + Tailwind CSS
- OpenAI API, GPT-5.6 Terra, for the live diagnosis reasoning
- Deployed on Vercel

## How to run locally

```bash
git clone https://github.com/AJINGS12/PayDiagnose.git
cd paydiagnose
npm install
cp .env.example .env.local
# add your OPENAI_API_KEY to .env.local
npm run dev
```

Open http://localhost:3000

## How Codex was used

Codex CLI (GPT-5.6 Terra, high reasoning) was used in a dedicated session to harden the diagnosis engine in `app/api/diagnose/route.ts` after the initial build. In that session, Codex:

- Added an input length guard that rejects pastes over 6,000 characters with a clear error, before the request reaches the OpenAI API
- Added handling for OpenAI's 429 rate-limit errors, returning a specific "please wait and retry" message instead of a generic failure — it checked the OpenAI SDK's type definitions first to implement this correctly rather than assuming the error shape
- Introduced a `catch (err: any)` during that work, caught it via the project's linter, and fixed it to `catch (err: unknown)`, then re-ran lint to confirm
- Suggested an explicit rule for the system prompt: on ambiguous input, return "unknown" with low confidence and state what's missing, rather than confidently guessing a category

That last suggestion was reviewed and applied to the system prompt directly, then tested against a deliberately vague input to confirm it worked as intended.

**Product decisions I made:** which six failure categories to scope the engine to, based on real bugs from building a payment integration myself, rather than attempting exhaustive coverage; and the rule that the tool should never return a confident answer on ambiguous input. Codex implemented and hardened the logic around those decisions.

**Where GPT-5.6 runs:** GPT-5.6 Terra is called live via the OpenAI API on every diagnosis request. It's the engine the product runs on at request time, not something used only during the build.

**Model note:** the diagnosis engine originally used the GPT-5.6 Sol model. During testing, an intermittent 401 "insufficient permissions" error surfaced on that tier — confirmed via Vercel runtime logs and cross-checked against other developers reporting the same issue on OpenAI's community forum, not a configuration problem on this end. The model was switched to GPT-5.6 Terra, which resolved it and has been stable since.

**Codex Session ID:** `019f74c1-49f6-7bd2-90c5-2716c8978ed3`

## Failure categories detected

1. Authentication / 403 errors
2. Signature verification mismatches
3. Timeout / retry misconfiguration
4. DNS / routing failures
5. Environment variable misconfiguration
6. Malformed payload structure
7. Unclear / insufficient evidence — flags what's missing instead of guessing

## Challenges faced

Scoping the diagnosis engine was the main challenge. Payment webhook failures span many edge cases, and covering all of them in a short build window would have diluted the quality of the tool, so the focus stayed on the categories most commonly hit in real integrations.

The 401 permissions issue on GPT-5.6 Sol, close to the deadline, was the other significant issue — resolved by diagnosing it through runtime logs rather than assuming it was a local configuration mistake, then switching model tiers.

## What I learned

Most of the real debugging pain in payment integrations comes from a small, recurring set of failure patterns rather than novel bugs — the bottleneck is diagnosis speed, not complexity. Working through the Codex session also reinforced checking a library's actual type definitions before writing error-handling code, instead of assuming the shape of an error.

## What's next

- Interactive follow-up on a diagnosis — letting a user reply directly to a result (e.g. "this didn't fix it, here's the new error" or "show me the fix in Python instead") instead of it being a single request/response
- Expanded provider coverage (Flutterwave, Razorpay, Square)
- Test mode — sending a mock webhook to a local dev server so a diagnosis can be reproduced and verified live
- Diagnosis history for revisiting past results during a debugging session
- Team/shared use — sharing a diagnosis link with a colleague