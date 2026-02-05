export default function CheckoutCancelPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="section-title">Payment cancelled</h1>
      <p className="mt-3 text-ink/70">
        Your payment was cancelled. You can try again anytime or contact us if
        you’d like help completing your booking.
      </p>
      <div className="mt-6">
        <a className="button-primary" href="/">
          Return home
        </a>
      </div>
    </main>
  );
}
