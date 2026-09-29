"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function SearchBar({ initialValue = "" }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timeout = setTimeout(() => {
      if (value.trim().length > 0) {
        router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [value, router]);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim().length > 0) {
          router.push(`/search?q=${encodeURIComponent(value.trim())}`);
        }
      }}
    >
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search: boat neck, green kurti, bridal..."
        aria-label="Search designs"
        className="w-full rounded-full px-4 py-2 text-sm bg-white border outline-none"
        style={{ borderColor: "var(--thread)" }}
      />
    </form>
  );
}
