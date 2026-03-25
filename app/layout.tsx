import { Header } from "@/components/Header";
import "./globals.css";
import type { Metadata } from "next";
import { Big_Shoulders_Display, Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { BASE_ORIGIN } from "@/utilities/constants";
import { generateTags } from "@/utilities/metadata";
import Script from "next/script";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const display = Big_Shoulders_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const title = "Childtom";
const description =
  "Childtom is a software engineer. Building and shipping full-stack products with a focus on quality and real-world collaboration.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_ORIGIN),
  ...generateTags({
    url: "/",
    title,
    description,
  }),
  title: {
    template: `%s | ${title}`,
    default: title,
  },
};

function setTheme() {
  const theme = localStorage.getItem("theme");

  if (theme === "dark") {
    document.documentElement.dataset.theme = "dark";
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} bg-slate-950 h-full`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(${setTheme.toString()})()`,
          }}
        />
      </head>
      <body className="h-full text-slate-900 dark:text-slate-100">
        <Header className="text-slate-100 sticky top-0" />
        <Container className="min-h-[calc(100%-12rem)] sm:min-h-[calc(100%-11rem)] grid relative z-10 p-2 bg-slate-700 dark:bg-slate-900 shadow-2xl shadow-slate-950 rounded-[2rem]">
          {children}
        </Container>
        {/* Sticky footer on desktop only.
            On mobile it stays in normal flow to avoid overlapping the last Bento card.
            Extra top margin prevents the footer background from creeping upwards on some mobile browsers. */}
        <Footer className="text-slate-100 sm:sticky bottom-0" />
        <Script id="animate">
          {'document.documentElement.dataset.animate = "true";'}
        </Script>
      </body>
    </html>
  );
}
