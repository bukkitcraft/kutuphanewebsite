import { AdminMobileNav, AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full">
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-4 py-0 sm:px-6 lg:px-10">
        <div className="flex min-h-[calc(100vh-5rem)] gap-8 pb-12 pt-2">
          <AdminSidebar />
          <div className="min-w-0 flex-1">
            <AdminMobileNav />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
