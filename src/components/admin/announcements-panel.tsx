"use client";

import { useEffect, useState } from "react";
import { RichEditor } from "@/components/RichEditor";
import { Announcement, redirectIfUnauthorized } from "@/components/admin/admin-types";

export function AnnouncementsPanel() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [annEditingId, setAnnEditingId] = useState<number | null>(null);
  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("<p></p>");
  const [annActive, setAnnActive] = useState(true);
  const [annSort, setAnnSort] = useState(0);
  const [annPageTitle, setAnnPageTitle] = useState("Duyurular");
  const [annPageIntroHtml, setAnnPageIntroHtml] = useState("<p></p>");

  async function load() {
    try {
      const [annRes, annPageRes] = await Promise.all([
        fetch("/api/admin/announcements"),
        fetch("/api/admin/announcements-page")
      ]);
      if (redirectIfUnauthorized(annRes)) return;
      const annData = await annRes.json();
      setAnnouncements(Array.isArray(annData) ? annData : []);
      const annPageData = await annPageRes.json();
      if (typeof annPageData?.pageTitle === "string") setAnnPageTitle(annPageData.pageTitle);
      if (typeof annPageData?.introHtml === "string") {
        setAnnPageIntroHtml(annPageData.introHtml);
      }
    } catch {
      setAnnouncements([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveAnnouncementsPage() {
    await fetch("/api/admin/announcements-page", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageTitle: annPageTitle,
        introHtml: annPageIntroHtml
      })
    });
  }

  function resetAnnForm() {
    setAnnEditingId(null);
    setAnnTitle("");
    setAnnBody("<p></p>");
    setAnnActive(true);
    setAnnSort(0);
  }

  function startEditAnn(row: Announcement) {
    setAnnEditingId(row.id);
    setAnnTitle(row.title);
    setAnnBody(row.bodyHtml || "<p></p>");
    setAnnActive(row.isActive);
    setAnnSort(row.sortOrder);
  }

  async function saveAnnouncement() {
    if (!annTitle.trim()) return;
    if (annEditingId) {
      await fetch(`/api/admin/announcements/${annEditingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: annTitle,
          bodyHtml: annBody,
          isActive: annActive,
          sortOrder: annSort
        })
      });
    } else {
      await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: annTitle,
          bodyHtml: annBody,
          isActive: annActive,
          sortOrder: annSort
        })
      });
    }
    resetAnnForm();
    load();
  }

  async function deleteAnnouncement(id: number) {
    if (!confirm("Bu duyuruyu silmek istediğine emin misin?")) return;
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    if (annEditingId === id) resetAnnForm();
    load();
  }

  async function toggleAnnouncementActive(row: Announcement) {
    await fetch(`/api/admin/announcements/${row.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: row.title,
        bodyHtml: row.bodyHtml,
        isActive: !row.isActive,
        sortOrder: row.sortOrder
      })
    });
    load();
  }

  return (
    <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/50 p-5 sm:p-6">
      <h2 className="text-xl font-semibold text-amber-950">Duyuru paneli</h2>
      <p className="text-sm text-amber-950/80">
        Duyurular <strong>/duyurular</strong> sayfasında listelenir. Aşağıda sayfa başlığı ve
        açıklama metnini; altta tekil duyuru kartlarını yönetirsiniz.
      </p>

      <div className="space-y-2 rounded-lg border border-amber-300/60 bg-white/70 p-3">
        <h3 className="text-sm font-semibold text-amber-950">Duyurular sayfası (/duyurular)</h3>
        <input
          value={annPageTitle}
          onChange={(e) => setAnnPageTitle(e.target.value)}
          className="w-full rounded-md border border-amber-200 bg-white p-2"
          placeholder="Sayfa başlığı"
        />
        <RichEditor
          key="announcements-page-intro"
          value={annPageIntroHtml}
          onChange={setAnnPageIntroHtml}
          placeholder="Sayfa giriş metni (üstteki açıklama)"
        />
        <button
          type="button"
          onClick={saveAnnouncementsPage}
          className="rounded-md bg-amber-900 px-3 py-2 text-sm text-white hover:bg-amber-950"
        >
          Duyurular sayfasını kaydet
        </button>
      </div>

      <input
        value={annTitle}
        onChange={(e) => setAnnTitle(e.target.value)}
        className="w-full rounded-md border border-amber-200 bg-white p-2"
        placeholder="Duyuru başlığı"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={annActive}
          onChange={(e) => setAnnActive(e.target.checked)}
        />
        Yayında (duyurular sayfasında göster)
      </label>
      <label className="block text-sm text-amber-950">
        Sıra
        <input
          type="number"
          value={annSort}
          onChange={(e) => setAnnSort(Number(e.target.value) || 0)}
          className="mt-1 w-full rounded-md border border-amber-200 bg-white p-2"
        />
      </label>
      <RichEditor
        key={annEditingId ?? "announcement-new"}
        value={annBody}
        onChange={setAnnBody}
        placeholder="Duyuru metni"
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={saveAnnouncement}
          className="rounded-md bg-amber-700 px-4 py-2 text-white hover:bg-amber-800"
        >
          {annEditingId ? "Duyuruyu güncelle" : "Duyuru ekle"}
        </button>
        {annEditingId ? (
          <button
            type="button"
            onClick={resetAnnForm}
            className="rounded-md border border-amber-400 bg-white px-4 py-2 text-amber-950"
          >
            İptal
          </button>
        ) : null}
      </div>

      <ul className="max-h-[min(28rem,70vh)] space-y-2 overflow-y-auto border-t border-amber-200 pt-3">
        {announcements.map((row) => (
          <li
            key={row.id}
            className="flex flex-col gap-2 rounded-md border border-amber-200/80 bg-white p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <span className="font-medium">{row.title}</span>
              <span className="ml-2 text-amber-800/70">(sıra: {row.sortOrder})</span>
              {!row.isActive ? (
                <span className="ml-2 rounded bg-slate-200 px-1.5 text-xs text-slate-700">
                  gizli
                </span>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toggleAnnouncementActive(row)}
                className="rounded bg-slate-200 px-2 py-1 text-xs hover:bg-slate-300"
              >
                {row.isActive ? "Gizle" : "Göster"}
              </button>
              <button
                type="button"
                onClick={() => startEditAnn(row)}
                className="rounded bg-amber-500 px-2 py-1 text-xs text-white hover:bg-amber-600"
              >
                Düzenle
              </button>
              <button
                type="button"
                onClick={() => deleteAnnouncement(row.id)}
                className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
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
