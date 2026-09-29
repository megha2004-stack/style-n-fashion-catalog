import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { findDesigns } from "@/lib/search";
import DesignGrid from "@/components/design/DesignGrid";
import FilterSidebar from "@/components/search/FilterSidebar";

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({ select: { slug: true } });
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};

  const title = `${category.name} Designs | [Shop Name]`;
  const description = `Browse our full collection of ${category.name.toLowerCase()} stitching designs. Filter by color, fabric, neck, sleeve and occasion.`;

  return {
    title,
    description,
    alternates: { canonical: `/${category.slug}` },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { category: slug } = await params;
  const sp = await searchParams;

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const result = await findDesigns({
    category: slug,
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
      <h1 className="font-display text-3xl mb-2">{category.name} Designs</h1>
      <p className="text-sm mb-8" style={{ color: "var(--ink-soft)" }}>
        {result.total} design{result.total === 1 ? "" : "s"} in this category
      </p>

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        <FilterSidebar basePath={`/${slug}`} currentQuery={sp} />
        <DesignGrid designs={result.designs} />
      </div>
    </main>
  );
}
