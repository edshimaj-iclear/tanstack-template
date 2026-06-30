"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { logAction } from "@/lib/utils";

export async function createRisk(formData: FormData) {
  const user = await getSession();
  if (!user) redirect("/login");

  const process = String(formData.get("process") || "").trim();
  const hazard = String(formData.get("hazard") || "").trim();
  const probability = Math.min(5, Math.max(1, parseInt(String(formData.get("probability") || "1"), 10) || 1));
  const severity = Math.min(5, Math.max(1, parseInt(String(formData.get("severity") || "1"), 10) || 1));
  const action = String(formData.get("action") || "").trim() || null;
  const owner = String(formData.get("owner") || "").trim() || null;
  if (!process || !hazard) return;

  const r = await prisma.risk.create({
    data: { process, hazard, probability, severity, riskScore: probability * severity, action, owner, status: "OPEN" },
  });
  await logAction({ userId: user.id, action: "CREATE", entity: "Risk", entityId: r.id, details: { score: probability * severity } });
  revalidatePath("/risk");
}

export async function setRiskStatus(id: string, status: string) {
  const user = await getSession();
  if (!user) redirect("/login");
  await prisma.risk.update({ where: { id }, data: { status, reviewDate: new Date() } });
  await logAction({ userId: user.id, action: "STATUS", entity: "Risk", entityId: id, details: { status } });
  revalidatePath("/risk");
}
