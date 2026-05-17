import { Suspense } from "react";
import { IceriklerSearchForm } from "@/components/IceriklerSearchForm";

export function IceriklerToolbar() {
  return (
    <Suspense fallback={<div className="h-24 animate-pulse rounded-xl bg-slate-100" />}>
      <IceriklerSearchForm />
    </Suspense>
  );
}
