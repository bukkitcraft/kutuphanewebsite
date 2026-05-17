"use client";

import { useEffect, useState } from "react";
import { RichEditor } from "@/components/RichEditor";
import { IceriklerPagePanel } from "@/components/admin/icerikler-page-panel";
import { Content, redirectIfUnauthorized } from "@/components/admin/admin-types";

export function ContentPanel() {
  const [contents, setContents] = useState<Content[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [bodyHtml, setBodyHtml] = useState("<p>Yeni içerik</p>");

  async function load() {
    try {
      const gate = await fetch("/api/admin/menu");
      if (redirectIfUnauthorized(gate)) return;
      const cRes = await fetch("/api/content");
      const contentData = await cRes.json();
      setContents(Array.isArray(contentData) ? contentData : []);
    } catch {
      setContents([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function resetContentForm() {
    setEditingId(null);
    setTitle("");
    setCoverImage("");
    setBodyHtml("<p>Yeni içerik</p>");
  }

  async function saveContent() {
    const endpoint = editingId ? `/api/admin/content/${editingId}` : "/api/admin/content";
    const method = editingId ? "PUT" : "POST";
    await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, bodyHtml, coverImage })
    });
    resetContentForm();
    load();
  }

  async function deleteContent(id: number) {
    await fetch(`/api/admin/content/${id}`, { method: "DELETE" });
    if (editingId === id) resetContentForm();
    load();
  }

  async function uploadImage(file: File) {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    if (!res.ok) return;
    const data = await res.json();
    setCoverImage(data.url);
  }

  return (
    <div className="space-y-8">
      <IceriklerPagePanel />

      <div className="space-y-4 rounded-xl border bg-white p-5 sm:p-6">
        <h2 className="text-xl font-semibold">
          {editingId ? "İçerik güncelle" : "Yeni içerik ekle"}
        </h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border p-2"
          placeholder="Başlık"
        />
        <input
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="w-full rounded-md border p-2"
          placeholder="Kapak resmi URL (veya yükleme API sonucu)"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file);
          }}
          className="w-full rounded-md border p-2"
        />
        <RichEditor
          key={editingId ?? "content-new"}
          value={bodyHtml}
          onChange={setBodyHtml}
          placeholder="Haber / kütüphane metnini yazın"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={saveContent}
            className="rounded-md bg-blue-600 px-4 py-2 text-white"
          >
            {editingId ? "Güncelle" : "Kaydet"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetContentForm}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-800 hover:bg-slate-50"
            >
              İptal
            </button>
          ) : null}
        </div>
      </div>

      <div className="space-y-4 rounded-xl border bg-white p-5 sm:p-6">
        <h2 className="text-xl font-semibold">Yayında olan içerikler</h2>
        <ul className="max-h-[min(32rem,70vh)] space-y-2 overflow-y-auto">
          {contents.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="font-medium">{item.title}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(item.id);
                    setTitle(item.title);
                    setCoverImage(item.coverImage ?? "");
                    setBodyHtml(item.bodyHtml);
                  }}
                  className="rounded-md bg-amber-500 px-3 py-1 text-sm text-white"
                >
                  Düzenle
                </button>
                <button
                  type="button"
                  onClick={() => deleteContent(item.id)}
                  className="rounded-md bg-red-600 px-3 py-1 text-sm text-white"
                >
                  Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
