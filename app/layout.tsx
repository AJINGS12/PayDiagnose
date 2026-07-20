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
      </body>
    </html>
  );
}