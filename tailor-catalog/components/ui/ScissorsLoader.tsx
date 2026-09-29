export default function ScissorsLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="scissors-loader-wrap" role="status" aria-label={label}>
      <svg
        className="scissors-loader-svg"
        width="220"
        height="56"
        viewBox="0 0 220 56"
        fill="none"
      >
        {/* the thread — precise dash segments via stroke-dasharray, so
            the reveal can cut it one segment at a time */}
        <line
          x1="14"
          y1="28"
          x2="206"
          y2="28"
          stroke="var(--thread)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="13 9"
        />

        {/* paper-colored mask, widens in discrete steps (not a smooth
            fade) so each step reads as one snip removing one dash */}
        <rect className="scissors-cut-mask" x="0" y="0" width="0" height="56" fill="var(--paper)" />

        {/* everything below is positioned at y=28 to match the thread's
            height, so the blade tips actually meet the line instead of
            floating above it */}
        <g transform="translate(0 28)">
          <g className="scissors-travel">
            <line x1="10" y1="0" x2="24" y2="-9" stroke="#c94a58" strokeWidth="3.2" strokeLinecap="round" />
            <line x1="10" y1="0" x2="24" y2="9" stroke="#c94a58" strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="26" cy="-11" r="6.2" fill="none" stroke="#e2626d" strokeWidth="3.4" />
            <circle cx="26" cy="11" r="6.2" fill="none" stroke="#e2626d" strokeWidth="3.4" />

            <g className="scissors-blade scissors-blade-top">
              <path d="M10 0 L-16 -6.5 L-14 -3 L2 1.5 Z" fill="#e2626d" />
            </g>
            <g className="scissors-blade scissors-blade-bottom">
              <path d="M10 0 L-16 6.5 L-14 3 L2 -1.5 Z" fill="#e2626d" />
            </g>

            <circle cx="10" cy="0" r="2.4" fill="#a8354a" />
          </g>
        </g>
      </svg>

      {label && (
        <p className="mt-3 text-xs" style={{ color: "var(--ink-soft)" }}>
          {label}…
        </p>
      )}
    </div>
  );
}