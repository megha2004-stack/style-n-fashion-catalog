import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen flex" style={{ background: "var(--paper)" }}>
      <aside
        className="w-56 shrink-0 border-r p-5 hidden md:block"
        style={{ borderColor: "var(--thread-light)" }}
      >
        <span className="font-display text-xl block mb-8">Style-N-Fashion</span>
        <nav className="flex flex-col gap-3 text-sm">
          <Link href="/admin" className="stitch-link">Dashboard</Link>
          <Link href="/admin/designs" className="stitch-link">Designs</Link>
          <Link href="/admin/designs/new" className="stitch-link">Upload new</Link>
          <Link href="/" className="stitch-link">View site</Link>
        </nav>

        {session && (
          <div className="mt-10 text-xs" style={{ color: "var(--ink-soft)" }}>
            <p className="mb-2">{session.email}</p>
            <LogoutButton />
          </div>
        )}
      </aside>

      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
