import { MenuPanel } from "@/components/admin/menu-panel";

export default function AdminMenuPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Site menüsü</h1>
      <MenuPanel />
    </div>
  );
}
