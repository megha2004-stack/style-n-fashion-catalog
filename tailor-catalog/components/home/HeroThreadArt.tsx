export default function HeroThreadArt() {
  return (
    <div className="hero-thread-art hidden md:block" aria-hidden="true">
      <svg viewBox="0 0 320 220" width="100%" height="220" fill="none">
        {/* Needle, resting at the top */}
        <g className="needle-group" style={{ transformOrigin: "60px 40px" }}>
          <line x1="30" y1="30" x2="120" y2="60" stroke="var(--ink-soft)" strokeWidth="2" strokeLinecap="round" />
          <path d="M120 60 L136 65" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" />
          <ellipse cx="46" cy="35" rx="5" ry="2.6" fill="none" stroke="var(--paper)" strokeWidth="1.8" transform="rotate(18 46 35)" />
          <ellipse cx="46" cy="35" rx="5" ry="2.6" fill="none" stroke="var(--ink-soft)" strokeWidth="0.9" transform="rotate(18 46 35)" />
        </g>

        {/* Thread — a long, light, elegant curve trailing down and across */}
        <path
          className="thread-line thread-line-1"
          d="M40 34 C 90 60, 60 110, 120 130 S 220 120, 200 170 S 90 210, 150 195"
          stroke="var(--thread)"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          className="thread-line thread-line-2"
          d="M40 34 C 100 50, 40 100, 110 140 S 240 150, 190 190"
          stroke="var(--marigold)"
          strokeOpacity="0.5"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}