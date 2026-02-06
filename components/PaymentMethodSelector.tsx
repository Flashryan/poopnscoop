"use client";

export type PaymentMethodOption = "online" | "bank_transfer" | "cash";

type Props = {
  selected: PaymentMethodOption | null;
  onSelect: (method: PaymentMethodOption) => void;
  onConfirm: () => void;
  loading?: boolean;
};

const options: {
  value: PaymentMethodOption;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "cash",
    label: "Cash",
    description: "Pay on the day of your visit",
    icon: "💷",
  },
  {
    value: "bank_transfer",
    label: "Bank Transfer",
    description: "We\u2019ll send you payment details",
    icon: "🏦",
  },
  {
    value: "online",
    label: "Pay Online",
    description: "Secure card payment via Stripe",
    icon: "💳",
  },
];

export default function PaymentMethodSelector({
  selected,
  onSelect,
  onConfirm,
  loading,
}: Props) {
  return (
    <div className="mt-6 grid gap-4">
      <h3 className="font-display text-lg">How would you like to pay?</h3>
      <div className="grid gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
              selected === opt.value
                ? "border-[#1a4f3b] bg-[#d4e7c5]/20"
                : "border-stone-200 bg-white hover:border-stone-300"
            }`}
            onClick={() => onSelect(opt.value)}
          >
            <span className="text-2xl">{opt.icon}</span>
            <div>
              <div className="font-medium">{opt.label}</div>
              <div className="text-sm text-ink/60">{opt.description}</div>
            </div>
          </button>
        ))}
      </div>
      <button
        className="button-primary"
        type="button"
        onClick={onConfirm}
        disabled={!selected || loading}
      >
        {loading ? "Processing..." : "Confirm & proceed"}
      </button>
    </div>
  );
}
