"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { logAction } from "@/lib/utils";
import { seqCode } from "@/lib/constants";

export async function createAudit(formData: FormData) {
  const user = await getSession();
  if (!user) redirect("/login");
  const area = String(formData.get("area") || "PRODUCTION");
  const findings = String(formData.get("findings") || "").trim() || null;
  const count = await prisma.audit.count();
  const a = await prisma.audit.create({
    data: { auditNumber: seqCode("AUD", count + 1), area, auditorId: user.id, findings, status: "OPEN" },
  });
  await logAction({ userId: user.id, action: "CREATE", entity: "Audit", entityId: a.id, details: { area } });
  revalidatePath("/audits");
}

export async function closeAudit(id: string) {
  const user = await getSession();
  if (!user) redirect("/login");
  await prisma.audit.update({ where: { id }, data: { status: "CLOSED" } });
  await logAction({ userId: user.id, action: "CLOSE", entity: "Audit", entityId: id });
  revalidatePath("/audits");
}
