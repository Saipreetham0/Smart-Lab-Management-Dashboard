import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Lab Monitor",
  description: "Real-time energy monitoring system for Smart Lab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
