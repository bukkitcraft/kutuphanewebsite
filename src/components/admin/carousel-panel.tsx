"use client";

import { useEffect, useState } from "react";
import { CarouselRow, redirectIfUnauthorized } from "@/components/admin/admin-types";

export function CarouselPanel() {
  const [carouselItems, setCarouselItems] = useState<CarouselRow[]>([]);
  const [carEditId, setCarEditId] = useState<number | null>(null);
  const [carUrl, setCarUrl] = useState("");
  const [carAlt, setCarAlt] = useState("");
  const [carLink, setCarLink] = useState("");
  const [carActive, setCarActive] = useState(true);
  const [carSort, setCarSort] = useState(0);

  async function load() {
    try {
      const carRes = await fetch("/api/admin/carousel");
      if (redirectIfUnauthorized(carRes)) return;
      const carData = await carRes.json();
      setCarouselItems(Array.isArray(carData) ? carData : []);
    } catch {
      setCarouselItems([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function resetCarForm() {
    setCarEditId(null);
    setCarUrl("");
    setCarAlt("");
    setCarLink("");
    setCarActive(true);
    setCarSort(0);
  }

  function startEditCar(row: CarouselRow) {
    setCarEditId(row.id);
    setCarUrl(row.imageUrl);
    setCarAlt(row.altText ?? "");
    setCarLink(row.linkUrl ?? "");
    setCarActive(row.isActive);
    setCarSort(row.sortOrder);
  }

  async function saveCarouselSlide() {
    if (!carUrl.trim()) return;
    if (carEditId) {
      await fetch(`/api/admin/carousel/${carEditId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: carUrl,
          altText: carAlt || null,
          linkUrl: carLink || null,
          isActive: carActive,
          sortOrder: carSort
        })
      });
    } else {
      await fetch("/api/admin/carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: carUrl,
          altText: carAlt || undefined,
          linkUrl: carLink || undefined,
          isActive: carActive,
          sortOrder: carSort
        })
      });
    }
    resetCarForm();
    load();
  }

  async function deleteCarouselSlide(id: number) {
    if (!confirm("Bu slaytı silmek istediğine emin misin?")) return;
    await fetch(`/api/admin/carousel/${id}`, { method: "DELETE" });
    if (carEditId === id) resetCarForm();
    load();
  }

  async function toggleCarActive(row: CarouselRow) {
    await fetch(`/api/admin/carousel/${row.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: row.imageUrl,
        altText: row.altText,
        linkUrl: row.linkUrl,
        isActive: !row.isActive,
        sortOrder: row.sortOrder
      })
    });
    load();
  }

  async function uploadCarouselFile(file: File) {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    if (!res.ok) return;
    const data = await res.json();
    if (data.url) setCarUrl(data.url);
  }

  return (
    <div className="space-y-4 rounded-xl border border-fuchsia-200 bg-fuchsia-50/40 p-5 sm:p-6">
      <h2 className="text-xl font-semibold text-fuchsia-950">Anasayfa resim seridi</h2>
      <p className="text-sm text-fuchsia-900/80">
        Kayar galeri. Resim yükleyin veya URL yazın. İsteğe bağlı tıklanınca gidilecek link.
      </p>
      <input
        value={carUrl}
        onChange={(e) => setCarUrl(e.target.value)}
        className="w-full rounded-md border border-fuchsia-200 bg-white p-2"
        placeholder="Resim URL (/uploads/... veya https://)"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void uploadCarouselFile(f);
        }}
        className="w-full rounded-md border border-fuchsia-200 bg-white p-2 text-sm"
      />
      <input
        value={carAlt}
        onChange={(e) => setCarAlt(e.target.value)}
        className="w-full rounded-md border border-fuchsia-200 bg-white p-2"
        placeholder="Alt metin (erişilebilirlik)"
      />
      <input
        value={carLink}
        onChange={(e) => setCarLink(e.target.value)}
        className="w-full rounded-md border border-fuchsia-200 bg-white p-2"
        placeholder="İsteğe bağlı link (/icerikler veya https://)"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={carActive}
          onChange={(e) => setCarActive(e.target.checked)}
        />
        Yayında
      </label>
      <label className="block text-sm">
        Sıra
        <input
          type="number"
          value={carSort}
          onChange={(e) => setCarSort(Number(e.target.value) || 0)}
          className="mt-1 w-full rounded-md border border-fuchsia-200 bg-white p-2"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={saveCarouselSlide}
          className="rounded-md bg-fuchsia-700 px-4 py-2 text-white hover:bg-fuchsia-800"
        >
          {carEditId ? "Slaytı güncelle" : "Slayt ekle"}
        </button>
        {carEditId ? (
          <button
            type="button"
            onClick={resetCarForm}
            className="rounded-md border border-fuchsia-400 bg-white px-4 py-2"
          >
            İptal
          </button>
        ) : null}
      </div>
      <ul className="max-h-[min(28rem,70vh)] space-y-2 overflow-y-auto border-t border-fuchsia-200 pt-3 text-sm">
        {carouselItems.map((row) => (
          <li
            key={row.id}
            className="flex flex-col gap-2 rounded-md border border-fuchsia-200/80 bg-white p-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={row.imageUrl}
                alt=""
                className="h-10 w-14 shrink-0 rounded object-cover"
              />
              <span className="truncate text-fuchsia-900/80">{row.imageUrl}</span>
              {!row.isActive ? (
                <span className="shrink-0 rounded bg-slate-200 px-1 text-xs">gizli</span>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => toggleCarActive(row)}
                className="rounded bg-slate-200 px-2 py-0.5 text-xs"
              >
                {row.isActive ? "Gizle" : "Göster"}
              </button>
              <button
                type="button"
                onClick={() => startEditCar(row)}
                className="rounded bg-fuchsia-600 px-2 py-0.5 text-xs text-white"
              >
                Düzenle
              </button>
              <button
                type="button"
                onClick={() => deleteCarouselSlide(row.id)}
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
