"use client";

import { useState } from "react";

export type EnquiryRow = {
  id: string;
  full_name: string;
  postcode: string;
  plan_type: string;
  payment_status: string;
  lead_status: string;
  created_at: string;
};

type Props = {
  enquiries: EnquiryRow[];
  csrfToken: string;
};

const statuses = ["New", "Contacted", "Converted", "Closed"] as const;

export default function AdminTable({ enquiries, csrfToken }: Props) {
  const [rows, setRows] = useState(enquiries);
  const [message, setMessage] = useState<string | null>(null);

  async function updateStatus(id: string, lead_status: string) {
    setMessage(null);
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ lead_status }),
    });
    if (!res.ok) {
      const data = await res.json();
      setMessage(data?.message ?? "Failed to update status.");
      return;
    }
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, lead_status } : row))
    );
    setMessage("Status updated.");
  }

  return (
    <div className="mt-6">
      {message && <div className="mb-3 text-sm text-ink/70">{message}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-ink/60">
            <tr>
              <th className="py-2">Created</th>
              <th className="py-2">Name</th>
              <th className="py-2">Postcode</th>
              <th className="py-2">Plan</th>
              <th className="py-2">Payment</th>
              <th className="py-2">Lead status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-fog">
                <td className="py-3">
                  {new Date(row.created_at).toLocaleDateString()}
                </td>
                <td className="py-3">{row.full_name}</td>
                <td className="py-3">{row.postcode}</td>
                <td className="py-3">{row.plan_type}</td>
                <td className="py-3">{row.payment_status}</td>
                <td className="py-3">
                  <select
                    className="rounded border border-fog bg-white px-2 py-1"
                    value={row.lead_status}
                    onChange={(event) =>
                      updateStatus(row.id, event.target.value)
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3">
                  <a className="text-grass" href={`/admin/enquiries/${row.id}`}>
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
