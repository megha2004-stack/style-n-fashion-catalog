import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DesignForm from "@/components/admin/DesignForm";
import { updateDesignAction } from "../actions";

export default async function EditDesignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [design, categories] = await Promise.all([
    prisma.design.findUnique({ where: { id }, include: { tags: { include: { tag: true } } } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!design) notFound();

  const boundAction = updateDesignAction.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Edit design</h1>
      <DesignForm
        action={boundAction}
        categories={categories}
        submitLabel="Save changes"
        defaults={{
          title: design.title,
          description: design.description || undefined,
          categoryId: design.categoryId,
          fabric: design.fabric || undefined,
          neckType: design.neckType || undefined,
          sleeveType: design.sleeveType || undefined,
          color: design.color || undefined,
          occasion: design.occasion || undefined,
          workType: design.workType || undefined,
          imagePath: design.imagePath,
          imageAlt: design.imageAlt,
          tags: design.tags.map((t) => t.tag.name).join(", "),
        }}
      />
    </div>
  );
}
