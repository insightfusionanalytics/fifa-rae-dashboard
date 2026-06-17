"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGES = [
  { label: "Overview", href: "/" },
  { label: "Relative Age Effect", href: "/rae" },
  { label: "Height Analysis", href: "/height" },
  { label: "Player Profile", href: "/profile" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/"
            className="text-white font-semibold text-sm sm:text-base hover:text-blue-200 transition-colors"
          >
            FIFA Player Analysis
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {PAGES.map((page) => {
              const isActive =
                page.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(page.href);
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className={`text-sm px-3 py-1.5 rounded transition-colors ${
                    isActive
                      ? "bg-white/15 text-white font-medium"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {page.label}
                </Link>
              );
            })}
          </div>
          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-1">
            {PAGES.filter((p) => p.href !== "/").map((page) => {
              const isActive = pathname.startsWith(page.href);
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {page.label.split(" ")[0]}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
