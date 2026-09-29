import Link from "next/link";

type DesignCardData = {
  id: string;
  title: string;
  slug: string;
  image_path: string;
  image_alt: string;
  color?: string | null;
  fabric?: string | null;
  category_slug: string;
  category_name: string;
};

export default function DesignCard({ design, index }: { design: DesignCardData; index: number }) {
  const orderNo = String(index + 1).padStart(3, "0");

  return (
    <Link
      href={`/${design.category_slug}/${design.slug}`}
      className="group block rounded-xl overflow-hidden bg-white border transition-shadow hover:shadow-lg"
      style={{ borderColor: "var(--thread-light)", breakInside: "avoid" }}
    >
      {/* Plain <img>, not next/image: Pinterest-style masonry needs each
          photo's real, natural aspect ratio to create the staggered
          look. next/image requires a fixed width/height up front, which
          forces every card to the same shape — the opposite of what we
          want here. Native lazy-loading keeps this fast regardless. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={design.image_path}
        alt={design.image_alt}
        loading="lazy"
        decoding="async"
        className="w-full h-auto block"
        style={{ background: "var(--thread-light)" }}
      />
      <div className="p-2.5">
        <div className="flex items-center justify-between mb-1">
          <span className="order-tag" style={{ color: "var(--marigold-dark)" }}>
            No. {orderNo}
          </span>
          <span className="order-tag" style={{ color: "var(--ink-soft)" }}>
            {design.category_name}
          </span>
        </div>
        <h3 className="text-sm font-medium leading-snug" style={{ color: "var(--ink)" }}>
          {design.title}
        </h3>
        {(design.color || design.fabric) && (
          <p className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
            {[design.color, design.fabric].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
    </Link>
  );
}
