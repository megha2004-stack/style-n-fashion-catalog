"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createDesign } from "@/services/designService";

export async function createDesignAction(formData: FormData) {
  const tags = String(formData.get("tags") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  await createDesign({
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || "") || undefined,
    categoryId: String(formData.get("categoryId") || ""),
    fabric: String(formData.get("fabric") || "") || undefined,
    neckType: String(formData.get("neckType") || "") || undefined,
    sleeveType: String(formData.get("sleeveType") || "") || undefined,
    color: String(formData.get("color") || "") || undefined,
    occasion: String(formData.get("occasion") || "") || undefined,
    workType: String(formData.get("workType") || "") || undefined,
    imagePath: String(formData.get("imagePath") || ""),
    imageAlt: String(formData.get("imageAlt") || ""),
    tagNames: tags,
  });

  revalidatePath("/");
  revalidatePath("/admin/designs");
  redirect("/admin/designs");
}
