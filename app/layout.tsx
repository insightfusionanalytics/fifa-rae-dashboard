import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "FIFA Player Analysis — Insight Fusion Analytics",
  description:
    "Interactive analysis of 56,880 FIFA players across 190 countries and 44 leagues. Relative Age Effect, Height Analysis, and Player Profiles.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
