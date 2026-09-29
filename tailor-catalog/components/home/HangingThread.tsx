"use client";

import { useEffect, useRef } from "react";

function SewingButton({ y }: { y: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <circle r="9" fill="var(--paper)" stroke="var(--maroon)" strokeWidth="1.4" />
      <circle cx="-3" cy="-3" r="1.1" fill="var(--maroon)" />
      <circle cx="3" cy="-3" r="1.1" fill="var(--maroon)" />
      <circle cx="-3" cy="3" r="1.1" fill="var(--maroon)" />
      <circle cx="3" cy="3" r="1.1" fill="var(--maroon)" />
    </g>
  );
}

export default function HangingThread() {
  const groupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const group = groupRef.current;
    if (!group) return;

    let raf = 0;
    let t = 0;
    let targetTilt = 0;
    let currentTilt = 0;

    function handleMove(e: MouseEvent) {
      const rect = group!.ownerSVGElement!.getBoundingClientRect();
      const anchorX = rect.left + rect.width / 2;
      const anchorY = rect.top;
      const dx = e.clientX - anchorX;
      const dy = e.clientY - anchorY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - distance / 260);
      targetTilt = Math.max(-14, Math.min(14, (dx / 40) * influence));
    }
    window.addEventListener("mousemove", handleMove);

    function tick() {
      t += 0.012;
      const idleSway = Math.sin(t) * 3.5;
      currentTilt += (targetTilt - currentTilt) * 0.06;
      group!.style.transform = `rotate(${idleSway + currentTilt}deg)`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <div className="hanging-thread hidden md:block" aria-hidden="true">
      <svg viewBox="0 0 80 220" width="80" height="220" overflow="visible">
        <g ref={groupRef} style={{ transformOrigin: "40px 0px" }}>
          <line x1="40" y1="0" x2="40" y2="190" stroke="var(--thread)" strokeWidth="1.6" />
          <g transform="translate(40 70)"><SewingButton y={0} /></g>
          <g transform="translate(40 130)"><SewingButton y={0} /></g>
          <g transform="translate(40 190)"><SewingButton y={0} /></g>
        </g>
      </svg>
    </div>
  );
}