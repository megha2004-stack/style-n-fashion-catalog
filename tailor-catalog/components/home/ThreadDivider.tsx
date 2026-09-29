export default function ThreadDivider() {
  return (
    <div className="w-full overflow-hidden" style={{ height: "48px" }} aria-hidden="true">
      <svg viewBox="0 0 800 48" width="100%" height="48" preserveAspectRatio="none">
        {/* The needle: body, point, and the eye it threads through */}
        <g transform="translate(10 24) rotate(-8)">
          <line x1="0" y1="0" x2="42" y2="0" stroke="var(--ink-soft)" strokeWidth="3" strokeLinecap="round" />
          <path d="M42 0 L52 0" stroke="var(--ink-soft)" strokeWidth="3" strokeLinecap="round" />
          <path d="M52 0 L58 0" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="10" cy="0" rx="4.5" ry="2.4" fill="none" stroke="var(--paper)" strokeWidth="1.6" />
          <ellipse cx="10" cy="0" rx="4.5" ry="2.4" fill="none" stroke="var(--ink-soft)" strokeWidth="1" />
        </g>

        {/* Thread already through the eye — static short segment */}
        <path d="M20 22 Q30 30 40 24" stroke="var(--maroon)" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Thread flowing onward in a stitched wave — this part animates,
            so it reads as the thread continuously being pulled through */}
        <path
          className="thread-flow"
          d="M40 24 Q80 4 120 24 T200 24 T280 24 T360 24 T440 24 T520 24 T600 24 T680 24 T760 24 T840 24"
          stroke="var(--maroon)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="9 7"
        />
      </svg>
    </div>
  );
}