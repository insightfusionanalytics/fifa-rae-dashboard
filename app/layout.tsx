import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "FIFA Player Analysis — Relative Age Effect",
  description:
    "Interactive analysis of the Relative Age Effect across 56,880 FIFA players, 190 countries, and 44 leagues.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
