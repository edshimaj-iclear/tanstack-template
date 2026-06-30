"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession, canRelease } from "@/lib/auth";
import { logAction } from "@/lib/utils";
import { FINAL_QC_CHECKS } from "@/lib/constants";

// Record a final QC inspection (SOP-010). PASS -> case ready for packaging.
export async function finalInspect(caseId: string, formData: FormData) {
  const user = await getSession();
  if (!user) redirect("/login");
  // Final release is role-gated (Technical Director / Quality Manager / CEO)
  if (!canRelease(user.role)) {
    throw new Error("Vetëm Drejtori Teknik, Quality Manager ose CEO mund të lëshojnë produktin.");
  }

  const checklist: Record<string, boolean> = {};
  let allOk = true;
  for (const k of FINAL_QC_CHECKS) {
    const ok = formData.get(`chk_${k}`) === "ok";
    checklist[k] = ok;
    if (!ok) allOk = false;
  }
  const photoNotes = String(formData.get("photoNotes") || "").trim() || null;
  const result = allOk ? "PASS" : "FAIL";

  const c = await prisma.case.findUnique({ where: { id: caseId }, include: { steps: { where: { stage: "FINAL_QC" }, orderBy: { createdAt: "desc" }, take: 1 } } });
  if (!c) return;

  await prisma.qcInspection.create({
    data: {
      caseId, stepId: c.steps[0]?.id ?? null, type: "FINAL", result,
      checklist: JSON.stringify(checklist), photoNotes,
      inspectorId: user.id,
      eSignature: `${user.name} (${user.role}) · ${new Date().toISOString()}`,
    },
  });

  if (allOk) {
    // Mark FINAL_QC step passed and move to packaging
    if (c.steps[0]) await prisma.productionStep.update({ where: { id: c.steps[0].id }, data: { status: "PASSED", completedAt: new Date() } });
    await prisma.case.update({
      where: { id: caseId },
      data: { stage: "PACKAGING", status: "IN_PRODUCTION", holdReason: null,
        steps: { create: { stage: "PACKAGING", status: "IN_PROGRESS", operatorId: user.id, startedAt: new Date(), notes: "Lëshim nga QC Final (SOP-010)" } } },
    });
  } else {
    if (c.steps[0]) await prisma.productionStep.update({ where: { id: c.steps[0].id }, data: { status: "FAILED" } });
    await prisma.case.update({ where: { id: caseId }, data: { status: "ON_HOLD", holdReason: "Dështoi QC Final (SOP-010)" } });
  }

  await logAction({ userId: user.id, action: "FINAL_QC", entity: "Case", entityId: caseId, details: { result } });
  revalidatePath("/qc");
  revalidatePath(`/cases/${caseId}`);
}
