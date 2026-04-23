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
  metadataBase: new URL("https://nateholt.com"),
  title: {
    default: "Nathan Holt — Product Lead",
    template: "%s | Nathan Holt",
  },
  description:
    "Senior PM and Product Lead with 8+ years building platforms, internal tools, and AI-driven systems across healthtech, SaaS, and ecommerce. Ask me anything.",
  authors: [{ name: "Nathan Holt", url: "https://nateholt.com" }],
  keywords: [
    "Product Lead",
    "Senior Product Manager",
    "PM",
    "Head of Product",
    "AI product",
    "healthtech",
    "SaaS",
    "New York",
    "Nathan Holt",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://nateholt.com",
  },
  openGraph: {
    title: "Nathan Holt — Product Lead",
    description:
      "Eight years shipping product across healthtech, SaaS, and marketplaces. The portfolio that talks back.",
    url: "https://nateholt.com",
    siteName: "Nathan Holt",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/nathan-bw.png",
        width: 600,
        height: 750,
        alt: "Nathan Holt — Product Lead",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nathan Holt — Product Lead",
    description:
      "Eight years shipping product across healthtech, SaaS, and marketplaces. The portfolio that talks back.",
    images: ["/nathan-bw.png"],
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
