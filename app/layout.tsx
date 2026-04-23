import type { Metadata } from "next";
import { Newsreader, Inter, JetBrains_Mono } from "next/font/google";
import CalInit from "./components/CalInit";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-newsreader",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Nathan Holt — Product Lead",
  description:
    "Senior PM / Product Lead with 8+ years building platforms, internal tools, and AI-driven systems. Ask me anything.",
  openGraph: {
    title: "Nathan Holt — Product Lead",
    description:
      "Eight years shipping product across healthtech, SaaS, and marketplaces. The portfolio that talks back.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body suppressHydrationWarning>
        <CalInit />
        {children}
      </body>
    </html>
  );
}
