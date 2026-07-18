# PayDiagnose

**Debug payment webhooks in seconds, not hours — an AI agent that diagnoses integration failures and hands you the fix.**

Built for the OpenAI Codex Build Week (Developer Tools track) using **Codex CLI + GPT-5.6**.

## What it does

PayDiagnose takes a webhook payload, error log, or failed request and diagnoses the root cause of payment integration failures — authentication mismatches, signature verification errors, timeout/retry misconfiguration, DNS/routing issues, environment variable misconfiguration, and malformed payloads. Instead of manually cross-referencing provider docs, developers get a plain-English diagnosis and a corrected code snippet in seconds.

It's provider-agnostic — tested and working across Nomba, Stripe, and generic payment error formats — because the underlying failure patterns (bad signatures, missing env vars, timeout misconfig) are the same regardless of which payment API you're integrating.

If the evidence in a pasted error is ambiguous or incomplete, PayDiagnose won't force a guess. It flags the case as unclear, explains exactly what information is missing, and suggests a diagnostic logging step instead of inventing a fix — because a wrong confident answer is worse than an honest "I need more information."

This was inspired directly by real integration bugs hit while building **Shapay** (merchant payment infrastructure) for the Nomba Hackathon 2026 — 403 errors, DNS failures, environment variable misconfiguration, and webhook routing bugs that ate hours of debugging time. None of these were exotic problems; they were the same handful of failure patterns that trip up developers integrating any payment provider.

## Live demo

- **App:** https://pay-diagnose.vercel.app/
- **Demo video:** [add YouTube link]
- **No login required** — paste an error/payload and get a diagnosis immediately. Nothing pasted is stored.

## Tech stack

- Next.js 16 (App Router) + Tailwind CSS
- OpenAI API (GPT-5.6) for diagnosis reasoning
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

Codex CLI (GPT-5.6, Terra model, High reasoning) was used to harden the diagnosis engine after the initial build. Specifically, in a dedicated session, Codex:

- Reviewed `app/api/diagnose/route.ts` and added input length validation (rejects pastes over 6,000 characters with a clear error, before wasting an API call)
- Added targeted handling for OpenAI's 429 rate-limit errors, returning a friendly "please wait and retry" message instead of a generic failure — after checking the OpenAI SDK's type definitions to implement this correctly rather than guessing
- Identified and fixed a type-safety issue (`catch (err: any)` → `catch (err: unknown)`), the more correct TypeScript pattern, and re-ran lint to confirm the fix was clean
- Recommended an explicit ambiguity-handling rule for the system prompt: when an error is vague or incomplete, the agent should return "unknown" with low confidence and state what's missing, rather than confidently guessing the wrong category. This was reviewed and manually applied to the prompt, then tested against a deliberately vague input to confirm it worked as intended.

**Where I made the key decisions:** I scoped the diagnosis engine to 6 failure categories based on real bugs I hit building Shapay, rather than attempting exhaustive coverage — Codex implemented and hardened whatever categories I defined. I also chose the product's core design principle (never force a confident guess on ambiguous input) and directed Codex to implement it as a specific rule, rather than letting the model decide that behavior on its own.

**How GPT-5.6 specifically contributed to the final result:** GPT-5.6 isn't just a build-time tool here — it's the engine the product runs on. Every diagnosis a user gets is a live GPT-5.6 API call at request time, reasoning over the pasted error against the defined failure categories.

**Codex Session ID:** `019f74c1-49f6-7bd2-90c5-2716c8978ed3`

## Failure categories detected

1. Authentication / 403 errors
2. Signature verification mismatches
3. Timeout / retry misconfiguration
4. DNS / routing failures
5. Environment variable misconfiguration
6. Malformed payload structure
7. Unclear / insufficient evidence (flags what's missing instead of guessing)

## Challenges faced

Scoping the diagnosis engine was the main challenge — payment webhook failures span dozens of edge cases, and trying to cover all of them in a short build window would have diluted quality. I prioritized depth over breadth, focusing on failure categories I'd genuinely hit building Shapay, and deliberately built in a safeguard against confident-but-wrong guesses on ambiguous input, since a debugging tool that's occasionally confidently wrong is worse than one that's honest about uncertainty.

## What I learned

Building PayDiagnose reinforced how much developer pain in payment integrations comes from a small set of recurring, well-understood failure modes — the issue isn't complexity, it's diagnosis speed. Working with Codex on the hardening pass also showed the value of having it check actual library type definitions before implementing error handling, rather than assuming an API's error shape.

## What's next

Expand failure-pattern coverage to more providers (Paystack, Flutterwave), add a lightweight "test mode" that can send a mock webhook to a local dev server to reproduce an error live, and add persistent history so developers can revisit past diagnoses.