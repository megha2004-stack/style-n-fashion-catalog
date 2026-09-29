import { getDashboardStats } from "@/services/designService";

function SpoolIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="14" y="8" width="20" height="32" rx="3" stroke="var(--teal)" strokeWidth="2.5" />
      <path d="M14 16 Q24 20 34 16 M14 24 Q24 28 34 24 M14 32 Q24 36 34 32" stroke="var(--marigold-dark)" strokeWidth="2" fill="none" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M6 22 L22 6 H38 A4 4 0 0 1 42 10 V26 L26 42 A4 4 0 0 1 20 42 L6 28 A4 4 0 0 1 6 22 Z" stroke="var(--maroon)" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="30" cy="18" r="3" fill="var(--marigold)" />
    </svg>
  );
}

export default async function AdminDashboard() {
  const { total, categories } = await getDashboardStats();

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <SpoolIcon />
        <h1 className="font-display text-3xl">Dashboard</h1>
      </div>

      <div
        className="inline-flex items-center gap-4 rounded-xl border bg-white px-6 py-4 mb-10"
        style={{ borderColor: "var(--thread-light)" }}
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: "var(--thread-light)" }}
        >
          <TagIcon />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide" style={{ color: "var(--ink-soft)" }}>
            Total designs
          </p>
          <p className="font-display text-4xl">{total}</p>
        </div>
      </div>

      <hr className="seam mb-6" style={{ maxWidth: "480px" }} />

      <h2 className="font-display text-xl mb-4">By category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border bg-white p-4 border-l-4"
            style={{ borderColor: "var(--thread-light)", borderLeftColor: "var(--marigold)" }}
          >
            <p className="text-sm">{c.name}</p>
            <p className="font-display text-2xl">{c._count.designs}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
