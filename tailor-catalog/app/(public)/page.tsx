import Hero from "@/components/home/Hero";
import DesignGrid from "@/components/design/DesignGrid";
import ThreadTexture from "@/components/home/ThreadTexture";
import { findDesigns } from "@/lib/search";

function MeasuringTapeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="18" stroke="var(--maroon)" strokeWidth="2.5" />
      <path d="M24 6 V12 M42 24 H36 M24 42 V36 M6 24 H12" stroke="var(--maroon)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="5" fill="var(--marigold)" />
    </svg>
  );
}

function ThreadSpoolIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="14" y="8" width="20" height="32" rx="3" stroke="var(--teal)" strokeWidth="2.5" />
      <path d="M14 16 Q24 20 34 16 M14 24 Q24 28 34 24 M14 32 Q24 36 34 32" stroke="var(--marigold-dark)" strokeWidth="2" fill="none" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M6 22 L22 6 H38 A4 4 0 0 1 42 10 V26 L26 42 A4 4 0 0 1 20 42 L6 28 A4 4 0 0 1 6 22 Z" stroke="var(--maroon)" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="30" cy="18" r="3" fill="var(--marigold)" />
    </svg>
  );
}

export default async function HomePage() {
  const latest = await findDesigns({ sort: "newest", pageSize: 12 });

  return (
    <main>
      <Hero />

      <section className="relative mx-auto max-w-6xl px-5 pt-4 pb-6 md:pt-6 md:pb-10">
        <ThreadTexture />
        <div className="relative" style={{ zIndex: 1 }}>
          <h2 className="font-display text-xl md:text-2xl mb-4 md:mb-6">Latest designs</h2>
          <DesignGrid designs={latest.designs} />
        </div>
      </section>

      <hr className="seam mx-5 md:mx-auto md:max-w-6xl" />

      <section className="mx-auto max-w-6xl px-5 py-10 md:py-14 grid gap-6 md:gap-8 md:grid-cols-3">
        <div>
          <MeasuringTapeIcon />
          <h3 className="font-display text-lg mt-2 mb-2">Made to your measurements</h3>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Every design here is stitched fresh to fit you — nothing is
            pre-made or sold off the rack.
          </p>
        </div>
        <div>
          <ThreadSpoolIcon />
          <h3 className="font-display text-lg mt-2 mb-2">Decades of experience</h3>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Style-N-Fashion is run by Suresh H N, serving Nagarbhavi and
            the surrounding neighborhoods with quality tailoring.
          </p>
        </div>
        <div>
          <TagIcon />
          <h3 className="font-display text-lg mt-2 mb-2">Fair, upfront pricing</h3>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Ask in-store for stitching charges — they vary by fabric and
            work involved.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-14 md:pb-16 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-xl md:text-2xl mb-4">Visit us</h2>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Suresh H N<br />
            1/1, 6th Cross, Thungabhadra St, Stage 1, Teachers Colony,<br />
            Chandra Layout, Nagarbhavi, Bengaluru, Karnataka 560072<br />
            +91 94486 86569<br />
            Mon–Sat · 10:00 AM – 10:00 PM<br />
            Sunday · Closed
          </p>
        </div>
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--thread-light)" }}>
          {/*
            Exact coordinates pulled from your Google Maps link
            (12.9584949, 77.5166101) — this pins the real shop location,
            not a guessed address search.
          */}
          <iframe
            title="Shop location"
            src="https://www.google.com/maps?q=12.9584949,77.5166101&z=17&output=embed"
            width="100%"
            height="280"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
}