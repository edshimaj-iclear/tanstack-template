"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { logAction } from "@/lib/utils";

export async function createReview(formData: FormData) {
  const user = await getSession();
  if (!user) redirect("/login");

  const attendees = String(formData.get("attendees") || "").trim() || null;
  const decisions = String(formData.get("decisions") || "").trim() || null;
  const actions = String(formData.get("actions") || "").trim() || null;
  const nextRaw = String(formData.get("nextReviewDate") || "");

  // Snapshot KPIs at time of review
  const [total, shipped, complaints, capasOpen, defects] = await Promise.all([
    prisma.case.count(),
    prisma.case.count({ where: { status: "SHIPPED" } }),
    prisma.complaint.count(),
    prisma.capa.count({ where: { status: { not: "CLOSED" } } }),
    prisma.qcInspection.count({ where: { result: "FAIL" } }),
  ]);
  const kpiSnapshot = JSON.stringify({ total, shipped, complaints, capasOpen, defects, at: new Date().toISOString() });

  const r = await prisma.managementReview.create({
    data: { attendees, decisions, actions, kpiSnapshot, nextReviewDate: nextRaw ? new Date(nextRaw) : null },
  });
  await logAction({ userId: user.id, action: "CREATE", entity: "ManagementReview", entityId: r.id });
  revalidatePath("/management-review");
}
