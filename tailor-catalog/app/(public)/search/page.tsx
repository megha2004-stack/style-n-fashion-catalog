import type { Metadata } from "next";
import { findDesigns } from "@/lib/search";
import DesignGrid from "@/components/design/DesignGrid";
import FilterSidebar from "@/components/search/FilterSidebar";

export const metadata: Metadata = {
  title: "Search Designs",
  robots: { index: false }, // search result pages shouldn't be indexed, the category pages should
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const q = sp.q || "";

  const result = await findDesigns({
    q,
    color: sp.color,
    fabric: sp.fabric,
    sleeve: sp.sleeve,
    neck: sp.neck,
    occasion: sp.occasion,
    workType: sp.workType,
    sort: (sp.sort as "newest" | "oldest") || "newest",
  });

  return (
    <main className="mx-auto max-w-6xl px-5 py-6 md:py-10">
      <h1 className="font-display text-3xl mb-2">
        {q ? `Results for "${q}"` : "Search designs"}
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--ink-soft)" }}>
        {result.total} design{result.total === 1 ? "" : "s"} found
      </p>

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        <FilterSidebar basePath="/search" currentQuery={sp} />
        <DesignGrid designs={result.designs} />
      </div>
    </main>
  );
}
