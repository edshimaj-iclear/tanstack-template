"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { logAction } from "@/lib/utils";
import { seqCode } from "@/lib/constants";

export async function createCapa(formData: FormData) {
  const user = await getSession();
  if (!user) redirect("/login");

  const source = String(formData.get("source") || "INTERNAL");
  const description = String(formData.get("description") || "").trim();
  const caseId = String(formData.get("caseId") || "").trim() || null;
  if (!description) return;

  const count = await prisma.capa.count();
  const capa = await prisma.capa.create({
    data: {
      capaNumber: seqCode("CAPA", count + 1),
      source, description, caseId, ownerId: user.id, status: "OPEN",
    },
  });
  await logAction({ userId: user.id, action: "CREATE", entity: "Capa", entityId: capa.id, details: { source } });
  redirect(`/capa/${capa.id}`);
}

export async function updateCapa(id: string, formData: FormData) {
  const user = await getSession();
  if (!user) redirect("/login");

  const rootCause = String(formData.get("rootCause") || "").trim() || null;
  const correctiveAction = String(formData.get("correctiveAction") || "").trim() || null;
  const preventiveAction = String(formData.get("preventiveAction") || "").trim() || null;
  const status = String(formData.get("status") || "OPEN");

  await prisma.capa.update({
    where: { id },
    data: {
      rootCause, correctiveAction, preventiveAction, status,
      closedAt: status === "CLOSED" ? new Date() : null,
    },
  });
  await logAction({ userId: user.id, action: "UPDATE", entity: "Capa", entityId: id, details: { status } });
  revalidatePath(`/capa/${id}`);
  revalidatePath("/capa");
}
