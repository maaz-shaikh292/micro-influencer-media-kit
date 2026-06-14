import type { ExtractedMetrics } from "@/types";
import { formatCompact } from "@/lib/utils";

const FIELDS: Array<{ key: keyof ExtractedMetrics; label: string; suffix?: string }> = [
  { key: "followers", label: "Followers" },
  { key: "following", label: "Following" },
  { key: "posts", label: "Posts" },
  { key: "reach", label: "Reach" },
  { key: "impressions", label: "Impressions" },
  { key: "engagementRate", label: "Engagement", suffix: "%" },
  { key: "avgLikes", label: "Avg. Likes" },
  { key: "avgComments", label: "Avg. Comments" },
  { key: "profileVisits", label: "Profile Visits" },
];

export function MetricsResult({ metrics }: { metrics: ExtractedMetrics }) {
  const rows = FIELDS.filter((f) => typeof metrics[f.key] === "number");

  if (!metrics.detected) {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
        That doesn&apos;t look like an analytics screenshot. Try uploading your
        platform&apos;s insights/analytics view.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          {metrics.platform}
        </span>
        {metrics.periodLabel && (
          <span className="text-xs text-zinc-500">{metrics.periodLabel}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {rows.map((f) => {
          const value = metrics[f.key] as number;
          return (
            <div
              key={f.key}
              className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                {f.label}
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                {f.suffix === "%" ? value.toLocaleString() : formatCompact(value)}
                {f.suffix && <span className="text-base text-zinc-400">{f.suffix}</span>}
              </p>
            </div>
          );
        })}
      </div>

      {metrics.notes && (
        <p className="text-sm text-zinc-500">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Note:</span>{" "}
          {metrics.notes}
        </p>
      )}
    </div>
  );
}
