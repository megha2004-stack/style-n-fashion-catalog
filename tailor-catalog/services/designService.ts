import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";

export type DesignInput = {
  title: string;
  description?: string;
  categoryId: string;
  subcategoryId?: string | null;
  fabric?: string;
  neckType?: string;
  sleeveType?: string;
  color?: string;
  occasion?: string;
  workType?: string;
  imagePath: string;
  imageAlt: string;
  isFeatured?: boolean;
  tagNames?: string[]; // free-text tags from the admin form, e.g. "boat neck, simple, cotton"
};

async function resolveTags(tagNames: string[] = []) {
  const cleaned = Array.from(
    new Set(tagNames.map((t) => t.trim().toLowerCase()).filter(Boolean))
  );

  const tagIds: string[] = [];
  for (const name of cleaned) {
    const slug = name.replace(/\s+/g, "-");
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    tagIds.push(tag.id);
  }
  return tagIds;
}

export async function createDesign(input: DesignInput) {
  const slug = await generateUniqueSlug(input.title);
  const tagIds = await resolveTags(input.tagNames);

  return prisma.design.create({
    data: {
      title: input.title,
      slug,
      description: input.description,
      categoryId: input.categoryId,
      subcategoryId: input.subcategoryId || null,
      fabric: input.fabric,
      neckType: input.neckType,
      sleeveType: input.sleeveType,
      color: input.color,
      occasion: input.occasion,
      workType: input.workType,
      imagePath: input.imagePath,
      imageAlt: input.imageAlt,
      isFeatured: input.isFeatured ?? false,
      tags: {
        create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })),
      },
    },
  });
}

export async function updateDesign(id: string, input: Partial<DesignInput>) {
  const data: Record<string, unknown> = { ...input };
  delete data.tagNames;

  if (input.title) {
    data.slug = await generateUniqueSlug(input.title, id);
  }

  if (input.tagNames) {
    const tagIds = await resolveTags(input.tagNames);
    await prisma.designTag.deleteMany({ where: { designId: id } });
    data.tags = {
      create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })),
    };
  }

  return prisma.design.update({ where: { id }, data });
}

export async function deleteDesign(id: string) {
  return prisma.design.delete({ where: { id } });
}

export async function getDesignBySlug(slug: string) {
  return prisma.design.findUnique({
    where: { slug },
    include: { category: true, subcategory: true, tags: { include: { tag: true } } },
  });
}

export async function getDashboardStats() {
  const [total, categories] = await Promise.all([
    prisma.design.count(),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { designs: true } } },
    }),
  ]);

  return { total, categories };
}
