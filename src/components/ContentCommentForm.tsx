"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ContentCommentFormProps =
  | { contentId: number; announcementId?: never }
  | { announcementId: number; contentId?: never };

export function ContentCommentForm(props: ContentCommentFormProps) {
  const isAnnouncement = "announcementId" in props;
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [gender, setGender] = useState("");
  const [rating, setRating] = useState(0);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<null | { ok: boolean; text: string }>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !message.trim() || !gender || rating < 1) {
      setFeedback({ ok: false, text: "Lütfen tüm alanları ve 1–5 yıldızı doldurun." });
      return;
    }

    setBusy(true);
    setFeedback(null);

    const body = isAnnouncement
      ? {
          announcementId: props.announcementId,
          fullName: fullName.trim(),
          message: message.trim(),
          gender,
          rating
        }
      : {
          contentId: props.contentId,
          fullName: fullName.trim(),
          message: message.trim(),
          gender,
          rating
        };

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    setBusy(false);
    if (!res.ok) {
      setFeedback({ ok: false, text: "Gönderilemedi. Tekrar deneyin." });
      return;
    }

    setFeedback({
      ok: true,
      text: "Teşekkürler! Yorumunuz onaylandıktan sonra bu sayfada görünecektir."
    });
    setFullName("");
    setMessage("");
    setGender("");
    setRating(0);
    router.refresh();
  }

  const heading = isAnnouncement
    ? "Bu duyuru için yorum ve puan"
    : "Bu içerik için yorum ve puan";

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">{heading}</h2>
      <p className="text-sm text-slate-600">
        Görüşünüzü ve 1–5 arası puanınızı paylaşabilirsiniz.
      </p>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Puanınız</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              disabled={busy}
              onClick={() => setRating(n)}
              className={`text-2xl transition ${
                n <= rating ? "text-amber-500" : "text-slate-300 hover:text-amber-300"
              }`}
              aria-label={`${n} yıldız`}
            >
              {n <= rating ? "★" : "☆"}
            </button>
          ))}
        </div>
      </div>

      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full rounded-md border p-2"
        placeholder="Ad Soyad"
        maxLength={120}
      />
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="w-full rounded-md border p-2"
        required
      >
        <option value="">Cinsiyet</option>
        <option value="MALE">Erkek</option>
        <option value="FEMALE">Kız</option>
      </select>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-28 w-full rounded-md border p-2"
        placeholder="Yorumunuz..."
        maxLength={2000}
      />

      <button
        type="submit"
        disabled={busy}
        className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {busy ? "Gönderiliyor..." : "Gönder"}
      </button>

      {feedback ? (
        <p
          className={`text-sm ${feedback.ok ? "text-emerald-700" : "text-red-600"}`}
          role="status"
        >
          {feedback.text}
        </p>
      ) : null}
    </form>
  );
}
