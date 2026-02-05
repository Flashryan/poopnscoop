"use client";

import { useState } from "react";

const statuses = ["New", "Contacted", "Converted", "Closed"] as const;

type Props = {
  enquiryId: string;
  currentStatus: string;
  csrfToken: string;
};

export default function AdminStatusForm({
  enquiryId,
  currentStatus,
  csrfToken,
}: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [message, setMessage] = useState<string | null>(null);

  async function update() {
    setMessage(null);
    const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
      method: "PATCH",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ lead_status: status }),
    });
    if (!res.ok) {
      const data = await res.json();
      setMessage(data?.message ?? "Failed to update status.");
      return;
    }
    setMessage("Status updated.");
  }

  return (
    <div className="mt-4 grid gap-2">
      <label className="text-sm text-ink/70">Lead status</label>
      <div className="flex items-center gap-3">
        <select
          className="rounded border border-fog bg-white px-2 py-1"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {statuses.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <button className="button-secondary" onClick={update}>
          Update
        </button>
      </div>
      {message && <div className="text-sm text-ink/70">{message}</div>}
    </div>
  );
}
