import HangingThread from "./HangingThread";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-8 pb-2 md:pt-16 md:pb-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <svg width="34" height="34" viewBox="0 0 48 48" fill="none" aria-hidden="true" className="shrink-0">
              <circle cx="16" cy="32" r="9" stroke="var(--maroon)" strokeWidth="2.5" />
              <path d="M22 26 L40 8" stroke="var(--marigold-dark)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M31 17 L40 8 L40 17 Z" fill="var(--marigold)" />
              <path d="M6 12 Q12 6 18 12 T30 12" stroke="var(--teal)" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
            <h1 className="font-display text-4xl md:text-6xl leading-none" style={{ color: "var(--ink)" }}>
              Style-N-Fashion
            </h1>
          </div>

          <span
            className="inline-block text-xs font-medium px-3 py-1.5 rounded-full mb-5"
            style={{ background: "var(--maroon)", color: "var(--paper)" }}
          >
            CUSTOM TAILORING · NAGARBHAVI, BENGALURU
          </span>

          <p className="max-w-xl text-base md:text-xl leading-relaxed" style={{ color: "var(--ink-soft)" }}>
            Browse our full catalog of blouse, kurti, chudidar and gown
            designs — then visit us and we&rsquo;ll stitch it to your measurements.
          </p>
        </div>

        <HangingThread />
      </div>

      <hr className="seam mt-6" />
    </section>
  );
}