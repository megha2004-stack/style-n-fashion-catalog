"use client";

import { useEffect, useRef } from "react";

/**
 * Replaces the native cursor with a small needle icon that leads a
 * trailing thread, so it reads as "a needle pulling thread across the
 * page" rather than a generic glowing dot. The needle rotates to face
 * the direction of travel and lags slightly behind the raw mouse
 * position (spring-eased) for a weighted, elegant feel. Hovering any
 * clickable element brightens everything gold and thickens the thread,
 * as if it's been pulled taut against that element.
 *
 * Skips entirely on touch devices and when the OS requests reduced
 * motion — the native cursor is left alone in both cases.
 */
export default function CursorThread() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const canvas = canvasRef.current;
    const needle = needleRef.current;
    if (!canvas || !needle) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    function handleResize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
    }
    window.addEventListener("resize", handleResize);

    type Point = { x: number; y: number };
    const points: Point[] = [];
    const MAX_POINTS = 30;

    let mouseX = width / 2;
    let mouseY = height / 2;
    let hovering = false;
    let hasMoved = false;
    let cursorHidden = false;

    function handleMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        document.documentElement.classList.add("needle-cursor-active");
        cursorHidden = true;
        needle!.style.opacity = "1";
      }
      const target = e.target as HTMLElement;
      hovering = !!target.closest("a, button, [role='button'], input, select, textarea");
    }
    window.addEventListener("mousemove", handleMove);

    function handleLeave() {
      // restore the normal cursor if the pointer leaves the window
      // entirely (e.g. onto browser chrome), so it's never stuck hidden
      if (cursorHidden) {
        document.documentElement.classList.remove("needle-cursor-active");
        needle!.style.opacity = "0";
        cursorHidden = false;
      }
    }
    document.addEventListener("mouseleave", handleLeave);
    window.addEventListener("mouseenter", () => {
      if (hasMoved) {
        document.documentElement.classList.add("needle-cursor-active");
        cursorHidden = true;
        needle!.style.opacity = "1";
      }
    });

    const follower = { x: mouseX, y: mouseY };
    let angle = 0;
    let raf = 0;

    function tick() {
      const prevX = follower.x;
      const prevY = follower.y;
      follower.x += (mouseX - follower.x) * 0.2;
      follower.y += (mouseY - follower.y) * 0.2;

      const dx = follower.x - prevX;
      const dy = follower.y - prevY;
      if (dx * dx + dy * dy > 0.05) {
        angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      }

      if (hasMoved) {
        points.push({ x: follower.x, y: follower.y });
        if (points.length > MAX_POINTS) points.shift();
      }

      ctx!.clearRect(0, 0, width, height);

      const threadColor = hovering ? "198, 138, 46" : "168, 114, 31";
      const lineWidth = hovering ? 2 : 1.1;

      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const t = i / points.length;
        const alpha = t * t * (hovering ? 0.6 : 0.35);
        ctx!.beginPath();
        ctx!.moveTo(p0.x, p0.y);
        ctx!.lineTo(p1.x, p1.y);
        ctx!.strokeStyle = `rgba(${threadColor}, ${alpha})`;
        ctx!.lineWidth = lineWidth;
        ctx!.lineCap = "round";
        ctx!.stroke();
      }

      needle!.style.transform = `translate3d(${follower.x}px, ${follower.y}px, 0) rotate(${angle}deg) scale(${hovering ? 1.25 : 1})`;
      needle!.dataset.hovering = hovering ? "1" : "0";

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      document.documentElement.classList.remove("needle-cursor-active");
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 60 }}
      />
      <div
        ref={needleRef}
        aria-hidden="true"
        className="needle-cursor"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          opacity: 0,
          pointerEvents: "none",
          zIndex: 61,
          willChange: "transform",
        }}
      >
        <svg width="34" height="10" viewBox="0 0 34 10" style={{ transform: "translate(-6px, -5px)" }}>
          <line x1="0" y1="5" x2="24" y2="5" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M24 5 L32 5" stroke="var(--ink)" strokeWidth="1.2" strokeLinecap="round" />
          <ellipse cx="6" cy="5" rx="3" ry="1.6" fill="none" stroke="var(--paper)" strokeWidth="1.4" />
          <ellipse cx="6" cy="5" rx="3" ry="1.6" fill="none" stroke="var(--ink)" strokeWidth="0.7" />
        </svg>
      </div>
    </>
  );
}