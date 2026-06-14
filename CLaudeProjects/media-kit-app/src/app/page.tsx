import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
        {/* Ambient gradient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-400/30 to-violet-400/20 blur-3xl dark:from-indigo-600/20 dark:to-violet-600/10"
        />

        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-xs font-medium text-zinc-600 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
            For micro-influencers
          </span>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Your media kit,{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              priced right.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
            Build a polished media kit in minutes and calculate sponsored-content
            rates based on your platform, niche, and engagement.
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-7 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Get started free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 px-7 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              View pricing
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
