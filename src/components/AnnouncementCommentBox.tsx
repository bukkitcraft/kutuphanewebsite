"use client";

import { useState } from "react";
import { ContentCommentForm } from "@/components/ContentCommentForm";

export function AnnouncementCommentBox({ announcementId }: { announcementId: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
        aria-expanded={open}
      >
        {open ? "Yorum formunu gizle" : "Yorum yap"}
      </button>

      {open ? <ContentCommentForm announcementId={announcementId} /> : null}
    </div>
  );
}
