import { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = "text-brand-600",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: string;
}) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`rounded-lg bg-slate-50 p-3 ${accent}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
