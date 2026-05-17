import { sanitizePlainText } from "@/lib/security";

/** Ic link (/path) veya http(s) dis link; aksi halde '/'. */
export function sanitizeNavHref(raw: string): string {
  const t = sanitizePlainText(raw).trim();
  if (t.startsWith("/") && !t.startsWith("//")) return t.slice(0, 2048);
  if (/^https:\/\//i.test(t)) return t.slice(0, 2048);
  if (/^http:\/\//i.test(t)) return t.slice(0, 2048);
  return "/";
}

export function sanitizeOptionalLink(raw: string | undefined): string | null {
  if (raw == null) return null;
  const t = sanitizePlainText(raw).trim();
  if (!t) return null;
  if (t.startsWith("/") && !t.startsWith("//")) return t.slice(0, 2048);
  if (/^https:\/\//i.test(t)) return t.slice(0, 2048);
  if (/^http:\/\//i.test(t)) return t.slice(0, 2048);
  return null;
}
