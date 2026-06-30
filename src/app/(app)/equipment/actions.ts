"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { logAction } from "@/lib/utils";

export async function createEquipment(formData: FormData) {
  const user = await getSession();
  if (!user) redirect("/login");
  const code = String(formData.get("code") || "").trim().toUpperCase();
  const name = String(formData.get("name") || "").trim();
  const type = String(formData.get("type") || "PRINTER");
  const location = String(formData.get("location") || "").trim() || null;
  if (!code || !name) return;
  const e = await prisma.equipment.create({ data: { code, name, type, location, status: "OPERATIONAL", installedAt: new Date() } });
  await logAction({ userId: user.id, action: "CREATE", entity: "Equipment", entityId: e.id, details: { code } });
  revalidatePath("/equipment");
}

export async function addEvent(equipmentId: string, formData: FormData) {
  const user = await getSession();
  if (!user) redirect("/login");
  const type = String(formData.get("type") || "MAINTENANCE");
  const notes = String(formData.get("notes") || "").trim() || null;
  const nextRaw = String(formData.get("nextDue") || "");
  const nextDue = nextRaw ? new Date(nextRaw) : null;

  await prisma.equipmentEvent.create({
    data: { equipmentId, type, notes, nextDue, performedById: user.id },
  });
  // Maintenance/down events flip status; qualification keeps operational
  if (type === "MAINTENANCE") {
    await prisma.equipment.update({ where: { id: equipmentId }, data: { status: "OPERATIONAL" } });
  }
  await logAction({ userId: user.id, action: "EVENT", entity: "Equipment", entityId: equipmentId, details: { type } });
  revalidatePath(`/equipment/${equipmentId}`);
}

export async function setEquipmentStatus(id: string, status: string) {
  const user = await getSession();
  if (!user) redirect("/login");
  await prisma.equipment.update({ where: { id }, data: { status } });
  await logAction({ userId: user.id, action: "STATUS", entity: "Equipment", entityId: id, details: { status } });
  revalidatePath(`/equipment/${id}`);
  revalidatePath("/equipment");
}
