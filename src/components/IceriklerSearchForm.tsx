"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function IceriklerSearchForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [sort, setSort] = useState(sp.get("sort") === "oldest" ? "oldest" : "newest");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (sort === "oldest") params.set("sort", "oldest");
    const qs = params.toString();
    router.push(qs ? `/icerikler?${qs}` : "/icerikler");
  }

  function clearFilters() {
    setQ("");
    setSort("newest");
    router.push("/icerikler");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end"
    >
      <div className="min-w-0 grow sm:max-w-md">
        <label htmlFor="icerik-q" className="mb-1 block text-xs font-medium text-slate-600">
          Başlıkta ara
        </label>
        <input
          id="icerik-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="box-border h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          placeholder="İçerik başlığı…"
          maxLength={200}
        />
      </div>
      <div>
        <label htmlFor="icerik-sort" className="mb-1 block text-xs font-medium text-slate-600">
          Tarih sırası
        </label>
        <select
          id="icerik-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
          className="box-border h-10 w-full min-w-[200px] rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:w-auto"
        >
          <option value="newest">Yeniden eskiye</option>
          <option value="oldest">Eskiden yeniye</option>
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          className="box-border inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
        >
          Uygula
        </button>
        <button
          type="button"
          onClick={clearFilters}
          className="box-border inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Sıfırla
        </button>
      </div>
    </form>
  );
}
