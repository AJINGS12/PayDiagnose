import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayDiagnose",
  description:
    "Debug payment webhooks in seconds, not hours — an AI agent that diagnoses integration failures and hands you the fix.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.onerror = function(msg, url, line, col, error) {
                alert(
                  "Message: " + msg +
                  "\\nFile: " + url +
                  "\\nLine: " + line +
                  "\\nColumn: " + col +
                  "\\nStack: " + (error && error.stack)
                );
              };

              window.addEventListener("unhandledrejection", function(e) {
                alert("Promise Error: " + (e.reason?.stack || e.reason));
              });
            `,
          }}
        />
      </body>
    </html>
  );
}