import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20" style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <div className="mx-auto max-w-6xl px-5 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <span className="font-display text-xl">Style-N-Fashion</span>
          <p className="mt-3 text-sm" style={{ color: "var(--thread)" }}>
            Browse our design catalog for inspiration, then visit us in person
            to place your order and get measured.
          </p>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-wide mb-3" style={{ color: "var(--marigold)" }}>
            Visit the shop
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--thread)" }}>
            Suresh H N<br />
            1/1, 6th Cross, Thungabhadra St, Stage 1,<br />
            Teachers Colony, Chandra Layout, Nagarbhavi<br />
            Bengaluru, Karnataka 560072<br />
            +91 94486 86569<br />
            Mon–Sat · 10:00 AM – 10:00 PM · Sunday Closed
          </p>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-wide mb-3" style={{ color: "var(--marigold)" }}>
            Explore
          </h3>
          <ul className="space-y-2 text-sm" style={{ color: "var(--thread)" }}>
            <li><Link href="/search" className="stitch-link">Search designs</Link></li>
            <li><Link href="/blouse" className="stitch-link">Blouse designs</Link></li>
            <li><Link href="/kurti" className="stitch-link">Kurti designs</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "#3a332e" }}>
        <div className="mx-auto max-w-6xl px-5 py-4 text-xs flex justify-between" style={{ color: "var(--thread)" }}>
          <span>© {new Date().getFullYear()} Style-N-Fashion. All designs shown are our own work.</span>
          <Link href="/admin/login" className="stitch-link">Admin</Link>
        </div>
      </div>
    </footer>
  );
}