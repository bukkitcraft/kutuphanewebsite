"use client";

import { useEffect, useRef, useState } from "react";
import { RichEditor } from "@/components/RichEditor";
import { redirectIfUnauthorized } from "@/components/admin/admin-types";

export function IceriklerPagePanel() {
  const [pageTitle, setPageTitle] = useState("Tüm içerikler");
  const [introHtml, setIntroHtml] = useState("<p></p>");
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveNotice, setSaveNotice] = useState<null | { ok: boolean; text: string }>(null);
  const noticeClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/admin/icerikler-page");
      if (redirectIfUnauthorized(res)) return;
      const data = await res.json();
      if (typeof data?.pageTitle === "string") setPageTitle(data.pageTitle);
      if (typeof data?.introHtml === "string") setIntroHtml(data.introHtml);
    } catch {
      /* ignore */
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

  async function save() {
    if (noticeClearRef.current) {
      clearTimeout(noticeClearRef.current);
      noticeClearRef.current = null;
    }
    setSaveNotice(null);
    setSaveBusy(true);
    try {
      const res = await fetch("/api/admin/icerikler-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageTitle, introHtml })
      });
      if (redirectIfUnauthorized(res)) return;
      if (!res.ok) {
        setSaveNotice({ ok: false, text: "Kayıt başarısız. Tekrar deneyin." });
        return;
      }
      setSaveNotice({ ok: true, text: "İçerikler sayfası kaydedildi." });
      noticeClearRef.current = setTimeout(() => setSaveNotice(null), 4500);
    } catch {
      setSaveNotice({ ok: false, text: "Bağlantı hatası." });
    } finally {
      setSaveBusy(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-cyan-200 bg-cyan-50/40 p-5 sm:p-6">
      <div>
        <h2 className="text-xl font-semibold text-cyan-950">İçerikler sayfası (/icerikler)</h2>
        <p className="mt-1 text-sm text-cyan-900/85">
          Ziyaretçilerin gördüğü liste sayfası başlığı ve üst açıklama metni.
        </p>
      </div>
      <input
        value={pageTitle}
        onChange={(e) => setPageTitle(e.target.value)}
        className="w-full rounded-md border border-cyan-200 bg-white p-2"
        placeholder="Sayfa başlığı"
        maxLength={120}
      />
      <RichEditor
        key="icerikler-intro-editor"
        value={introHtml}
        onChange={setIntroHtml}
        placeholder="Sayfa giriş metni (HTML)"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          disabled={saveBusy}
          onClick={() => void save()}
          className="rounded-md bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-800 disabled:opacity-60"
        >
          {saveBusy ? "Kaydediliyor…" : "İçerikler sayfasını kaydet"}
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
