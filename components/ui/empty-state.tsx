import { Panel } from "@/components/ui/panel";
import { Info } from "lucide-react";

export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <Panel className="flex flex-col items-center justify-center border-dashed border-slate-300 bg-slate-50/50 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm ring-1 ring-slate-200">
        <Info className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold text-accent-slate">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
    </Panel>
  );
}