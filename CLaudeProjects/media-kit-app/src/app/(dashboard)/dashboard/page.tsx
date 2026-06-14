import { MetricsUploader } from "@/components/dashboard/MetricsUploader";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-500">
          Drop a screenshot of your platform insights and we&apos;ll pull your
          stats into your media kit automatically.
        </p>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-1 text-lg font-semibold">Import metrics from a screenshot</h2>
        <p className="mb-5 text-sm text-zinc-500">
          Upload your Instagram, TikTok, or YouTube analytics view.
        </p>
        <MetricsUploader />
      </section>
    </div>
  );
}
