export default function Landing() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-6 text-center overflow-hidden"
      style={{ backgroundColor: "var(--navy)" }}
    >
      {/* liquid blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[420px] h-[420px] sm:w-[560px] sm:h-[560px] -top-24 -left-24 blob"
          style={{
            background: "radial-gradient(circle, rgba(47,94,255,0.55) 0%, rgba(47,94,255,0) 72%)",
            filter: "blur(30px)",
            animation: "drift-a 14s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] -bottom-32 -right-16 blob"
          style={{
            background: "radial-gradient(circle, rgba(99,140,255,0.4) 0%, rgba(99,140,255,0) 72%)",
            filter: "blur(30px)",
            animation: "drift-b 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] top-[30%] left-1/2 -translate-x-1/2"
          style={{
            background: "radial-gradient(circle, rgba(47,94,255,0.3) 0%, rgba(47,94,255,0) 70%)",
            filter: "blur(24px)",
            animation: "drift-c 16s ease-in-out infinite",
          }}
        />
      </div>

      <img
        src="/paydiagnose_logo_transparent.png"
        alt="PayDiagnose"
        className="relative w-[220px] sm:w-[320px] md:w-[380px] opacity-0"
        style={{ animation: "fade-up 0.8s ease-out 0.1s forwards" }}
      />

      <h1
        className="relative mt-8 sm:mt-10 text-2xl sm:text-4xl md:text-5xl font-heading font-extrabold text-white max-w-3xl leading-[1.15] opacity-0"
        style={{ animation: "fade-up 0.8s ease-out 0.6s forwards" }}
      >
        Stop guessing why your{" "}
        <span style={{ color: "#FBBF24" }}>payment integration</span>{" "}
        failed.
      </h1>

      <p
        className="relative mt-4 sm:mt-5 text-sm sm:text-lg text-slate-300 max-w-md sm:max-w-lg leading-relaxed opacity-0"
        style={{ animation: "fade-up 0.8s ease-out 0.95s forwards" }}
      >
        Paste the error. Get the root cause. Get the fix.
        <br className="hidden sm:block" />
        Powered by GPT-5.6.
      </p>

      <a
        href="/"
        className="relative mt-9 sm:mt-11 inline-flex items-center gap-2 text-white font-bold text-sm sm:text-base px-7 sm:px-9 py-3 sm:py-3.5 rounded-full hover:scale-[1.03] active:scale-[0.98] transition-transform opacity-0"
        style={{
          animation: "fade-up 0.8s ease-out 1.35s forwards",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow: "0 8px 32px rgba(47,94,255,0.35)",
        }}
      >
        Try it now
        <span aria-hidden>→</span>
      </a>

      <div
        className="relative mt-14 sm:mt-16 flex items-center gap-1.5 text-xs text-slate-400 opacity-0"
        style={{ animation: "fade-up 0.8s ease-out 1.6s forwards" }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "var(--accent)" }}
        />
        No login. Nothing you paste is stored.
      </div>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); border-radius: 42% 58% 65% 35% / 45% 40% 60% 55%; }
          33% { transform: translate(30px, 20px) scale(1.08); border-radius: 60% 40% 35% 65% / 55% 65% 35% 45%; }
          66% { transform: translate(-15px, 25px) scale(0.96); border-radius: 35% 65% 55% 45% / 40% 50% 50% 60%; }
        }
        @keyframes drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); border-radius: 55% 45% 40% 60% / 50% 55% 45% 50%; }
          40% { transform: translate(-25px, -20px) scale(1.1); border-radius: 40% 60% 55% 45% / 60% 40% 60% 40%; }
          70% { transform: translate(20px, -10px) scale(0.94); border-radius: 65% 35% 45% 55% / 45% 55% 45% 55%; }
        }
        @keyframes drift-c {
          0%, 100% { transform: translate(-50%, 0) scale(1); }
          50% { transform: translate(-50%, -18px) scale(1.15); }
        }
      `}</style>
    </div>
  );
}