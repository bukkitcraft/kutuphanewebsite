"use client";

import { useEffect, useRef, useState } from "react";
import { RichEditor } from "@/components/RichEditor";
import { redirectIfUnauthorized } from "@/components/admin/admin-types";

export function HomepagePanel() {
  const [homeTitle, setHomeTitle] = useState("");
  const [homeSubtitle, setHomeSubtitle] = useState("");
  const [homeIntroHtml, setHomeIntroHtml] = useState("<p></p>");
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveNotice, setSaveNotice] = useState<null | { ok: boolean; text: string }>(null);
  const noticeClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function load() {
    try {
      const hRes = await fetch("/api/admin/homepage");
      if (redirectIfUnauthorized(hRes)) return;
      const homeData = await hRes.json();
      if (typeof homeData?.title === "string") setHomeTitle(homeData.title);
      if (typeof homeData?.subtitle === "string") setHomeSubtitle(homeData.subtitle);
      if (typeof homeData?.introHtml === "string") setHomeIntroHtml(homeData.introHtml);
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

  async function saveHomepage() {
    if (noticeClearRef.current) {
      clearTimeout(noticeClearRef.current);
      noticeClearRef.current = null;
    }
    setSaveNotice(null);
    setSaveBusy(true);
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: homeTitle,
          subtitle: homeSubtitle,
          introHtml: homeIntroHtml
        })
      });
      if (redirectIfUnauthorized(res)) return;
      if (!res.ok) {
        setSaveNotice({ ok: false, text: "Kayıt başarısız. Tekrar deneyin." });
        return;
      }
      setSaveNotice({ ok: true, text: "Kaydedildi." });
      noticeClearRef.current = setTimeout(() => setSaveNotice(null), 4500);
    } catch {
      setSaveNotice({ ok: false, text: "Bağlantı hatası." });
    } finally {
      setSaveBusy(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-indigo-200 bg-indigo-50/50 p-5 sm:p-6">
      <h2 className="text-xl font-semibold text-indigo-950">Anasayfa düzeni</h2>
      <p className="text-sm text-indigo-900/80">
        Ziyaretçilerin gördüğü ana başlık, alt başlık ve kartların üstündeki açıklama metni.
      </p>
      <input
        value={homeTitle}
        onChange={(e) => setHomeTitle(e.target.value)}
        className="w-full rounded-md border border-indigo-200 bg-white p-2"
        placeholder="Ana başlık"
      />
      <input
        value={homeSubtitle}
        onChange={(e) => setHomeSubtitle(e.target.value)}
        className="w-full rounded-md border border-indigo-200 bg-white p-2"
        placeholder="Alt başlık (isteğe bağlı)"
      />
      <RichEditor
        key="home-intro-editor"
        value={homeIntroHtml}
        onChange={setHomeIntroHtml}
        placeholder="Anasayfa giriş metni (HTML)"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          disabled={saveBusy}
          onClick={() => void saveHomepage()}
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saveBusy ? "Kaydediliyor…" : "Anasayfayı kaydet"}
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
