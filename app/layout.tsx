import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Body from "@/Components/Body";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Myoption",
  description: "Myoption page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>

        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.2/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >

        <Body>{children}</Body>
      </body>
    </html>
  );
}
