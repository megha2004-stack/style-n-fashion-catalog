import { prisma } from "@/lib/prisma";
import DesignForm from "@/components/admin/DesignForm";
import { createDesignAction } from "./actions";

export default async function NewDesignPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Upload a new design</h1>
      <DesignForm
        action={createDesignAction}
        categories={categories}
        submitLabel="Save design"
      />
    </div>
  );
}
