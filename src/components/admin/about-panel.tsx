"use client";

import { useEffect, useRef, useState } from "react";
import { RichEditor } from "@/components/RichEditor";
import { redirectIfUnauthorized } from "@/components/admin/admin-types";

export function AboutPanel() {
  const [aboutHtml, setAboutHtml] = useState("<p></p>");
  const [aboutSubtitle, setAboutSubtitle] = useState(
    "Kütüphane ve içeriklerimiz hakkında kısa bilgi ve görsel."
  );
  const [aboutImageUrl, setAboutImageUrl] = useState("");
  const [mapEmbedUrl, setMapEmbedUrl] = useState("");
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveNotice, setSaveNotice] = useState<null | { ok: boolean; text: string }>(null);
  const noticeClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function load() {
    try {
      const aRes = await fetch("/api/admin/about");
      if (redirectIfUnauthorized(aRes)) return;
      const aboutData = await aRes.json();
      setAboutHtml(typeof aboutData?.value === "string" ? aboutData.value : "<p></p>");
      setAboutImageUrl(typeof aboutData?.imageUrl === "string" ? aboutData.imageUrl : "");
      if (typeof aboutData?.subtitle === "string") {
        setAboutSubtitle(aboutData.subtitle);
      }
      if (typeof aboutData?.mapEmbedUrl === "string") {
        setMapEmbedUrl(aboutData.mapEmbedUrl);
      }
    } catch {
      setAboutHtml("<p></p>");
      setAboutImageUrl("");
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    return () => {
      if (noticeClearRef.current) clearTimeout(noticeClearRef.current);
    };
  }, []);

  async function saveAbout() {
    if (noticeClearRef.current) {
      clearTimeout(noticeClearRef.current);
      noticeClearRef.current = null;
    }
    setSaveNotice(null);
    setSaveBusy(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: aboutHtml,
          imageUrl: aboutImageUrl,
          subtitle: aboutSubtitle,
          mapEmbedUrl
        })
      });
      if (redirectIfUnauthorized(res)) return;
      if (!res.ok) {
        setSaveNotice({ ok: false, text: "Kayıt başarısız. Tekrar deneyin." });
        return;
      }
      setSaveNotice({ ok: true, text: "Kaydedildi. Sayfa güncellendi." });
      noticeClearRef.current = setTimeout(() => setSaveNotice(null), 4500);
    } catch {
      setSaveNotice({ ok: false, text: "Bağlantı hatası." });
    } finally {
      setSaveBusy(false);
    }
  }

  async function uploadAboutImage(file: File) {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    if (!res.ok) {
      setSaveNotice({ ok: false, text: "Görsel yüklenemedi." });
      return;
    }
    const data = await res.json();
    if (data.url) {
      setAboutImageUrl(data.url);
      setSaveNotice({ ok: true, text: "Görsel yüklendi. Kaydet ile sayfaya uygulayın." });
      if (noticeClearRef.current) clearTimeout(noticeClearRef.current);
      noticeClearRef.current = setTimeout(() => setSaveNotice(null), 4500);
    }
  }

  return (
    <div className="space-y-6 rounded-xl border bg-white p-5 sm:p-6">
      <div>
        <h2 className="text-xl font-semibold">Hakkımızda yönetimi</h2>
        <p className="mt-1 text-sm text-slate-600">
          Sayfanın üstünde, anasayfa galerisiyle aynı yükseklikte yatay şerit görsel (tek kare).
        </p>
      </div>

      <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Başlık altı kısa metin</h3>
        <p className="text-xs text-slate-600">
          “Hakkımızda” başlığının hemen altında görünen özet cümle (ziyaretçi sayfası).
        </p>
        <textarea
          value={aboutSubtitle}
          onChange={(e) => setAboutSubtitle(e.target.value)}
          rows={2}
          maxLength={500}
          className="w-full rounded-md border border-slate-200 bg-white p-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Kısa tanıtım metni…"
        />
      </div>

      <div className="space-y-3 rounded-xl border border-indigo-200 bg-indigo-50/40 p-4">
        <h3 className="text-sm font-semibold text-indigo-950">Kapak görseli</h3>
        {aboutImageUrl ? (
          <div className="overflow-hidden rounded-lg border border-indigo-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={aboutImageUrl}
              alt="Önizleme"
              className="max-h-48 w-full object-cover object-center"
            />
          </div>
        ) : null}
        <input
          value={aboutImageUrl}
          onChange={(e) => setAboutImageUrl(e.target.value)}
          className="w-full rounded-md border border-indigo-200 bg-white p-2 text-sm"
          placeholder="Görsel URL (/uploads/... veya tam adres)"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void uploadAboutImage(f);
          }}
          className="w-full rounded-md border border-indigo-200 bg-white p-2 text-sm"
        />
        <p className="text-xs text-indigo-900/75">
          Görsel, anasayfadaki galeri slaytlarıyla aynı yükseklikte yatay şerit olarak gösterilir; yatay
          fotoğraflar kırpılmadan daha iyi görünür.
        </p>
      </div>

      <div className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
        <h3 className="text-sm font-semibold text-emerald-950">Google Haritalar</h3>
        <p className="text-xs text-emerald-900/85">
          Haritada göstermek için Google Haritalar’da konumu açın → <strong>Paylaş</strong> →{" "}
          <strong>Harita yerleştir</strong> → HTML içindeki{" "}
          <code className="rounded bg-white/90 px-0.5 text-[11px]">src=&quot;…&quot;</code> adresini
          kopyalayıp aşağıya yapıştırın (yalnızca{" "}
          <code className="text-[11px]">google.com/maps/embed</code> bağlantıları kabul edilir).
        </p>
        <textarea
          value={mapEmbedUrl}
          onChange={(e) => setMapEmbedUrl(e.target.value)}
          rows={3}
          maxLength={2800}
          className="w-full rounded-md border border-emerald-200 bg-white p-2 font-mono text-xs text-slate-900"
          placeholder="https://www.google.com/maps/embed?pb=..."
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-900">Sayfa metni</h3>
        <RichEditor
          key="about-editor"
          value={aboutHtml}
          onChange={setAboutHtml}
          placeholder="Hakkımızda sayfası metni"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          disabled={saveBusy}
          onClick={() => void saveAbout()}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saveBusy ? "Kaydediliyor…" : "Hakkımızda kaydet"}
        </button>
        {saveNotice ? (
          <p
            role="status"
            className={`text-sm font-medium ${saveNotice.ok ? "text-emerald-700" : "text-red-600"}`}
          >
            {saveNotice.text}
          </p>
        ) : null}
      </div>
    </div>
  );
}
