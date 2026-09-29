"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import {
  FABRICS,
  NECK_TYPES,
  SLEEVE_TYPES,
  OCCASIONS,
  WORK_TYPES,
  COLORS,
} from "@/lib/constants";

type Category = { id: string; name: string; slug: string };

type DesignDefaults = {
  title?: string;
  description?: string;
  categoryId?: string;
  fabric?: string;
  neckType?: string;
  sleeveType?: string;
  color?: string;
  occasion?: string;
  workType?: string;
  imagePath?: string;
  imageAlt?: string;
  tags?: string;
};

function Select({ name, label, options, defaultValue }: { name: string; label: string; options: string[]; defaultValue?: string }) {
  return (
    <label className="block mb-4 text-sm">
      <span className="block mb-1" style={{ color: "var(--ink-soft)" }}>{label}</span>
      <select
        name={name}
        defaultValue={defaultValue || ""}
        className="w-full rounded-md border px-3 py-2 text-sm bg-white"
        style={{ borderColor: "var(--thread)" }}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

export default function DesignForm({
  action,
  categories,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  categories: Category[];
  defaults?: DesignDefaults;
  submitLabel: string;
}) {
  const [categoryId, setCategoryId] = useState(defaults?.categoryId || categories[0]?.id || "");
  const [imagePath, setImagePath] = useState(defaults?.imagePath || "");
  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <form action={action} className="max-w-2xl">
      <input type="hidden" name="imagePath" value={imagePath} />

      <ImageUploader
        categorySlug={selectedCategory?.slug || "misc"}
        existingPath={defaults?.imagePath}
        onUploaded={setImagePath}
      />

      <label className="block mt-6 mb-4 text-sm">
        <span className="block mb-1" style={{ color: "var(--ink-soft)" }}>Title</span>
        <input
          type="text"
          name="title"
          required
          defaultValue={defaults?.title}
          placeholder="e.g. Simple Green Boat Neck Blouse"
          className="w-full rounded-md border px-3 py-2 text-sm"
          style={{ borderColor: "var(--thread)" }}
        />
      </label>

      <label className="block mb-4 text-sm">
        <span className="block mb-1" style={{ color: "var(--ink-soft)" }}>Image alt text (for SEO)</span>
        <input
          type="text"
          name="imageAlt"
          required
          defaultValue={defaults?.imageAlt}
          placeholder="Describe the design for screen readers and Google Images"
          className="w-full rounded-md border px-3 py-2 text-sm"
          style={{ borderColor: "var(--thread)" }}
        />
      </label>

      <label className="block mb-4 text-sm">
        <span className="block mb-1" style={{ color: "var(--ink-soft)" }}>Description</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaults?.description}
          className="w-full rounded-md border px-3 py-2 text-sm"
          style={{ borderColor: "var(--thread)" }}
        />
      </label>

      <label className="block mb-4 text-sm">
        <span className="block mb-1" style={{ color: "var(--ink-soft)" }}>Category</span>
        <select
          name="categoryId"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm bg-white"
          style={{ borderColor: "var(--thread)" }}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-x-4">
        <Select name="fabric" label="Fabric" options={FABRICS} defaultValue={defaults?.fabric} />
        <Select name="color" label="Color" options={COLORS} defaultValue={defaults?.color} />
        <Select name="neckType" label="Neck" options={NECK_TYPES} defaultValue={defaults?.neckType} />
        <Select name="sleeveType" label="Sleeve" options={SLEEVE_TYPES} defaultValue={defaults?.sleeveType} />
        <Select name="occasion" label="Occasion" options={OCCASIONS} defaultValue={defaults?.occasion} />
        <Select name="workType" label="Work" options={WORK_TYPES} defaultValue={defaults?.workType} />
      </div>

      <label className="block mb-6 text-sm">
        <span className="block mb-1" style={{ color: "var(--ink-soft)" }}>Tags (comma separated)</span>
        <input
          type="text"
          name="tags"
          defaultValue={defaults?.tags}
          placeholder="e.g. simple, bridal, boat neck"
          className="w-full rounded-md border px-3 py-2 text-sm"
          style={{ borderColor: "var(--thread)" }}
        />
      </label>

      <button
        type="submit"
        disabled={!imagePath}
        className="rounded-md px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        style={{ background: "var(--maroon)" }}
      >
        {submitLabel}
      </button>
      {!imagePath && (
        <p className="text-xs mt-2" style={{ color: "var(--ink-soft)" }}>
          Upload a photo before saving.
        </p>
      )}
    </form>
  );
}
