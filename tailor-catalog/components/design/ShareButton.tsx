"use client";

import { useState } from "react";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="text-sm rounded-full border px-4 py-2"
        style={{ borderColor: "var(--thread)" }}
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm rounded-full px-4 py-2 text-white"
        style={{ background: "var(--teal)" }}
      >
        Share on WhatsApp
      </a>
    </div>
  );
}
