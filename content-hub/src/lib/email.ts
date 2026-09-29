import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.EMAIL_FROM || "Nexus Content OS <notifications@nexus-os.ai>";

export interface EmailResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

/**
 * Enterprise Transactional Email Service
 * Powers Welcome Onboarding, Magic Links, Password Resets, and Governance Alerts
 */
export const emailService = {
  async sendWelcomeEmail(to: string, name: string, workspaceName: string): Promise<EmailResult> {
    const subject = `Welcome to ${workspaceName} on Nexus Content OS`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="margin-bottom: 24px;">
          <span style="background-color: #4f46e5; color: #ffffff; padding: 6px 12px; border-radius: 8px; font-weight: bold; font-size: 14px;">NEXUS</span>
        </div>
        <h1 style="color: #0f172a; font-size: 24px; font-weight: 700; margin-bottom: 12px;">Welcome to your Governed AI Workspace</h1>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">Hello ${name},</p>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">Your workspace <strong>${workspaceName}</strong> is active and connected to dedicated Groq Qwen LPUs and Hugging Face 384d semantic vectors.</p>
        <div style="margin: 28px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://the-b2-b-saa-s-ai-powered-content-h.vercel.app"}/dashboard" style="background-color: #020617; color: #ffffff; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-block;">Open Workspace Dashboard &rarr;</a>
        </div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">Zero Data Retention active. Deterministic brand linters protecting all generated assets.</p>
      </div>
    `;

    if (!resend) {
      console.log(`[Email Simulator] Sent Welcome Email to ${to}`);
      return { success: true, simulated: true, messageId: `sim_${Date.now()}` };
    }

    try {
      const res = await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html
      });
      return { success: true, messageId: res.data?.id };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: message };
    }
  },

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<EmailResult> {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://the-b2-b-saa-s-ai-powered-content-h.vercel.app"}/reset-password?token=${resetToken}&email=${encodeURIComponent(to)}`;
    const subject = "Reset your Nexus Content OS password";
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-bottom: 12px;">Password Reset Request</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">We received a request to reset your password for Nexus Content OS. Click the button below to proceed:</p>
        <div style="margin: 24px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-block;">Reset Password &rarr;</a>
        </div>
        <p style="color: #94a3b8; font-size: 12px;">This link will expire in 60 minutes. If you did not request this reset, you can safely ignore this email.</p>
      </div>
    `;

    if (!resend) {
      console.log(`[Email Simulator] Sent Password Reset Email to ${to}: ${resetUrl}`);
      return { success: true, simulated: true, messageId: `sim_reset_${Date.now()}` };
    }

    try {
      const res = await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html
      });
      return { success: true, messageId: res.data?.id };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: message };
    }
  },

  async sendGovernanceAlert(to: string, documentTitle: string, score: number, breaches: string[]): Promise<EmailResult> {
    const subject = `[Action Required] Brand Governance Alert for "${documentTitle}"`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #fecdd3; border-radius: 16px; background-color: #fff1f2;">
        <h2 style="color: #9f1239; font-size: 18px; font-weight: 700; margin-bottom: 12px;">Brand Governance SLA Alert</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">Document <strong>${documentTitle}</strong> scored <strong>${score}%</strong>, triggering a review flag.</p>
        <ul style="color: #881337; font-size: 13px;">
          ${breaches.map(b => `<li>${b}</li>`).join("")}
        </ul>
      </div>
    `;

    if (!resend) {
      console.log(`[Email Simulator] Sent Governance Alert to ${to} for ${documentTitle}`);
      return { success: true, simulated: true, messageId: `sim_gov_${Date.now()}` };
    }

    try {
      const res = await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html
      });
      return { success: true, messageId: res.data?.id };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: message };
    }
  }
};
