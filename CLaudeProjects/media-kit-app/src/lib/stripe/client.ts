import Stripe from "stripe";

export type Plan = "monthly" | "lifetime";

let _stripe: Stripe | null = null;

/** Lazily-constructed Stripe client so a missing key fails with a clear error. */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set.");
    _stripe = new Stripe(key);
  }
  return _stripe;
}

/** Maps a plan to its configured Stripe Price ID. */
export function getPriceId(plan: Plan): string | undefined {
  if (plan === "monthly") return process.env.STRIPE_PRICE_MONTHLY;
  if (plan === "lifetime") return process.env.STRIPE_PRICE_LIFETIME;
  return undefined;
}

export function planToMode(plan: Plan): "subscription" | "payment" {
  return plan === "monthly" ? "subscription" : "payment";
}

/**
 * The Stripe billing period end moved from the Subscription object to its
 * line items in recent API versions. Read defensively so this keeps working
 * regardless of the account's pinned API version.
 */
export function getPeriodEnd(subscription: Stripe.Subscription): string | null {
  const fromItem = (
    subscription.items?.data?.[0] as unknown as { current_period_end?: number }
  )?.current_period_end;
  const fromRoot = (subscription as unknown as { current_period_end?: number })
    .current_period_end;
  const seconds = fromItem ?? fromRoot;
  return seconds ? new Date(seconds * 1000).toISOString() : null;
}
