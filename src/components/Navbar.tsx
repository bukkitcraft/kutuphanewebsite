"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { id: number; label: string; href: string };

const FALLBACK: NavItem[] = [
  { id: -1, label: "Anasayfa", href: "/" },
  { id: -2, label: "İçerikler", href: "/icerikler" },
  { id: -3, label: "Duyurular", href: "/duyurular" },
  { id: -4, label: "Hakkımızda", href: "/about" }
];

export function Navbar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const nav = items.length > 0 ? items : FALLBACK;

  return (
    <header className="border-b bg-white">
      <div className="container-main flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-bold">
          Kütüphane & Haber
        </Link>
        <nav className="flex flex-wrap justify-end gap-3 text-sm sm:gap-5">
          {nav.map((item) => (
            <Link
              key={`${item.id}-${item.href}`}
              href={item.href}
              className={
                pathname === item.href
                  ? "font-semibold text-blue-600"
                  : "text-slate-700 hover:text-blue-600"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
