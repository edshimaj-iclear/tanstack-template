"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { logAction } from "@/lib/utils";

export async function createSupplier(formData: FormData) {
  const user = await getSession();
  if (!user) redirect("/login");
  const code = String(formData.get("code") || "").trim().toUpperCase();
  const name = String(formData.get("name") || "").trim();
  const type = String(formData.get("type") || "RESIN");
  const score = parseInt(String(formData.get("score") || ""), 10);
  if (!code || !name) return;
  const s = await prisma.supplier.create({
    data: { code, name, type, status: "PENDING", score: Number.isFinite(score) ? score : null },
  });
  await logAction({ userId: user.id, action: "CREATE", entity: "Supplier", entityId: s.id, details: { code } });
  revalidatePath("/suppliers");
}

export async function setSupplierStatus(id: string, status: string) {
  const user = await getSession();
  if (!user) redirect("/login");
  await prisma.supplier.update({ where: { id }, data: { status } });
  await logAction({ userId: user.id, action: "STATUS", entity: "Supplier", entityId: id, details: { status } });
  revalidatePath("/suppliers");
}

export async function createLot(formData: FormData) {
  const user = await getSession();
  if (!user) redirect("/login");
  const lotNumber = String(formData.get("lotNumber") || "").trim();
  const materialId = String(formData.get("materialId") || "").trim();
  const expiryRaw = String(formData.get("expiryDate") || "");
  const quantity = parseFloat(String(formData.get("quantity") || "")) || null;
  if (!lotNumber || !materialId) return;

  const material = await prisma.material.findUnique({ where: { id: materialId } });
  const lot = await prisma.materialLot.create({
    data: {
      lotNumber, materialId, supplierId: material?.supplierId ?? null,
      expiryDate: expiryRaw ? new Date(expiryRaw) : null,
      quantity, qtyRemaining: quantity, status: "QUARANTINE",
    },
  });
  await logAction({ userId: user.id, action: "CREATE", entity: "MaterialLot", entityId: lot.id, details: { lotNumber } });
  revalidatePath("/suppliers");
}

// Incoming inspection decision (Module 12)
export async function inspectLot(id: string, decision: "ACCEPTED" | "REJECTED") {
  const user = await getSession();
  if (!user) redirect("/login");
  await prisma.materialLot.update({ where: { id }, data: { status: decision } });
  await prisma.qcInspection.create({
    data: {
      type: "INCOMING", result: decision === "ACCEPTED" ? "PASS" : "FAIL",
      inspectorId: user.id, eSignature: `${user.name} · ${new Date().toISOString()}`,
      checklist: JSON.stringify({ lot: id, decision }),
    },
  });
  await logAction({ userId: user.id, action: "INSPECT", entity: "MaterialLot", entityId: id, details: { decision } });
  revalidatePath("/suppliers");
}
