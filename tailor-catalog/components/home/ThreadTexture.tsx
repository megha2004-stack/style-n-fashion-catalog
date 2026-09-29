export default function ThreadTexture() {
  return (
    <svg
      className="thread-texture md:hidden"
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <path
        d="M-20 40 C 80 90, 40 160, 160 180 S 340 160, 300 260 S 120 320, 220 380 S 420 420, 380 480"
        stroke="var(--thread)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M-20 120 C 100 150, 60 220, 200 240 S 380 260, 320 340"
        stroke="var(--marigold)"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}