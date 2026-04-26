import type { Metadata } from "next";
import { Audiowide } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const font = Audiowide({
  subsets: ["latin"],
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
    <html data-theme="aqua" lang="en" className={`${font.className} h-full antialiased bg-base-300 shadow-xl `}>
      <body className="min-h-full flex flex-col">
        <Toaster position="bottom-left" />
        {children}
      </body>
    </html>
  );
}
