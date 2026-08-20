import { Job } from "@/types";

export default function SalaryDisplay({
  job,
}: {
  job: Pick<Job, "salaryMin" | "salaryMax" | "currency">;
}) {
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  });
  return (
    <span>
      {job.currency} {formatter.format(job.salaryMin)} –{" "}
      {formatter.format(job.salaryMax)}
    </span>
  );
}
