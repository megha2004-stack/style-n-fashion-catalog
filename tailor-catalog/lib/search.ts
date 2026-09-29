import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

export type DesignFilters = {
  q?: string;
  category?: string; // category slug
  color?: string;
  fabric?: string;
  sleeve?: string;
  neck?: string;
  occasion?: string;
  workType?: string;
  sort?: "newest" | "oldest";
  page?: number;
  pageSize?: number;
};

const PAGE_SIZE_DEFAULT = 24;

/**
 * Single shared query used by the homepage, category pages, and the
 * search page — so results are always consistent regardless of entry
 * point. Uses Postgres full-text search when `q` is present, and a
 * plain filtered query otherwise.
 */
export async function findDesigns(filters: DesignFilters) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? PAGE_SIZE_DEFAULT;
  const offset = (page - 1) * pageSize;

  const orderBy = filters.sort === "oldest" ? Prisma.sql`d.created_at asc` : Prisma.sql`d.created_at desc`;

  const conditions: Prisma.Sql[] = [];

  if (filters.category) {
    conditions.push(Prisma.sql`c.slug = ${filters.category}`);
  }
  if (filters.color) conditions.push(Prisma.sql`d.color = ${filters.color}`);
  if (filters.fabric) conditions.push(Prisma.sql`d.fabric = ${filters.fabric}`);
  if (filters.sleeve) conditions.push(Prisma.sql`d.sleeve_type = ${filters.sleeve}`);
  if (filters.neck) conditions.push(Prisma.sql`d.neck_type = ${filters.neck}`);
  if (filters.occasion) conditions.push(Prisma.sql`d.occasion = ${filters.occasion}`);
  if (filters.workType) conditions.push(Prisma.sql`d.work_type = ${filters.workType}`);

  let rankSelect = Prisma.sql`0::float as rank`;
  if (filters.q && filters.q.trim().length > 0) {
    conditions.push(
      Prisma.sql`d.search_vector @@ websearch_to_tsquery('english', ${filters.q})`
    );
    rankSelect = Prisma.sql`ts_rank(d.search_vector, websearch_to_tsquery('english', ${filters.q})) as rank`;
  }

  const whereClause =
    conditions.length > 0
      ? Prisma.sql`where ${Prisma.join(conditions, " and ")}`
      : Prisma.empty;

  const orderClause =
    filters.q && filters.q.trim().length > 0
      ? Prisma.sql`order by rank desc, d.created_at desc`
      : Prisma.sql`order by ${orderBy}`;

  const rows = await prisma.$queryRaw<
    Array<{
      id: string;
      title: string;
      slug: string;
      image_path: string;
      image_alt: string;
      color: string | null;
      fabric: string | null;
      category_name: string;
      category_slug: string;
    }>
  >(Prisma.sql`
    select d.id, d.title, d.slug, d.image_path, d.image_alt, d.color, d.fabric,
           c.name as category_name, c.slug as category_slug, ${rankSelect}
    from designs d
    join categories c on c.id = d.category_id
    ${whereClause}
    ${orderClause}
    limit ${pageSize} offset ${offset}
  `);

  const countRows = await prisma.$queryRaw<Array<{ count: bigint }>>(Prisma.sql`
    select count(*)::bigint as count
    from designs d
    join categories c on c.id = d.category_id
    ${whereClause}
  `);

  return {
    designs: rows,
    total: Number(countRows[0]?.count ?? 0),
    page,
    pageSize,
  };
}
