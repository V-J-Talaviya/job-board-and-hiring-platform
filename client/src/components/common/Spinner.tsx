import { Loader2 } from "lucide-react";

export default function Spinner({
  full = false,
  label = "Loading...",
}: {
  full?: boolean;
  label?: string;
}) {
  if (full) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">{label}</p>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-slate-500">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
