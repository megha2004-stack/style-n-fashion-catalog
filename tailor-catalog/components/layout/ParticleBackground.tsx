"use client";

import { useEffect, useRef } from "react";

/**
 * A fixed, full-viewport canvas of small drifting dots ("stars"), each
 * connected to its nearby neighbors by a thin line whose opacity fades
 * with distance — the classic constellation/particle-network look.
 * Moving the mouse also draws connections from nearby dots to the
 * cursor itself, brightened, so the network visibly reacts to you.
 *
 * Mounted once in the public layout so it persists across every
 * customer-facing page without restarting on navigation.
 */
export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover)").matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    function handleResize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
      initParticles();
    }

    type Particle = { x: number; y: number; vx: number; vy: number };
    let particles: Particle[] = [];

    function initParticles() {
      const count = Math.min(90, Math.floor((width * height) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }
    initParticles();
    window.addEventListener("resize", handleResize);

    let mouseX = -9999;
    let mouseY = -9999;
    function handleMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }
    function handleLeave() {
      mouseX = -9999;
      mouseY = -9999;
    }
    if (canHover) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseleave", handleLeave);
    }

    const LINK_DISTANCE = 130;
    const MOUSE_LINK_DISTANCE = 180;

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      // dot-to-dot connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE) * 0.35;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.strokeStyle = `rgba(122, 30, 44, ${alpha})`;
            ctx!.lineWidth = 1;
            ctx!.stroke();
          }
        }
      }

      // mouse-to-dot connections, brighter than dot-to-dot links
      if (canHover) {
        for (const p of particles) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_LINK_DISTANCE) {
            const alpha = (1 - dist / MOUSE_LINK_DISTANCE) * 0.7;
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(mouseX, mouseY);
            ctx!.strokeStyle = `rgba(198, 138, 46, ${alpha})`;
            ctx!.lineWidth = 1.2;
            ctx!.stroke();
          }
        }
      }

      // the dots themselves
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(122, 30, 44, 0.55)";
        ctx!.fill();
      }
    }

    let raf = 0;
    function tick() {
      if (!reducedMotion) {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }
      }
      draw();
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}