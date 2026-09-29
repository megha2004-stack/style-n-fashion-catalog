"use client";

import { logoutAction } from "@/app/(admin)/admin/actions";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="stitch-link" style={{ color: "var(--maroon)" }}>
        Sign out
      </button>
    </form>
  );
}
