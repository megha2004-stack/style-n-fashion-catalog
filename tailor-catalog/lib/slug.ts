import { prisma } from "./prisma";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Generates a unique slug for a design, e.g.
 * "simple-green-boat-neck-blouse-design", appending "-2", "-3", etc.
 * if the base slug is already taken.
 */
export async function generateUniqueSlug(
  title: string,
  excludeId?: string
): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await prisma.design.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) {
      return candidate;
    }

    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}
