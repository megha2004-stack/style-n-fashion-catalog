import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SearchBar from "@/components/search/SearchBar";

export default async function Header() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    take: 8,
  });

  return (
    <header className="border-b" style={{ borderColor: "var(--thread-light)" }}>
      <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="shrink-0">
          <span className="font-display text-xl md:text-2xl" style={{ color: "var(--ink)" }}>
            Style-N-Fashion
          </span>
          <hr className="seam mt-1" style={{ width: "70%" }} />
        </Link>

        <div className="hidden md:block flex-1 max-w-md">
          <SearchBar />
        </div>

        <nav className="hidden lg:flex items-center gap-5 text-sm">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/${c.slug}`}
              className="stitch-link"
              style={{ color: "var(--ink-soft)" }}
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="md:hidden px-5 pb-4">
        <SearchBar />
      </div>
    </header>
  );
}
