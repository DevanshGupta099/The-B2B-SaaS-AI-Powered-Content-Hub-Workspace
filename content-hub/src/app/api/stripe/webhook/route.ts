import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sql, isDatabaseConfigured } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ received: true, mode: "unconfigured" });
  }

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing stripe webhook signature or secret" }, { status: 400 });
  }

  try {
    const rawBody = await req.text();
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId || "unknown";
        const planId = session.metadata?.planId || "pro";

        if (sql && isDatabaseConfigured()) {
          await sql`
            INSERT INTO subscriptions (id, user_id, customer_id, subscription_id, tier, status, current_period_end)
            VALUES (
              ${`sub_${session.id}`},
              ${userId},
              ${session.customer as string || null},
              ${session.subscription as string || null},
              ${planId},
              'active',
              NOW() + INTERVAL '30 days'
            )
            ON CONFLICT (id) DO UPDATE SET tier = EXCLUDED.tier, status = 'active';
          `;
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        if (sql && isDatabaseConfigured()) {
          await sql`
            UPDATE subscriptions 
            SET status = 'canceled' 
            WHERE subscription_id = ${subscription.id};
          `;
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true, event: event.type });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook handler failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
