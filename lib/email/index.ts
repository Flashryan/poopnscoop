import { getEnv } from "@/lib/env";
import { sendResend } from "@/lib/email/resend";
import { sendSmtp } from "@/lib/email/smtp";

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendEmail(payload: EmailPayload) {
  const env = getEnv();
  const useResend = Boolean(env.RESEND_API_KEY);
  const useSmtp = Boolean(env.SMTP_HOST && env.SMTP_PORT);

  if (!useResend && !useSmtp) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("email_provider_not_configured");
    }
    console.warn("[email] No provider configured. Email payload:", {
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
    });
    return;
  }

  if (useResend) {
    await sendResend(payload);
    return;
  }

  await sendSmtp(payload);
}
