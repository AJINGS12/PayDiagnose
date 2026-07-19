export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[var(--base)]">
      <header className="border-b border-[var(--line)] bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <a href="/diagnose" className="flex items-center">
            <img src="/paydiagnose_logo_dark.png" alt="PayDiagnose" className="h-9 sm:h-11" />
          </a>
          <a href="/diagnose" className="text-xs sm:text-sm text-[var(--ink-soft)] hover:text-[var(--accent)] transition-colors font-medium">
            ← Back to app
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--ink)] mb-3">
          How PayDiagnose works
        </h1>
        <p className="text-sm sm:text-base text-[var(--ink-soft)] leading-relaxed mb-8 sm:mb-10 max-w-xl">
          Built for developers integrating payment providers like Nomba,
          Stripe, and Paystack — anyone debugging a failed webhook or payment
          call without wanting to dig through provider docs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 sm:mb-14">
          {[
            { step: "01", title: "Paste", desc: "Drop in your webhook error, payload, or stack trace." },
            { step: "02", title: "Diagnose", desc: "GPT-5.6 matches it against known failure patterns." },
            { step: "03", title: "Fix", desc: "Get a plain-English cause and a ready-to-use code fix." },
          ].map((item) => (
            <div key={item.step} className="bg-white border border-[var(--line)] rounded-lg p-4 sm:p-5">
              <span className="font-mono text-xs text-[var(--accent)] font-semibold">
                {item.step}
              </span>
              <h3 className="font-semibold text-sm text-[var(--ink)] mt-1 mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <h2 className="text-base sm:text-lg font-semibold font-heading text-[var(--ink)] mb-3">
          What it catches
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 sm:mb-14">
          {[
            "Auth / 403 errors",
            "Signature verification mismatches",
            "Timeout / retry misconfiguration",
            "DNS / routing failures",
            "Environment variable misconfiguration",
            "Malformed payload structure",
          ].map((cat) => (
            <div key={cat} className="flex items-center gap-2 text-sm text-[var(--ink-soft)] bg-white border border-[var(--line)] rounded-md px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
              {cat}
            </div>
          ))}
        </div>

        <h2 className="text-base sm:text-lg font-semibold font-heading text-[var(--ink)] mb-3">
          Who it's for
        </h2>
        <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-10 sm:mb-14 max-w-xl">
          Backend and full-stack developers integrating any payment
          provider's API or webhooks — whether you're debugging a live
          production incident or setting up an integration for the first
          time. No login, no setup. Nothing you paste is stored.
        </p>

        <a href="/diagnose" className="inline-block w-full sm:w-auto text-center bg-[var(--ink)] hover:bg-[var(--accent)] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
          Try it now →
        </a>
      </main>
    </div>
  );
}