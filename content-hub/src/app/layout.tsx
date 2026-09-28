import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastNotifications";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nexus-content-hub.vercel.app"),
  title: {
    default: "Nexus - Governed B2B AI Content OS & Workspace",
    template: "%s | Nexus Content OS",
  },
  description: "Enterprise AI-powered content hub for planning, generating, brand-checking, and distributing multi-channel content at scale with sub-second Groq inference.",
  keywords: [
    "B2B SaaS",
    "AI Content Hub",
    "Content Governance",
    "Brand Kit AI",
    "Omnichannel Repurposing",
    "Groq LPUs",
    "Semantic Search RAG",
    "SEO Intelligence"
  ],
  authors: [{ name: "Nexus Team" }],
  openGraph: {
    title: "Nexus - Governed B2B AI Content OS & Workspace",
    description: "Enterprise AI-powered content hub for planning, generating, brand-checking, and distributing multi-channel content at scale.",
    url: "https://nexus-content-hub.vercel.app",
    siteName: "Nexus Content OS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus - Governed B2B AI Content OS & Workspace",
    description: "Enterprise AI-powered content hub with deterministic brand governance & multi-model orchestration.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${jakarta.variable} ${outfit.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-slate-900 bg-[#fafbfc] min-h-screen">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
