"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS: { href: string; label: string }[] = [
  { href: "/admin/dashboard", label: "Özet" },
  { href: "/admin/menu", label: "Site menüsü" },
  { href: "/admin/carousel", label: "Resim seridi" },
  { href: "/admin/homepage", label: "Anasayfa metni" },
  { href: "/admin/announcements", label: "Duyurular" },
  { href: "/admin/content", label: "İçerikler" },
  { href: "/admin/moderation", label: "Yorum onayı" },
  { href: "/admin/about", label: "Hakkımızda" },
  { href: "/admin/account", label: "Hesap güvenliği" }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <div className="sticky top-24 space-y-1 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Yönetim
        </p>
        <nav className="flex flex-col gap-0.5">
          {LINKS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                    : "rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();
  const selectValue = LINKS.some((l) => l.href === pathname) ? pathname : "/admin/dashboard";

  return (
    <div className="mb-6 lg:hidden">
      <label htmlFor="admin-nav" className="mb-1 block text-xs font-medium text-slate-600">
        Bölüm seç
      </label>
      <select
        id="admin-nav"
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        value={selectValue}
        onChange={(e) => {
          window.location.href = e.target.value;
        }}
      >
        {LINKS.map((item) => (
          <option key={item.href} value={item.href}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
