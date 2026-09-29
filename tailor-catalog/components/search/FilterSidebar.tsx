import {
  FABRICS,
  NECK_TYPES,
  SLEEVE_TYPES,
  OCCASIONS,
  WORK_TYPES,
  COLORS,
  SORT_OPTIONS,
} from "@/lib/constants";

type Props = {
  basePath: string; // e.g. "/blouse" or "/search"
  currentQuery: Record<string, string | undefined>;
};

function FilterSelect({
  name,
  label,
  options,
  value,
}: {
  name: string;
  label: string;
  options: string[];
  value?: string;
}) {
  return (
    <label className="block mb-4 text-sm">
      <span className="block mb-1" style={{ color: "var(--ink-soft)" }}>{label}</span>
      <select
        name={name}
        defaultValue={value || ""}
        className="w-full rounded-md border px-2 py-1.5 bg-white text-sm"
        style={{ borderColor: "var(--thread)" }}
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

export default function FilterSidebar({ basePath, currentQuery }: Props) {
  return (
    <form action={basePath} method="get" className="sticky top-6">
      {currentQuery.q && <input type="hidden" name="q" value={currentQuery.q} />}

      <h2 className="font-display text-lg mb-4">Refine</h2>
      <FilterSelect name="color" label="Color" options={COLORS} value={currentQuery.color} />
      <FilterSelect name="fabric" label="Fabric" options={FABRICS} value={currentQuery.fabric} />
      <FilterSelect name="neck" label="Neck" options={NECK_TYPES} value={currentQuery.neck} />
      <FilterSelect name="sleeve" label="Sleeve" options={SLEEVE_TYPES} value={currentQuery.sleeve} />
      <FilterSelect name="occasion" label="Occasion" options={OCCASIONS} value={currentQuery.occasion} />
      <FilterSelect name="workType" label="Work" options={WORK_TYPES} value={currentQuery.workType} />

      <label className="block mb-4 text-sm">
        <span className="block mb-1" style={{ color: "var(--ink-soft)" }}>Sort by</span>
        <select
          name="sort"
          defaultValue={currentQuery.sort || "newest"}
          className="w-full rounded-md border px-2 py-1.5 bg-white text-sm"
          style={{ borderColor: "var(--thread)" }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="w-full rounded-md py-2 text-sm font-medium text-white"
        style={{ background: "var(--maroon)" }}
      >
        Apply filters
      </button>
    </form>
  );
}
