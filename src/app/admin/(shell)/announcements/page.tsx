import { AnnouncementsPanel } from "@/components/admin/announcements-panel";

export default function AdminAnnouncementsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Duyurular</h1>
      <AnnouncementsPanel />
    </div>
  );
}
