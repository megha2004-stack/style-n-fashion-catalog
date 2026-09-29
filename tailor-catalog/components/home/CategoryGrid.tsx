import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoryGrid() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <section className="mx-auto max-w-6xl px-5 py-4">
      <div className="category-rail">
        {categories.map((c) => (
          <Link key={c.id} href={`/${c.slug}`} className="category-pill">
            {c.name}
          </Link>
        ))}
      </div>
    </section>
  );
}