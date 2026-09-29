import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { findDesigns } from "@/lib/search";
import DesignGrid from "@/components/design/DesignGrid";
import ShareButton from "@/components/design/ShareButton";

export const revalidate = 3600;

async function getDesign(slug: string) {
  return prisma.design.findUnique({
    where: { slug },
    include: { category: true, tags: { include: { tag: true } } },
  });
}

export async function generateStaticParams() {
  const designs = await prisma.design.findMany({
    select: { slug: true, category: { select: { slug: true } } },
    take: 500,
  });
  return designs.map((d) => ({ category: d.category.slug, slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const design = await getDesign(slug);
  if (!design) return {};

  const title = `${design.title} | [Shop Name]`;
  const description =
    design.description?.slice(0, 155) ||
    `${design.title} — a ${design.category.name.toLowerCase()} stitching design. ${[design.fabric, design.color, design.occasion].filter(Boolean).join(", ")}.`;

  return {
    title,
    description,
    alternates: { canonical: `/${design.category.slug}/${design.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: design.imagePath }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [design.imagePath],
    },
  };
}

export default async function DesignDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;
  const design = await getDesign(slug);
  if (!design) notFound();

  const related = await findDesigns({ category: design.category.slug, pageSize: 8 });
  const relatedFiltered = related.designs.filter((d) => d.id !== design.id).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: design.title,
    description: design.description || undefined,
    contentUrl: design.imagePath,
    about: design.category.name,
  };

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-xs mb-6" style={{ color: "var(--ink-soft)" }}>
        <Link href="/" className="stitch-link">Home</Link> /{" "}
        <Link href={`/${design.category.slug}`} className="stitch-link">{design.category.name}</Link> /{" "}
        <span>{design.title}</span>
      </nav>

      <div className="grid md:grid-cols-[1.1fr_1fr] gap-10">
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--thread-light)" }}>
          <Image
            src={design.imagePath}
            alt={design.imageAlt}
            width={800}
            height={1000}
            className="w-full h-auto"
            priority
          />
        </div>

        <div>
          <p className="order-tag mb-2" style={{ color: "var(--marigold-dark)" }}>
            {design.category.name}
          </p>
          <h1 className="font-display text-3xl mb-4">{design.title}</h1>

          {design.description && (
            <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>
              {design.description}
            </p>
          )}

          <hr className="seam mb-6" />

          <dl className="grid grid-cols-2 gap-y-3 text-sm mb-6">
            {design.fabric && (<><dt style={{ color: "var(--ink-soft)" }}>Fabric</dt><dd>{design.fabric}</dd></>)}
            {design.neckType && (<><dt style={{ color: "var(--ink-soft)" }}>Neck</dt><dd>{design.neckType}</dd></>)}
            {design.sleeveType && (<><dt style={{ color: "var(--ink-soft)" }}>Sleeve</dt><dd>{design.sleeveType}</dd></>)}
            {design.color && (<><dt style={{ color: "var(--ink-soft)" }}>Color</dt><dd>{design.color}</dd></>)}
            {design.occasion && (<><dt style={{ color: "var(--ink-soft)" }}>Occasion</dt><dd>{design.occasion}</dd></>)}
            {design.workType && (<><dt style={{ color: "var(--ink-soft)" }}>Work</dt><dd>{design.workType}</dd></>)}
          </dl>

          <ShareButton title={design.title} />

          <div className="mt-8 rounded-xl p-4 text-sm" style={{ background: "var(--thread-light)" }}>
            Like this design? Visit [Shop Name] with this page open and
            we&rsquo;ll take your measurements to stitch it for you.
          </div>
        </div>
      </div>

      {relatedFiltered.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl mb-6">Related designs</h2>
          <DesignGrid designs={relatedFiltered} />
        </section>
      )}
    </main>
  );
}
