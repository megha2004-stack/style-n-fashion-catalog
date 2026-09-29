import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteDesignAction } from "./[id]/actions";

export default async function AdminDesignsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const designs = await prisma.design.findMany({
    where: q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { color: { contains: q, mode: "insensitive" } },
            { fabric: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Designs</h1>
        <Link
          href="/admin/designs/new"
          className="rounded-md px-4 py-2 text-sm font-medium text-white"
          style={{ background: "var(--maroon)" }}
        >
          + Upload new
        </Link>
      </div>

      <form method="get" className="mb-6">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by title, color, fabric…"
          className="w-full max-w-sm rounded-md border px-3 py-2 text-sm bg-white"
          style={{ borderColor: "var(--thread)" }}
        />
      </form>

      <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: "var(--thread-light)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b" style={{ borderColor: "var(--thread-light)" }}>
              <th className="p-3">Photo</th>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Created</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {designs.map((d) => (
              <tr key={d.id} className="border-b" style={{ borderColor: "var(--thread-light)" }}>
                <td className="p-3">
                  <Image src={d.imagePath} alt={d.imageAlt} width={40} height={50} className="rounded object-cover" />
                </td>
                <td className="p-3">{d.title}</td>
                <td className="p-3">{d.category.name}</td>
                <td className="p-3">{d.createdAt.toLocaleDateString()}</td>
                <td className="p-3 text-right">
                  <Link href={`/admin/designs/${d.id}/edit`} className="stitch-link mr-4" style={{ color: "var(--teal)" }}>
                    Edit
                  </Link>
                  <form action={deleteDesignAction.bind(null, d.id)} className="inline">
                    <button type="submit" className="stitch-link" style={{ color: "var(--maroon)" }}>
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {designs.length === 0 && (
          <p className="p-6 text-sm text-center" style={{ color: "var(--ink-soft)" }}>
            No designs yet.
          </p>
        )}
      </div>
    </div>
  );
}
