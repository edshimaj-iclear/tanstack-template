"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { logAction } from "@/lib/utils";

export async function createDocument(formData: FormData) {
  const user = await getSession();
  if (!user) redirect("/login");

  const code = String(formData.get("code") || "").trim().toUpperCase();
  const type = String(formData.get("type") || "SOP");
  const title = String(formData.get("title") || "").trim();
  const version = String(formData.get("version") || "1.0").trim();
  const status = String(formData.get("status") || "DRAFT");
  const content = String(formData.get("content") || "").trim() || null;
  if (!code || !title) return;

  const doc = await prisma.document.create({
    data: {
      code, type, title, version, status, content,
      ownerId: user.id,
      effectiveDate: status === "APPROVED" ? new Date() : null,
    },
  });
  await logAction({ userId: user.id, action: "CREATE", entity: "Document", entityId: doc.id, details: { code, version } });
  revalidatePath("/documents");
}

// Approve / change status (controlled document lifecycle)
export async function setDocStatus(id: string, status: string) {
  const user = await getSession();
  if (!user) redirect("/login");
  await prisma.document.update({
    where: { id },
    data: { status, effectiveDate: status === "APPROVED" ? new Date() : undefined },
  });
  await logAction({ userId: user.id, action: "STATUS", entity: "Document", entityId: id, details: { status } });
  revalidatePath("/documents");
}

// Bump version: marks current OBSOLETE and clones a new DRAFT
export async function reviseDocument(id: string) {
  const user = await getSession();
  if (!user) redirect("/login");
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return;
  const [maj, min] = doc.version.split(".").map((x) => parseInt(x, 10) || 0);
  const nextVer = `${maj}.${min + 1}`;
  await prisma.document.update({ where: { id }, data: { status: "OBSOLETE" } });
  // store the revision as the same code with new version — keep code unique by suffixing the obsolete one
  await prisma.document.update({ where: { id }, data: { code: `${doc.code}~v${doc.version}` } });
  const created = await prisma.document.create({
    data: {
      code: doc.code, type: doc.type, title: doc.title, version: nextVer,
      status: "DRAFT", content: doc.content, ownerId: user.id,
    },
  });
  await logAction({ userId: user.id, action: "REVISE", entity: "Document", entityId: created.id, details: { from: doc.version, to: nextVer } });
  revalidatePath("/documents");
}
