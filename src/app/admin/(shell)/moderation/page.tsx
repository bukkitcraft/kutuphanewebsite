import { ModerationPanel } from "@/components/admin/moderation-panel";

export default function AdminModerationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Yorum onayı</h1>
      <ModerationPanel />
    </div>
  );
}
