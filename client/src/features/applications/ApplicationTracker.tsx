import { Check } from "lucide-react";
import {
  APPLICATION_STATUS_FLOW,
  APPLICATION_STATUS_LABELS,
} from "@/constants";
import { ApplicationStatus } from "@/types";

export default function ApplicationTracker({
  status,
}: {
  status: ApplicationStatus;
}) {
  if (status === "REJECTED") {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <span className="badge bg-slate-100 text-slate-700">Applied</span>
        <span>→</span>
        <span className="badge bg-red-100 text-red-700">Rejected</span>
      </div>
    );
  }

  const currentIndex = APPLICATION_STATUS_FLOW.indexOf(status);

  return (
    <div className="flex items-center gap-2 overflow-x-auto text-sm">
      {APPLICATION_STATUS_FLOW.map((step, index) => {
        const reached = index <= currentIndex;
        return (
          <div key={step} className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                reached
                  ? "bg-brand-100 text-brand-700"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {reached && <Check className="h-3 w-3" />}
              {APPLICATION_STATUS_LABELS[step]}
            </span>
            {index < APPLICATION_STATUS_FLOW.length - 1 && (
              <span className="text-slate-300">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
