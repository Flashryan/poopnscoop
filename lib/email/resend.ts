import { Resend } from "resend";
import { getEnv } from "@/lib/env";
import { EmailPayload } from "@/lib/email";

let client: Resend | null = null;

function getClient() {
  if (client) return client;
  const env = getEnv();
  client = new Resend(env.RESEND_API_KEY);
  return client;
}

export async function sendResend(payload: EmailPayload) {
  const env = getEnv();
  const resend = getClient();

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });
}
