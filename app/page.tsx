"use client";

import { useState } from "react";

const CATEGORY_LABELS: Record<string, string> = {
  auth_403: "Auth / 403 Error",
  signature_mismatch: "Signature Mismatch",
  timeout_retry: "Timeout / Retry Issue",
  dns_routing: "DNS / Routing Issue",
  env_var: "Environment Variable Misconfig",
  malformed_payload: "Malformed Payload",
  unknown: "Unclear — Best Guess",
};

type Diagnosis = {
  category: string;
  confidence: string;
  explanation: string;
  fix_snippet: string;
  fix_summary: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [error, setError] = useState("");

  async function handleDiagnose() {
    setLoading(true);
    setError("");
    setDiagnosis(null);
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
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

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">PayDiagnose</h1>
        <p className="text-slate-400 mt-2">
          Paste a webhook payload or error log. Get the root cause and the fix.
        </p>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your webhook error, payload, or stack trace here..."
        rows={10}
        className="w-full rounded-lg bg-slate-900 border border-slate-800 p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
      />

      <button
        onClick={handleDiagnose}
        disabled={loading || !input.trim()}
        className="mt-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold px-6 py-3 rounded-lg transition"
      >
        {loading ? "Diagnosing..." : "Diagnose"}
      </button>

      {error && (
        <p className="mt-4 text-red-400 text-sm">{error}</p>
      )}

      {diagnosis && (
        <div className="mt-8 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs uppercase tracking-wide bg-amber-500/10 text-amber-400 px-2 py-1 rounded">
              {CATEGORY_LABELS[diagnosis.category] || diagnosis.category}
            </span>
            <span className="text-xs text-slate-500">
              Confidence: {diagnosis.confidence}
            </span>
          </div>
          <p className="text-slate-200 mb-4">{diagnosis.explanation}</p>
          <p className="text-sm text-slate-400 mb-2">{diagnosis.fix_summary}</p>
          <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto text-sm">
            <code>{diagnosis.fix_snippet}</code>
          </pre>
        </div>
      )}
    </main>
  );
}
