import Link from "next/link";
import type { Metadata } from "next";
import { CheckoutButton } from "@/components/pricing/CheckoutButton";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "Pricing — Kitly",
  description: "Simple pricing for micro-influencers. Monthly or one-time.",
};

const FREE_FEATURES = [
  "1 media kit",
  "Manual stat entry",
  "Basic rate calculator",
];

const PRO_FEATURES = [
  "Unlimited media kits",
  "Screenshot metric import (AI)",
  "Advanced rate calculator",
  "Public shareable kit page",
  "Priority support",
];

const LIFETIME_FEATURES = [
  "Everything in Pro",
  "Pay once, yours forever",
  "All future updates",
  "No recurring fees",
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Pricing that scales with you
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
          Start free. Upgrade when brands start sliding into your DMs.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
        {/* Free */}
        <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold">Free</h2>
          <p className="mt-2 text-sm text-zinc-500">For getting started.</p>
          <p className="mt-6">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-zinc-500"> /forever</span>
          </p>
          <ul className="mt-6 flex-1 space-y-3 text-sm">
            {FREE_FEATURES.map((f) => (
              <Feature key={f}>{f}</Feature>
            ))}
          </ul>
          <Link
            href="/signup"
            className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-lg border border-zinc-300 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Get started
          </Link>
        </div>

        {/* Pro — monthly subscription */}
        <div className="relative flex flex-col rounded-2xl border-2 border-indigo-500 bg-white p-8 shadow-lg dark:bg-zinc-900">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold text-white">
            Most popular
          </span>
          <h2 className="text-lg font-semibold">Pro</h2>
          <p className="mt-2 text-sm text-zinc-500">For working creators.</p>
          <p className="mt-6">
            <span className="text-4xl font-bold">$12</span>
            <span className="text-zinc-500"> /month</span>
          </p>
          <ul className="mt-6 flex-1 space-y-3 text-sm">
            {PRO_FEATURES.map((f) => (
              <Feature key={f}>{f}</Feature>
            ))}
          </ul>
          <div className="mt-8">
            <CheckoutButton
              plan="monthly"
              className="bg-indigo-600 text-white hover:bg-indigo-500"
            >
              Subscribe
            </CheckoutButton>
          </div>
        </div>

        {/* Lifetime — one-time payment */}
        <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold">Lifetime</h2>
          <p className="mt-2 text-sm text-zinc-500">One payment, forever.</p>
          <p className="mt-6">
            <span className="text-4xl font-bold">$199</span>
            <span className="text-zinc-500"> /once</span>
          </p>
          <ul className="mt-6 flex-1 space-y-3 text-sm">
            {LIFETIME_FEATURES.map((f) => (
              <Feature key={f}>{f}</Feature>
            ))}
          </ul>
          <div className="mt-8">
            <CheckoutButton
              plan="lifetime"
              className="bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Buy lifetime
            </CheckoutButton>
          </div>
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-zinc-500">
        Payments are securely processed by Stripe. Cancel anytime.
      </p>
      </main>
    </>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <svg
        className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.5 7.6a1 1 0 0 1-1.42.006l-3.5-3.5a1 1 0 1 1 1.414-1.414l2.79 2.79 6.796-6.886a1 1 0 0 1 1.414-.006Z"
          clipRule="evenodd"
        />
      </svg>
      <span>{children}</span>
    </li>
  );
}
