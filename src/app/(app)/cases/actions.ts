"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { logAction, caseNumber } from "@/lib/utils";
import { nextStage, STAGE_LABELS } from "@/lib/constants";

const RECEIVING_CHECKS = ["stl_opens", "missing_teeth", "artifacts", "scan_quality", "margin"] as const;

export async function createCase(formData: FormData) {
  const user = await getSession();
  if (!user) redirect("/login");

  const patientRef = String(formData.get("patientRef") || "").trim();
  const doctorName = String(formData.get("doctorName") || "").trim();
  const doctorClinic = String(formData.get("doctorClinic") || "").trim() || null;
  const stlVersion = String(formData.get("stlVersion") || "").trim() || null;
  const alignerCount = parseInt(String(formData.get("alignerCount") || "0"), 10) || 0;
  const priority = String(formData.get("priority") || "NORMAL");
  const dueRaw = String(formData.get("dueDate") || "");
  const dueDate = dueRaw ? new Date(dueRaw) : null;

  // SOP-001 receiving checklist: each must be "ok" to pass
  const checklist: Record<string, boolean> = {};
  let allOk = true;
  for (const k of RECEIVING_CHECKS) {
    const ok = formData.get(`chk_${k}`) === "ok";
    checklist[k] = ok;
    if (!ok) allOk = false;
  }

  // Next sequential number for the year
  const count = await prisma.case.count();
  const num = caseNumber(count + 1);

  const created = await prisma.case.create({
    data: {
      caseNumber: num,
      patientRef,
      doctorName,
      doctorClinic,
      stlVersion,
      alignerCount,
      priority,
      dueDate,
      stage: "RECEIVED",
      status: allOk ? "OPEN" : "ON_HOLD",
      holdReason: allOk ? null : "Pranimi STL dështoi (SOP-001)",
      createdById: user.id,
      steps: {
        create: {
          stage: "RECEIVED",
          status: allOk ? "PASSED" : "HOLD",
          operatorId: user.id,
          startedAt: new Date(),
          completedAt: allOk ? new Date() : null,
          notes: "Pranim STL — SOP-001",
        },
      },
    },
    include: { steps: true },
  });

  // Record the receiving inspection
  await prisma.qcInspection.create({
    data: {
      caseId: created.id,
      stepId: created.steps[0].id,
      type: "INCOMING",
      result: allOk ? "PASS" : "FAIL",
      checklist: JSON.stringify(checklist),
      inspectorId: user.id,
      eSignature: `${user.name} · ${new Date().toISOString()}`,
    },
  });

  await logAction({
    userId: user.id, action: "CREATE", entity: "Case", entityId: created.id,
    details: { caseNumber: num, receivingPassed: allOk },
  });

  redirect(`/cases/${created.id}`);
}

export async function advanceStage(caseId: string) {
  const user = await getSession();
  if (!user) redirect("/login");

  const c = await prisma.case.findUnique({ where: { id: caseId } });
  if (!c) return;
  const next = nextStage(c.stage);

  if (!next) {
    // Final stage reached -> mark completed/shipped handled elsewhere
    await prisma.case.update({ where: { id: caseId }, data: { status: "COMPLETED", stage: "SHIPPING" } });
  } else {
    await prisma.case.update({
      where: { id: caseId },
      data: {
        stage: next,
        status: "IN_PRODUCTION",
        steps: {
          create: {
            stage: next,
            status: "IN_PROGRESS",
            operatorId: user.id,
            startedAt: new Date(),
            notes: `Kalim te faza: ${STAGE_LABELS[next]}`,
          },
        },
      },
    });
  }

  await logAction({ userId: user.id, action: "ADVANCE", entity: "Case", entityId: caseId, details: { to: next ?? "COMPLETED" } });
  revalidatePath(`/cases/${caseId}`);
}

export async function toggleHold(caseId: string, reason?: string) {
  const user = await getSession();
  if (!user) redirect("/login");
  const c = await prisma.case.findUnique({ where: { id: caseId } });
  if (!c) return;
  const onHold = c.status === "ON_HOLD";
  await prisma.case.update({
    where: { id: caseId },
    data: { status: onHold ? "IN_PRODUCTION" : "ON_HOLD", holdReason: onHold ? null : reason || "Pezulluar manualisht" },
  });
  await logAction({ userId: user.id, action: onHold ? "RELEASE_HOLD" : "HOLD", entity: "Case", entityId: caseId });
  revalidatePath(`/cases/${caseId}`);
}
