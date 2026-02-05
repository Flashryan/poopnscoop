"use client";

import { useState } from "react";

type Props = {
  csrfToken: string;
};

export default function AdminLogoutButton({ csrfToken }: Props) {
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ csrf_token: csrfToken }),
      });
      window.location.href = "/admin/login";
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className="button-secondary" onClick={logout} disabled={loading}>
      {loading ? "Logging out..." : "Log out"}
    </button>
  );
}
