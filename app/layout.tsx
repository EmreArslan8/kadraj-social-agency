import type { Metadata } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/PageTransition";

// Display + body face. The `wdth` axis lets us push headlines to an
// expanded ultra-bold cut while keeping normal-width body copy.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

// Serif italic used for accent words inside display headlines.
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KADRAJ — Sosyal Medya & Kreatif Ajans",
  description:
    "Strateji, içerik, tasarım ve 3D hareket. KADRAJ ile markanın sosyal medyadaki hikâyesini birlikte yazalım.",
  openGraph: {
    title: "KADRAJ — Sosyal Medya & Kreatif Ajans",
    description:
      "Sadece görünme. İz bırak. Sosyal medya, kreatif prodüksiyon ve dijital deneyimler.",
    type: "website",
    locale: "tr_TR",
    siteName: "KADRAJ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${archivo.variable} ${instrument.variable} antialiased`}
    >
      <body>
        <a className="skip-link" href="#main">İçeriğe geç</a>
        {children}
        <PageTransition />
        {/* Fixed film-grain overlay, non-interactive, above content */}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
