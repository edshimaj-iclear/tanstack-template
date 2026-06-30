"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { logAction } from "@/lib/utils";
import { nextStage, STAGE_LABELS } from "@/lib/constants";

// Log the current in-process step (equipment, lot, parameters) and advance the case.
export async function logStep(caseId: string, formData: FormData) {
  const user = await getSession();
  if (!user) redirect("/login");

  const c = await prisma.case.findUnique({
    where: { id: caseId },
    include: { steps: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  if (!c) return;
  if (c.status === "ON_HOLD") throw new Error("Rasti është në Hold — hiqe pezullimin para se të vazhdosh.");

  const equipmentId = String(formData.get("equipmentId") || "").trim() || null;
  const materialLotId = String(formData.get("materialLotId") || "").trim() || null;

  // Collect free-form parameters as JSON (layer height, exposure, temp, vacuum, etc.)
  const params: Record<string, string> = {};
  for (const key of ["layerHeight", "exposure", "temperature", "vacuum", "heatingTime", "coolingTime"]) {
    const v = String(formData.get(key) || "").trim();
    if (v) params[key] = v;
  }
  const notes = String(formData.get("notes") || "").trim() || null;

  const current = c.steps[0];
  // Finalize the current step with captured data
  if (current && current.stage === c.stage) {
    await prisma.productionStep.update({
      where: { id: current.id },
      data: {
        status: "PASSED", operatorId: user.id, equipmentId, materialLotId,
        parameters: Object.keys(params).length ? JSON.stringify(params) : null,
        notes, completedAt: new Date(),
      },
    });
  }

  const next = nextStage(c.stage);
  if (next) {
    await prisma.case.update({
      where: { id: caseId },
      data: {
        stage: next, status: "IN_PRODUCTION",
        steps: { create: { stage: next, status: "IN_PROGRESS", operatorId: user.id, startedAt: new Date(), notes: `Kalim te: ${STAGE_LABELS[next]}` } },
      },
    });
  } else {
    await prisma.case.update({ where: { id: caseId }, data: { status: "COMPLETED" } });
  }

  await logAction({ userId: user.id, action: "STEP", entity: "Case", entityId: caseId, details: { stage: c.stage, params } });
  revalidatePath("/production");
  revalidatePath(`/cases/${caseId}`);
}
