"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionCookie } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");

  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    redirect("/admin/login?error=1");
  }

  await createSessionCookie(admin.id, admin.email);
  redirect("/admin");
}
