"use client";

import { useState } from "react";

type Category = "auth_403" | "signature_mismatch" | "timeout_retry" | "dns_routing" | "env_var" | "malformed_payload" | "unknown";

type CategoryMeta = { label: string; color: string; bg: string; border: string };

const CATEGORY_META: Record<Category, CategoryMeta> = {
  auth_403: { label: "Auth / 403", color: "#B45309", bg: "#FFFBEB", border: "#F59E0B" },
  signature_mismatch: { label: "Signature Mismatch", color: "#4338CA", bg: "#EEF2FF", border: "#6366F1" },
  timeout_retry: { label: "Timeout / Retry", color: "#C2410C", bg: "#FFF7ED", border: "#F97316" },
  dns_routing: { label: "DNS / Routing", color: "#0E7490", bg: "#ECFEFF", border: "#06B6D4" },
  env_var: { label: "Env Var Misconfig", color: "#7E22CE", bg: "#FAF5FF", border: "#A855F7" },
  malformed_payload: { label: "Malformed Payload", color: "#BE123C", bg: "#FFF1F2", border: "#F43F5E" },
  unknown: { label: "Unclear — Best Guess", color: "#475569", bg: "#F8FAFC", border: "#94A3B8" },
};

const EXAMPLES = [
  {
    label: "Signature mismatch",
    value: `POST /webhook/nomba\nResponse: 403 Forbidden\n{"error": "Invalid signature", "message": "Webhook signature verification failed"}\n\nRequest headers included:\nx-nomba-signature: abc123...\nContent-Type: application/json`,
  },
  {
    label: "Auth 403",
    value: `Error: Request failed with status code 403\n{\n  "status": "error",\n  "code": "unauthorized",\n  "message": "Invalid or expired API key"\n}`,
  },
  {
    label: "Timeout",
    value: `Error: ETIMEDOUT\nRequest to https://api.provider.com/v1/charge timed out after 3000ms\nNo retry or idempotency key was set on the original request.`,
  },
];

type Diagnosis = {
  category: Category;
  confidence: "high" | "medium" | "low";
  explanation: string;
  fix_snippet: string;
  fix_summary: string;
};

const CONFIDENCE_LEVELS = { high: 3, medium: 2, low: 1 };

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleDiagnose(overrideInput?: string) {
    const payload = overrideInput ?? input;
    if (!payload.trim()) return;

    setLoading(true);
    setError("");
    setDiagnosis(null);
    setCopied(false);

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setDiagnosis(data.diagnosis);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!diagnosis) return;
    navigator.clipboard.writeText(diagnosis.fix_snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const meta = diagnosis ? CATEGORY_META[diagnosis.category] ?? CATEGORY_META.unknown : null;

  return (
    <div className="min-h-screen bg-[var(--base)]">
      <header className="border-b border-[var(--line)] bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/paydiagnose_logo_dark.png" alt="PayDiagnose" className="h-11 sm:h-13" />
          </div>
          <a href="/how-it-works" className="text-xs sm:text-sm text-[var(--ink-soft)] hover:text-[var(--accent)] transition-colors font-medium">
            How it works
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[var(--accent)] bg-[var(--accent-soft)] px-2.5 py-1 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            Powered by GPT-5.6
          </div>
          <h1 className="text-[1.65rem] sm:text-[2.15rem] leading-tight font-bold tracking-tight text-[var(--ink)] font-heading">
            Debug payment webhooks
            <br />
            <span className="text-[var(--accent)]">in seconds, not hours.</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[var(--ink-soft)] max-w-lg leading-relaxed">
            Paste a webhook error, payload, or stack trace. Get the root cause
            and a working fix — no docs, no guessing.
          </p>
        </div>

        <div className="bg-white border-2 border-dashed border-[var(--line)] rounded-xl shadow-sm p-4 sm:p-5 hover:border-[var(--accent)]/40 transition-colors">
          <div className="flex items-center gap-2 mb-3 text-xs font-medium text-[var(--ink-faint)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Paste your error here
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your webhook error, payload, or stack trace here..."
            rows={8}
            className="w-full resize-none bg-transparent font-mono text-[13px] leading-relaxed text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none"
          />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3 pt-3 border-t border-[var(--line)]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-[var(--ink-faint)] mr-1">Try:</span>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => setInput(ex.value)}
                  className="text-xs px-2.5 py-1 rounded-full border border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                >
                  {ex.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleDiagnose()}
              disabled={loading || !input.trim()}
              className="shrink-0 w-full sm:w-auto bg-[var(--ink)] hover:bg-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 sm:py-2 rounded-lg transition-colors"
            >
              {loading ? "Diagnosing…" : "Diagnose"}
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-rose-600 font-medium">{error}</p>
        )}

        {loading && (
          <div className="mt-6 rounded-xl border border-[var(--line)] bg-white p-5 sm:p-6 rise-in">
            <div className="flex items-center gap-2 text-sm text-[var(--ink-faint)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              Reading the error and matching known failure patterns…
            </div>
          </div>
        )}

        {diagnosis && meta && (
          <div className="mt-6 rounded-xl border bg-white shadow-sm overflow-hidden rise-in" style={{ borderColor: "var(--line)" }}>
            <div className="flex" style={{ borderLeft: `4px solid ${meta.border}` }}>
              <div className="flex-1 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <span
                    className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md"
                    style={{ color: meta.color, backgroundColor: meta.bg }}
                  >
                    {meta.label.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[var(--ink-faint)] font-medium">
                      Confidence
                    </span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              i <= CONFIDENCE_LEVELS[diagnosis.confidence]
                                ? meta.border
                                : "var(--line)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-[15px] text-[var(--ink)] leading-relaxed mb-1">
                  {diagnosis.explanation}
                </p>
                <p className="text-sm text-[var(--ink-soft)] mb-4">
                  <span className="font-medium text-[var(--ink)]">Fix: </span>
                  {diagnosis.fix_summary}
                </p>

                <div className="relative rounded-lg overflow-hidden border border-[var(--line)]">
                  <div className="flex items-center justify-between bg-[var(--base)] px-3 py-1.5 border-b border-[var(--line)]">
                    <span className="text-xs font-mono text-[var(--ink-faint)]">
                      suggested fix
                    </span>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-xs font-medium text-[var(--ink-soft)] hover:text-[var(--accent)] transition-colors"
                    >
                      {copied ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-[#0F172A] text-slate-100 p-3 sm:p-4 overflow-x-auto text-xs sm:text-[13px] leading-relaxed">
                    <code className="font-mono">{diagnosis.fix_snippet}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {!diagnosis && !loading && !error && (
          <p className="mt-6 text-sm text-[var(--ink-faint)]">
            No login needed. Nothing you paste is stored — it's sent straight to GPT-5.6 for diagnosis.
          </p>
        )}
      </main>
    </div>
  );
}