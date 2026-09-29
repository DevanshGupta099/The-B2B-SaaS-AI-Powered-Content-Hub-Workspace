import { NextRequest, NextResponse } from "next/server";
import { stripe, SUBSCRIPTION_PLANS } from "@/lib/stripe";
import { serverStore } from "@/lib/server-store";
import { sql, isDatabaseConfigured } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { planId = "pro", billingCycle = "monthly" } = await req.json();

    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      return NextResponse.json({ error: "Invalid subscription plan selected" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://the-b2-b-saa-s-ai-powered-content-h.vercel.app";
    const profile = serverStore.getProfile();

    // If Stripe secret key is configured, create live Stripe Checkout Session
    if (stripe) {
      const priceId = billingCycle === "annual" ? plan.stripePriceIdAnnual : plan.stripePriceIdMonthly;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        customer_email: profile.email,
        line_items: [
          priceId
            ? { price: priceId, quantity: 1 }
            : {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: `Nexus Content OS - ${plan.name} Plan`,
                    description: plan.features.join(", ")
                  },
                  unit_amount: (billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly) * 100,
                  recurring: {
                    interval: billingCycle === "annual" ? "year" : "month"
                  }
                },
                quantity: 1
              }
        ],
        success_url: `${appUrl}/dashboard?payment=success&plan=${planId}`,
        cancel_url: `${appUrl}/pricing?payment=cancelled`,
        metadata: {
          userId: profile.id,
          planId,
          workspaceName: profile.name
        }
      });

      return NextResponse.json({ url: session.url });
    }

    // Dev/Sandbox simulated checkout fallback: Record subscription in Neon DB
    if (sql && isDatabaseConfigured()) {
      try {
        await sql`
          INSERT INTO subscriptions (id, user_id, tier, status, current_period_end)
          VALUES (
            ${`sub_${Date.now()}`},
            ${profile.id},
            ${planId},
            'active',
            NOW() + INTERVAL '30 days'
          )
          ON CONFLICT (id) DO UPDATE SET tier = EXCLUDED.tier, status = 'active';
        `;
      } catch (err) {
        console.warn("Neon subscription insert fallback:", err);
      }
    }

    // Direct redirect back to dashboard with active tier
    return NextResponse.json({
      url: `${appUrl}/dashboard?payment=success&plan=${planId}&mode=sandbox`,
      simulated: true,
      message: `Successfully provisioned ${plan.name} plan.`
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to initiate Stripe checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
