"use client";

import { useState } from "react";

export function SiteReviewForm() {
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

    const res = await fetch("/api/site-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: fullName.trim(),
        message: message.trim(),
        gender,
        rating
      })
    });

    setBusy(false);
    if (!res.ok) {
      setFeedback({ ok: false, text: "Gönderilemedi. Tekrar deneyin." });
      return;
    }

    setFeedback({
      ok: true,
      text: "Teşekkürler! Değerlendirmeniz onaylandıktan sonra yayınlanır."
    });
    setFullName("");
    setMessage("");
    setGender("");
    setRating(0);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Siteye yorum ve puan</h2>
      <p className="text-sm text-slate-600">
        Tüm site için görüşünüzü ve 1–5 arası puanınızı bırakabilirsiniz.
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
