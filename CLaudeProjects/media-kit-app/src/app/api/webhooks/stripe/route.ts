import type Stripe from "stripe";
import { NextResponse, type NextRequest } from "next/server";
import { getStripe, getPeriodEnd } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Missing webhook signature." }, { status: 400 });
  }

  // Stripe needs the raw, unparsed body to verify the signature.
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    return NextResponse.json({ error: `Invalid signature: ${message}` }, { status: 400 });
  }

  const admin = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId ?? session.client_reference_id;
        if (!userId) break;

        if (session.mode === "subscription") {
          const subscription = await getStripe().subscriptions.retrieve(
            session.subscription as string,
          );
          await admin.from("profiles").upsert(
            {
              id: userId,
              tier: "pro",
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscription.id,
              subscription_status: subscription.status,
              current_period_end: getPeriodEnd(subscription),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" },
          );
        } else {
          // One-time payment → lifetime access.
          await admin.from("profiles").upsert(
            {
              id: userId,
              tier: "lifetime",
              stripe_customer_id: session.customer as string,
              subscription_status: "lifetime",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" },
          );
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const active =
          subscription.status === "active" || subscription.status === "trialing";

        // Look up by customer; never downgrade a lifetime purchaser.
        const { data: profile } = await admin
          .from("profiles")
          .select("id, tier")
          .eq("stripe_customer_id", subscription.customer as string)
          .maybeSingle();

        if (profile && profile.tier !== "lifetime") {
          await admin
            .from("profiles")
            .update({
              tier: active ? "pro" : "free",
              subscription_status: subscription.status,
              current_period_end: getPeriodEnd(subscription),
              updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id);
        }
        break;
      }

      default:
        // Unhandled event types are acknowledged so Stripe stops retrying.
        break;
    }
  } catch (error) {
    // Return 500 so Stripe retries delivery.
    const message = error instanceof Error ? error.message : "handler error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
