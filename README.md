# PayDiagnose

**Debug payment webhooks in seconds, not hours — an AI agent that diagnoses integration failures and hands you the fix.**

Built for the OpenAI Codex Build Week (Developer Tools track) using **Codex CLI + GPT-5.6**.

## What it does

PayDiagnose takes a webhook payload, error log, or failed request and diagnoses the root cause of payment integration failures — authentication mismatches, signature verification errors, timeout/retry misconfiguration, DNS/routing issues, and malformed payloads. Instead of manually cross-referencing provider docs, developers get a plain-English diagnosis and a corrected code snippet in seconds.

This was inspired directly by real integration bugs hit while building **Shapay** (merchant payment infrastructure) for the Nomba Hackathon 2026 — 403 errors, DNS failures, env var misconfiguration, and webhook routing bugs that ate hours of debugging time.

## Live demo

- **App:** [add Vercel URL once deployed]
- **Demo video:** [add YouTube link, ≤3 min]
- **No login required** — paste an error/payload and get a diagnosis immediately.

## Tech stack

- Next.js 14 (App Router) + Tailwind CSS
- OpenAI API (GPT-5.6) for diagnosis reasoning
- Deployed on Vercel

## How to run locally

```bash
git clone [your-repo-url]
cd paydiagnose
npm install
cp .env.example .env.local
# add your OPENAI_API_KEY to .env.local
npm run dev
```

Open http://localhost:3000

## How Codex was used

*(Fill this in as you build — required for judging. Be specific.)*

- **Where Codex accelerated the workflow:** [e.g. "Codex scaffolded the Next.js API route and generated the initial failure-classification prompt in under 10 minutes, which normally would've taken 30+."]
- **Key decisions made by me, not Codex:** [e.g. "I chose to scope the engine to 5 failure categories instead of attempting exhaustive coverage, based on the real bugs I hit on Shapay — Codex generated code for whatever categories I defined."]
- **How GPT-5.6 specifically contributed to the final result:** [e.g. "GPT-5.6 powers the actual diagnosis reasoning at runtime — reading the pasted error/payload and matching it to failure patterns — this is the core product, not just a build-time tool."]
- **Codex Session ID:** [paste the session ID from the thread where core functionality was built]

## Failure categories detected

1. Authentication / 403 errors
2. Signature verification mismatches
3. Timeout / retry misconfiguration
4. DNS / routing failures
5. Environment variable misconfiguration
6. Malformed payload structure

## Challenges faced

[Fill in during/after build — be honest, this is scored.]

## What's next

[Optional — judges like seeing forward vision, e.g. "expand to Stripe/Paystack failure signatures, add a browser extension that catches errors live."]
