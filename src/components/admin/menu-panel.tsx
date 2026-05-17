"use client";

import { useEffect, useState } from "react";
import { MenuRow, redirectIfUnauthorized } from "@/components/admin/admin-types";

export function MenuPanel() {
  const [menuItems, setMenuItems] = useState<MenuRow[]>([]);
  const [menuEditId, setMenuEditId] = useState<number | null>(null);
  const [menuLabel, setMenuLabel] = useState("");
  const [menuHref, setMenuHref] = useState("");
  const [menuActive, setMenuActive] = useState(true);
  const [menuSort, setMenuSort] = useState(0);

  async function load() {
    try {
      const menuRes = await fetch("/api/admin/menu");
      if (redirectIfUnauthorized(menuRes)) return;
      const menuData = await menuRes.json();
      setMenuItems(Array.isArray(menuData) ? menuData : []);
    } catch {
      setMenuItems([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function resetMenuForm() {
    setMenuEditId(null);
    setMenuLabel("");
    setMenuHref("");
    setMenuActive(true);
    setMenuSort(0);
  }

  function startEditMenu(row: MenuRow) {
    setMenuEditId(row.id);
    setMenuLabel(row.label);
    setMenuHref(row.href);
    setMenuActive(row.isActive);
    setMenuSort(row.sortOrder);
  }

  async function saveMenuItem() {
    if (!menuLabel.trim() || !menuHref.trim()) return;
    if (menuEditId) {
      await fetch(`/api/admin/menu/${menuEditId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: menuLabel,
          href: menuHref,
          isActive: menuActive,
          sortOrder: menuSort
        })
      });
    } else {
      await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: menuLabel,
          href: menuHref,
          isActive: menuActive,
          sortOrder: menuSort
        })
      });
    }
    resetMenuForm();
    load();
  }

  async function deleteMenuItem(id: number) {
    if (!confirm("Bu menü öğesini silmek istediğine emin misin?")) return;
    await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
    if (menuEditId === id) resetMenuForm();
    load();
  }

  async function toggleMenuActive(row: MenuRow) {
    await fetch(`/api/admin/menu/${row.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: row.label,
        href: row.href,
        isActive: !row.isActive,
        sortOrder: row.sortOrder
      })
    });
    load();
  }

  return (
    <div className="space-y-4 rounded-xl border border-teal-200 bg-teal-50/40 p-5 sm:p-6">
      <h2 className="text-xl font-semibold text-teal-950">Site menüsü (dinamik)</h2>
      <p className="text-sm text-teal-900/80">
        Üst navigasyon. Örnek href: <code className="rounded bg-white/80 px-1">/</code>,{" "}
        <code className="rounded bg-white/80 px-1">/about</code>, harici link için https://...
      </p>
      <input
        value={menuLabel}
        onChange={(e) => setMenuLabel(e.target.value)}
        className="w-full rounded-md border border-teal-200 bg-white p-2"
        placeholder="Menü yazısı"
      />
      <input
        value={menuHref}
        onChange={(e) => setMenuHref(e.target.value)}
        className="w-full rounded-md border border-teal-200 bg-white p-2"
        placeholder="Href (örnek: /about)"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={menuActive}
          onChange={(e) => setMenuActive(e.target.checked)}
        />
        Aktif (menüde göster)
      </label>
      <label className="block text-sm">
        Sıra
        <input
          type="number"
          value={menuSort}
          onChange={(e) => setMenuSort(Number(e.target.value) || 0)}
          className="mt-1 w-full rounded-md border border-teal-200 bg-white p-2"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={saveMenuItem}
          className="rounded-md bg-teal-700 px-4 py-2 text-white hover:bg-teal-800"
        >
          {menuEditId ? "Öğeyi güncelle" : "Öğe ekle"}
        </button>
        {menuEditId ? (
          <button
            type="button"
            onClick={resetMenuForm}
            className="rounded-md border border-teal-400 bg-white px-4 py-2 text-teal-950"
          >
            İptal
          </button>
        ) : null}
      </div>
      <ul className="max-h-[min(28rem,70vh)] space-y-2 overflow-y-auto border-t border-teal-200 pt-3 text-sm">
        {menuItems.map((row) => (
          <li
            key={row.id}
            className="flex flex-col gap-2 rounded-md border border-teal-200/80 bg-white p-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <span className="font-medium">{row.label}</span>
              <span className="ml-2 text-teal-800/70">({row.href})</span>
              {!row.isActive ? (
                <span className="ml-2 rounded bg-slate-200 px-1 text-xs">kapalı</span>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => toggleMenuActive(row)}
                className="rounded bg-slate-200 px-2 py-0.5 text-xs hover:bg-slate-300"
              >
                {row.isActive ? "Kapat" : "Aç"}
              </button>
              <button
                type="button"
                onClick={() => startEditMenu(row)}
                className="rounded bg-teal-600 px-2 py-0.5 text-xs text-white"
              >
                Düzenle
              </button>
              <button
                type="button"
                onClick={() => deleteMenuItem(row.id)}
                className="rounded bg-red-600 px-2 py-0.5 text-xs text-white"
              >
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
