"use client";

import { useState } from "react";

type Props = {
  contentId: number;
  initialRate: number;
  initialVotes: number;
};

export function RatingStars({ contentId, initialRate, initialVotes }: Props) {
  const [loading, setLoading] = useState(false);
  const [rate, setRate] = useState(initialRate);
  const [votes, setVotes] = useState(initialVotes);
  const [message, setMessage] = useState("");

  async function vote(value: number) {
    if (loading) return;
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentId, value })
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Bir hata oluştu.");
    } else {
      setRate(data.averageRate);
      setVotes(data.voteCount);
      setMessage("Teşekkürler! Puanınız kaydedildi.");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => vote(star)}
            disabled={loading}
            className="text-2xl text-amber-500 disabled:opacity-50"
            aria-label={`${star} yıldız ver`}
          >
            {star <= Math.round(rate) ? "★" : "☆"}
          </button>
        ))}
      </div>
      <p className="text-sm text-slate-600">
        Ortalama: {rate.toFixed(1)} / 5 ({votes} oy)
      </p>
      {message ? <p className="text-sm text-green-700">{message}</p> : null}
    </div>
  );
}
