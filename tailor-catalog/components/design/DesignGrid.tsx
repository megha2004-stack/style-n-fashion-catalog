import DesignCard from "./DesignCard";

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

export default function DesignGrid({ designs }: { designs: DesignCardData[] }) {
  if (designs.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-display text-xl mb-2">No designs found</p>
        <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
          Try a different search term, or clear a filter and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="masonry">
      {designs.map((design, i) => (
        <DesignCard key={design.id} design={design} index={i} />
      ))}
    </div>
  );
}
