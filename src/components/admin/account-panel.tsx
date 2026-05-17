"use client";

import { useState } from "react";
import { redirectIfUnauthorized } from "@/components/admin/admin-types";

export function AccountPanel() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<null | { ok: boolean; text: string }>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setFeedback({ ok: false, text: "Lütfen tüm alanları doldurun." });
      return;
    }
    if (newPassword.length < 6) {
      setFeedback({ ok: false, text: "Yeni şifre en az 6 karakter olmalı." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ ok: false, text: "Yeni şifre ve tekrar alanı eşleşmiyor." });
      return;
    }

    setBusy(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/account/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      });
      if (redirectIfUnauthorized(res)) return;
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFeedback({ ok: false, text: String(data?.error ?? "Şifre güncellenemedi.") });
        return;
      }
      setFeedback({ ok: true, text: "Şifre başarıyla güncellendi." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setFeedback({ ok: false, text: "Bağlantı hatası. Tekrar deneyin." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Hesap güvenliği</h2>
        <p className="mt-1 text-sm text-slate-600">Admin şifrenizi bu ekrandan değiştirebilirsiniz.</p>
      </div>

      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm"
        placeholder="Mevcut şifre"
        autoComplete="current-password"
      />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm"
        placeholder="Yeni şifre (en az 6 karakter)"
        autoComplete="new-password"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm"
        placeholder="Yeni şifre (tekrar)"
        autoComplete="new-password"
      />

      <button
        type="submit"
        disabled={busy}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Kaydediliyor..." : "Şifreyi güncelle"}
      </button>

      {feedback ? (
        <p className={`text-sm ${feedback.ok ? "text-emerald-700" : "text-red-600"}`} role="status">
          {feedback.text}
        </p>
      ) : null}
    </form>
  );
}
