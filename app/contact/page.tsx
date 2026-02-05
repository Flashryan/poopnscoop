import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Poop n Scoop | Contact | Wolverhampton",
  description: "Get in touch with Poop n Scoop.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="section-title">Contact</h1>
      <p className="mt-3 text-ink/70">
        For questions or updates, email us and we’ll respond quickly.
      </p>
      <div className="mt-6 card p-6">
        <p className="text-sm text-ink/70">Email: hello@poopnscoop.co.uk</p>
      </div>
    </main>
  );
}
