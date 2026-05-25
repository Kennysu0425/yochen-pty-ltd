import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yochen Pty Ltd",
  description:
    "Yochen Pty Ltd — an Australian private company.",
  metadataBase: new URL("https://yochen.com.au"),
  openGraph: {
    title: "Yochen Pty Ltd",
    description: "Yochen Pty Ltd — an Australian private company.",
    url: "https://yochen.com.au",
    siteName: "Yochen Pty Ltd",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
