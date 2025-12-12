import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/context/Theme";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stack-snack.vercel.app"),
  generator: "Next.js",
  title: "Stack Snack",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Stack Snack",
    "programming questions",
    "developer Q&A",
    "web development",
    "JavaScript",
    "React",
    "Node.js",
    "algorithms",
    "data structures",
    "developer community",
  ],
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, algorithms, data structures and more.",
  icons: {
    icon: "/images/site-logo.svg",
    shortcut: "/favicon.ico", // browser address bar icon
    apple: "/apple-touch-icon.png", // Apple devices
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
  authors: [{ name: "Yasir Naseem", url: "https://yasircodes.com" }],
  creator: "Yasir Naseem",
  publisher: "Yasir Naseem",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Stack Snack | Ask & Answer Programming Questions",
    description:
      "Discover different programming questions and answers with recommendations from the community.",
    url: "https://stack-snack.vercel.app",
    siteName: "Stack Snack",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "Stack Snack OG Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  applicationName: "Stack Snack",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Optional: Theme color for browser UI and mobile experience
  themeColor: "#18181b",

  twitter: {
    card: "summary_large_image",
    title: "Dev Overflow | Home",
    description:
      "Discover different programming questions and answers with recommendations from the community.",
    images: ["/og/home.png"],
    creator: "@yasirnaseem5415",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body
        className={`${inter.className} ${spaceGrotesk.variable}  antialiased`}
      >
        <NextTopLoader color="#ff7000" showSpinner={false} />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster position="top-center" expand={false} richColors closeButton />
      </body>
    </html>
  );
}
