import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, getPriceId, planToMode, type Plan } from "@/lib/stripe/client";

export const runtime = "nodejs";

function siteUrl(request: NextRequest) {
  return process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
}

export async function POST(request: NextRequest) {
  // Must be signed in — we tie the Stripe customer to the Supabase user.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let plan: Plan;
  try {
    ({ plan } = (await request.json()) as { plan: Plan });
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const priceId = getPriceId(plan);
  if (!priceId) {
    return NextResponse.json(
      { error: "That plan is not available or is not configured." },
      { status: 400 },
    );
  }

  // Reuse an existing Stripe customer if we already have one for this user.
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  const mode = planToMode(plan);
  const base = siteUrl(request);

  try {
    const session = await getStripe().checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      customer: profile?.stripe_customer_id ?? undefined,
      customer_email: profile?.stripe_customer_id ? undefined : (user.email ?? undefined),
      client_reference_id: user.id,
      metadata: { userId: user.id, plan },
      // Mirror the user id onto the subscription so subscription.* events can
      // be traced back even without the checkout session.
      ...(mode === "subscription"
        ? { subscription_data: { metadata: { userId: user.id } } }
        : {}),
      success_url: `${base}/dashboard?checkout=success`,
      cancel_url: `${base}/pricing?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
