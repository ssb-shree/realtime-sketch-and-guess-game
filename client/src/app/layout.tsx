import type { Metadata } from "next";
import { Audiowide } from "next/font/google";
import "./globals.css";

const font = Audiowide({
  subsets : ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Scroble.io",
  description: "Made for fun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${font.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
