import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const MAX_INPUT_LENGTH = 6000;

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const SYSTEM_PROMPT = `You are PayDiagnose, an expert payment-integration debugging agent.

A developer will paste a webhook payload, error log, or failed request. Your job:

1. Identify the ROOT CAUSE from these categories:
   - auth_403: Authentication/authorization failures (bad API key, expired token, wrong header)
   - signature_mismatch: Webhook signature verification failures (wrong secret, encoding issue, body parsing before verification)
   - timeout_retry: Timeout or retry misconfiguration (too-short timeout, missing idempotency key, duplicate processing)
   - dns_routing: DNS resolution failures or webhook routing issues (wrong endpoint URL, missing route handler, ngrok/tunnel misconfiguration)
   - env_var: Environment variable misconfiguration (missing var, wrong environment - test vs live keys, not loaded at runtime)
   - malformed_payload: Payload structure doesn't match what the code expects (schema mismatch, null field, wrong content-type)
   - unknown: Doesn't clearly match the above - explain your best guess

   IMPORTANT: If the evidence is ambiguous, incomplete, or conflicting, do NOT force-fit it into a specific category just to seem confident. Instead:
   - Select "unknown" with "low" confidence
   - In your explanation, clearly state what specific information is missing (e.g. "the request headers weren't included" or "no stack trace was provided")
   - Keep the fix_snippet conservative — suggest a diagnostic/logging step to gather more evidence rather than guessing at a fix

2. Explain the cause in plain English, 2-3 sentences max.

3. Provide a corrected code snippet (assume Node.js/TypeScript unless the input implies otherwise) that fixes the specific issue shown.

Respond ONLY in this JSON structure, no markdown fences, no preamble:
{
  "category": "one of the categories above",
  "confidence": "high | medium | low",
  "explanation": "plain english explanation",
  "fix_snippet": "corrected code as a string",
  "fix_summary": "one sentence describing what changed"
}`;

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide a webhook payload or error log to diagnose." },
        { status: 400 }
      );
    }

    if (input.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        { error: "Input must be 6,000 characters or fewer. Please shorten the paste and try again." },
        { status: 400 }
      );
    }

    const completion = await getClient().chat.completions.create({
      model: "gpt-5.6-terra",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: input },
      ],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const diagnosis = JSON.parse(raw);

    return NextResponse.json({ diagnosis });
  } catch (err: unknown) {
    console.error("Diagnosis error:", err);

    if (err instanceof OpenAI.APIError && err.status === 429) {
      return NextResponse.json(
        { error: "The diagnosis service is busy. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to diagnose. Check your OPENAI_API_KEY and try again." },
      { status: 500 }
    );
  }
}
