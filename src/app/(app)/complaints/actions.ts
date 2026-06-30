"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { logAction } from "@/lib/utils";
import { seqCode } from "@/lib/constants";

export async function createComplaint(formData: FormData) {
  const user = await getSession();
  if (!user) redirect("/login");

  const doctorName = String(formData.get("doctorName") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const caseId = String(formData.get("caseId") || "").trim() || null;
  if (!doctorName || !description) return;

  const count = await prisma.complaint.count();
  const cmp = await prisma.complaint.create({
    data: { complaintNumber: seqCode("CMP", count + 1), doctorName, description, caseId, status: "OPEN" },
  });
  await logAction({ userId: user.id, action: "CREATE", entity: "Complaint", entityId: cmp.id });
  revalidatePath("/complaints");
}

export async function updateComplaint(id: string, formData: FormData) {
  const user = await getSession();
  if (!user) redirect("/login");
  const decision = String(formData.get("decision") || "").trim() || null;
  const status = String(formData.get("status") || "OPEN");
  await prisma.complaint.update({
    where: { id }, data: { decision, status, closedAt: status === "CLOSED" ? new Date() : null },
  });
  await logAction({ userId: user.id, action: "UPDATE", entity: "Complaint", entityId: id, details: { status } });
  revalidatePath("/complaints");
}

// Open a CAPA directly from a complaint and link them
export async function escalateToCapa(id: string) {
  const user = await getSession();
  if (!user) redirect("/login");
  const cmp = await prisma.complaint.findUnique({ where: { id } });
  if (!cmp || cmp.capaId) return;

  const count = await prisma.capa.count();
  const capa = await prisma.capa.create({
    data: {
      capaNumber: seqCode("CAPA", count + 1), source: "COMPLAINT", caseId: cmp.caseId,
      description: `Nga ankesa ${cmp.complaintNumber}: ${cmp.description}`, ownerId: user.id, status: "OPEN",
    },
  });
  await prisma.complaint.update({ where: { id }, data: { capaId: capa.id, status: "INVESTIGATION" } });
  await logAction({ userId: user.id, action: "ESCALATE", entity: "Complaint", entityId: id, details: { capa: capa.capaNumber } });
  redirect(`/capa/${capa.id}`);
}
