import { Inbox } from "lucide-react";

export default function EmptyState({
  title,
  message,
}: {
  title: string;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center">
      <Inbox className="h-8 w-8 text-slate-400" />
      <p className="font-medium text-slate-700">{title}</p>
      {message && <p className="max-w-sm text-sm text-slate-500">{message}</p>}
    </div>
  );
}
