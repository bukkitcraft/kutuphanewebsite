import Link from "next/link";

export function HomeAdminHeartBar() {
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-16 flex w-screen items-center justify-center bg-gradient-to-r from-sky-800 via-indigo-800 to-sky-900 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.12)]">
      <Link
        href="/admin/login"
        prefetch={false}
        aria-label="Yönetim girişi"
        className="flex h-11 w-11 items-center justify-center rounded-full text-sky-100/90 transition hover:scale-110 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </Link>
    </div>
  );
}
