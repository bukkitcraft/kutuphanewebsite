import Link from "next/link";

const CARDS: { href: string; title: string; description: string; tone: string }[] = [
  {
    href: "/admin/menu",
    title: "Site menüsü",
    description: "Üst navigasyon bağlantıları",
    tone: "border-teal-200 bg-teal-50/50 hover:border-teal-300"
  },
  {
    href: "/admin/carousel",
    title: "Resim seridi",
    description: "Anasayfa kayan görseller",
    tone: "border-fuchsia-200 bg-fuchsia-50/40 hover:border-fuchsia-300"
  },
  {
    href: "/admin/homepage",
    title: "Anasayfa metni",
    description: "Başlık, alt başlık ve giriş metni",
    tone: "border-indigo-200 bg-indigo-50/50 hover:border-indigo-300"
  },
  {
    href: "/admin/announcements",
    title: "Duyurular",
    description: "Duyuru sayfası ve kartlar",
    tone: "border-amber-200 bg-amber-50/50 hover:border-amber-300"
  },
  {
    href: "/admin/content",
    title: "İçerikler",
    description: "Yeni içerik ve liste",
    tone: "border-slate-200 bg-white hover:border-slate-300"
  },
  {
    href: "/admin/moderation",
    title: "Yorum onayı",
    description: "Site ve içerik yorumları",
    tone: "border-emerald-200 bg-emerald-50/40 hover:border-emerald-300"
  },
  {
    href: "/admin/about",
    title: "Hakkımızda",
    description: "Hakkımızda sayfası metni",
    tone: "border-slate-200 bg-white hover:border-slate-300"
  },
  {
    href: "/admin/account",
    title: "Hesap güvenliği",
    description: "Admin şifresi değiştir",
    tone: "border-rose-200 bg-rose-50/40 hover:border-rose-300"
  }
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Özet</h1>
        <p className="mt-1 text-slate-600">
          Soldaki menüden veya aşağıdaki kartlardan bir bölüme geçin; her sayfa tek konuya odaklanır.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`rounded-xl border p-5 shadow-sm transition ${c.tone}`}
          >
            <h2 className="text-lg font-semibold text-slate-900">{c.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{c.description}</p>
            <p className="mt-3 text-sm font-medium text-blue-600">Aç →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
