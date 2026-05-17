import { ContentPanel } from "@/components/admin/content-panel";

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">İçerikler</h1>
      <ContentPanel />
    </div>
  );
}
