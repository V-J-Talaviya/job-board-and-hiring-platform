import { ReactNode } from "react";

export default function ChartCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="card p-5">
      <h3 className="mb-4 font-semibold text-slate-900">{title}</h3>
      {children}
    </div>
  );
}
