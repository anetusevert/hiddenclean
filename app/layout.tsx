import SubscribeForm from "@/components/SubscribeForm";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { Header } from "@/components/Header";
import { Social } from "@/components/Social";
import { SOCIAL } from "@/lib/videos";
import { pageAlternates } from "@/lib/seo";
import { SITE_DESC, SITE_NAME, SITE_URL } from "@/lib/tips";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-sans", display: "swap" });

export const viewport: Viewport = { themeColor: "#14325f", width: "device-width", initialScale: 1 };
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: { default: `${SITE_NAME}: one cleaning hack a day`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESC,
  alternates: pageAlternates("/"),
  openGraph: { siteName: SITE_NAME, type: "website", description: SITE_DESC, locale: "en_US", images: [{ url: "/og.webp", width: 1200, height: 630, alt: "HiddenClean: one cleaning hack a day" }] },
  twitter: { card: "summary_large_image", images: ["/og.webp"] },
};

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, inLanguage: "en", name: SITE_NAME, url: SITE_URL, description: SITE_DESC, publisher: { "@id": `${SITE_URL}/#org` } },
    { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/icons/icon-512.png`, email: "hello@hiddenclean.com", sameAs: [SOCIAL.tiktok, SOCIAL.instagram] },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <head><link rel="preconnect" href="https://cloudflareinsights.com" crossOrigin="anonymous" /><link rel="dns-prefetch" href="https://static.cloudflareinsights.com" /></head>
      <body>
        <JsonLd data={graph} />
        <Header />
        <main id="content">{children}</main>
        <footer className="site-footer">
          <div className="wrap foot">
            <div><b>HiddenClean</b><p>One cleaning hack a day — bathrooms, stains, floors and appliance secrets. Every tip has a safety check. Never mix cleaning products.</p><SubscribeForm compact /><Social /></div>
            <nav aria-label="Footer">
              <Link href="/tips">All tips</Link><Link href="/how-to">Browse</Link><Link href="/how-to/weekly-cleaning-checklist">Weekly checklist</Link><Link href="/how-to/clean-a-bathroom-in-15-minutes">15-min bathroom</Link><Link href="/how-to/deep-clean-a-kitchen-in-30-minutes">30-min kitchen</Link><Link href="/how-to/hidden-appliance-cleaning-settings">Hidden appliance buttons</Link><Link href="/about">About &amp; safety</Link>
              <Link href="/subscribe">Subscribe</Link><Link href="/llms.txt">llms.txt</Link><Link href="/sitemap.xml">Sitemap</Link>
            </nav>
          </div>
          <div className="wrap base">© {new Date().getFullYear()} HiddenClean</div>
        </footer>
        <Script
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "631017293332446989b37e184208d23d"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
