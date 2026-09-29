import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2026-03-25.acacia" as unknown as Stripe.LatestApiVersion,
      typescript: true
    })
  : null;

export interface PlanConfig {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  stripePriceIdMonthly?: string;
  stripePriceIdAnnual?: string;
  features: string[];
}

export const SUBSCRIPTION_PLANS: Record<string, PlanConfig> = {
  starter: {
    id: "starter",
    name: "Starter",
    priceMonthly: 0,
    priceAnnual: 0,
    features: ["5 Workspaces", "10k Groq Tokens/mo", "Basic Governance", "Community Support"]
  },
  pro: {
    id: "pro",
    name: "Pro Scale",
    priceMonthly: 49,
    priceAnnual: 39,
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    features: ["Unlimited Workspaces", "500k Groq Tokens/mo", "Custom Deterministic Linters", "Omnichannel Syndication", "Priority Support"]
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise Dedicated",
    priceMonthly: 249,
    priceAnnual: 199,
    stripePriceIdMonthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY,
    features: ["Dedicated Neon PostgreSQL Instance", "Multi-region LPU Routing", "SSO & SAML / OAuth", "Zero-retention Guarantee SLA", "Dedicated Account Executive"]
  }
};
