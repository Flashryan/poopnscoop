import { Enquiry } from "@prisma/client";

export function customerNeedsReviewEmail(enquiry: Enquiry) {
  const subject = "We’re confirming availability";
  const text = `Hi ${enquiry.full_name},\n\nThanks for your enquiry. We’re confirming availability for ${enquiry.postcode} and will send a payment link shortly.\n\nReference: ${enquiry.id}`;
  const html = `<p>Hi ${enquiry.full_name},</p><p>Thanks for your enquiry. We’re confirming availability for ${enquiry.postcode} and will send a payment link shortly.</p><p><strong>Reference:</strong> ${enquiry.id}</p>`;
  return { subject, text, html };
}

export function customerPaymentConfirmedEmail(enquiry: Enquiry) {
  const subject = "Payment received — booking confirmed";
  const text = `Hi ${enquiry.full_name},\n\nThanks for your payment. Your booking is confirmed. We’ll follow up shortly with next steps.\n\nReference: ${enquiry.id}`;
  const html = `<p>Hi ${enquiry.full_name},</p><p>Thanks for your payment. Your booking is confirmed. We’ll follow up shortly with next steps.</p><p><strong>Reference:</strong> ${enquiry.id}</p>`;
  return { subject, text, html };
}

export function customerOfflinePaymentEmail(
  enquiry: Enquiry,
  paymentMethod: string,
) {
  const methodLabel =
    paymentMethod === "cash" ? "cash on the day" : "bank transfer";
  const subject = "Booking received — next steps";
  const text = `Hi ${enquiry.full_name},\n\nThanks for your booking. You've chosen to pay by ${methodLabel}. We'll be in touch shortly with details.\n\nReference: ${enquiry.id}`;
  const html = `<p>Hi ${enquiry.full_name},</p><p>Thanks for your booking. You've chosen to pay by ${methodLabel}. We'll be in touch shortly with details.</p><p><strong>Reference:</strong> ${enquiry.id}</p>`;
  return { subject, text, html };
}

export function businessNotificationEmail(enquiry: Enquiry) {
  const subject = `New enquiry (${enquiry.serviceability_decision})`;
  const method = enquiry.payment_method ?? "—";
  const text = `New enquiry received.\n\nName: ${enquiry.full_name}\nPostcode: ${enquiry.postcode}\nPlan: ${enquiry.plan_type}\nExtras: ${enquiry.extra_visits}\nPayment method: ${method}\nPayment status: ${enquiry.payment_status}\n\nReference: ${enquiry.id}`;
  const html = `<p>New enquiry received.</p><ul><li>Name: ${enquiry.full_name}</li><li>Postcode: ${enquiry.postcode}</li><li>Plan: ${enquiry.plan_type}</li><li>Extras: ${enquiry.extra_visits}</li><li>Payment method: ${method}</li><li>Payment status: ${enquiry.payment_status}</li></ul><p><strong>Reference:</strong> ${enquiry.id}</p>`;
  return { subject, text, html };
}
