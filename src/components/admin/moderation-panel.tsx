"use client";

import { useEffect, useState } from "react";
import {
  PendingContentComment,
  PendingSiteReview,
  redirectIfUnauthorized
} from "@/components/admin/admin-types";

export function ModerationPanel() {
  const [pendingReviews, setPendingReviews] = useState<PendingSiteReview[]>([]);
  const [pendingContentComments, setPendingContentComments] = useState<PendingContentComment[]>(
    []
  );

  async function load() {
    try {
      const [pRes, comRes] = await Promise.all([
        fetch("/api/admin/site-reviews?pending=1"),
        fetch("/api/admin/comments?pending=1")
      ]);
      if (redirectIfUnauthorized(pRes)) return;
      const pendingData = await pRes.json();
      const pendingCommentsData = await comRes.json();
      setPendingReviews(Array.isArray(pendingData) ? pendingData : []);
      setPendingContentComments(
        Array.isArray(pendingCommentsData) ? pendingCommentsData : []
      );
    } catch {
      setPendingReviews([]);
      setPendingContentComments([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function approveSiteReview(id: number) {
    await fetch(`/api/admin/site-reviews/${id}/approve`, { method: "PATCH" });
    load();
  }

  async function approveContentComment(id: number) {
    await fetch(`/api/admin/comments/${id}/approve`, { method: "PATCH" });
    load();
  }

  async function rejectSiteReview(id: number) {
    if (!confirm("Bu site yorumunu reddedip silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/site-reviews/${id}`, { method: "DELETE" });
    load();
  }

  async function rejectContentComment(id: number) {
    if (!confirm("Bu yorumu reddedip silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4 rounded-xl border bg-white p-5 sm:p-6">
        <h2 className="text-xl font-semibold">Onay bekleyen site yorumları</h2>
        <p className="text-sm text-slate-600">
          Anasayfadan gelen site geneli yorum ve puanlar.
        </p>
        {pendingReviews.length === 0 ? (
          <p className="text-sm text-slate-500">Bekleyen site yorumu yok.</p>
        ) : null}
        <div className="max-h-[min(24rem,50vh)] space-y-3 overflow-y-auto">
          {pendingReviews.map((item) => (
            <div key={item.id} className="rounded-md border p-3">
              <p className="font-semibold">{item.fullName}</p>
              <p className="text-xs text-amber-700">Puan: {item.rating} / 5</p>
              <p className="text-sm">{item.message}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => approveSiteReview(item.id)}
                  className="rounded-md bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-700"
                >
                  Onayla
                </button>
                <button
                  type="button"
                  onClick={() => rejectSiteReview(item.id)}
                  className="rounded-md border border-red-300 bg-white px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                >
                  Reddet
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-xl border bg-white p-5 sm:p-6">
        <h2 className="text-xl font-semibold">Onay bekleyen içerik ve duyuru yorumları</h2>
        <p className="text-sm text-slate-600">
          İçerik ve duyuru sayfalarından gelen yorum ve puanlar; onaylanınca ilgili sayfada listelenir.
        </p>
        {pendingContentComments.length === 0 ? (
          <p className="text-sm text-slate-500">Bekleyen içerik veya duyuru yorumu yok.</p>
        ) : null}
        <div className="max-h-[min(28rem,55vh)] space-y-3 overflow-y-auto">
          {pendingContentComments.map((item) => (
            <div key={item.id} className="rounded-md border border-violet-200 bg-violet-50/40 p-3">
              <p className="text-xs font-medium text-violet-900">
                {item.announcement ? (
                  <>
                    Duyuru:{" "}
                    <a
                      href={`/duyurular#duyuru-${item.announcement.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-violet-700 underline"
                    >
                      {item.announcement.title}
                    </a>
                  </>
                ) : item.content ? (
                  <>
                    İçerik:{" "}
                    <a
                      href={`/content/${item.content.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-violet-700 underline"
                    >
                      {item.content.title}
                    </a>
                  </>
                ) : (
                  <>Kaynak #{item.contentId ?? item.announcementId ?? item.id}</>
                )}
              </p>
              <p className="font-semibold">{item.fullName}</p>
              <p className="text-xs text-amber-700">Puan: {item.rating} / 5</p>
              <p className="text-sm">{item.message}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => approveContentComment(item.id)}
                  className="rounded-md bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-700"
                >
                  Onayla
                </button>
                <button
                  type="button"
                  onClick={() => rejectContentComment(item.id)}
                  className="rounded-md border border-red-300 bg-white px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                >
                  Reddet
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
