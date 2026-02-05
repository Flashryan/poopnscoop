import nodemailer from "nodemailer";
import { getEnv } from "@/lib/env";
import { EmailPayload } from "@/lib/email";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  const env = getEnv();
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ? Number(env.SMTP_PORT) : 587,
    auth: env.SMTP_USER
      ? {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        }
      : undefined,
  });
  return transporter;
}

export async function sendSmtp(payload: EmailPayload) {
  const env = getEnv();
  const mailer = getTransporter();
  await mailer.sendMail({
    from: env.EMAIL_FROM,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });
}
