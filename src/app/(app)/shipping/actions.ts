"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession, canRelease } from "@/lib/auth";
import { logAction } from "@/lib/utils";

export async function shipCase(caseId: string, formData: FormData) {
  const user = await getSession();
  if (!user) redirect("/login");
  if (!canRelease(user.role)) {
    throw new Error("Vetëm personi i autorizuar mund të lëshojë dërgesën.");
  }

  const trackingNumber = String(formData.get("trackingNumber") || "").trim() || null;
  const carrier = String(formData.get("carrier") || "").trim() || null;

  await prisma.shipment.upsert({
    where: { caseId },
    create: { caseId, trackingNumber, carrier, shippedAt: new Date(), releasedById: user.id },
    update: { trackingNumber, carrier, shippedAt: new Date(), releasedById: user.id },
  });

  await prisma.case.update({
    where: { id: caseId },
    data: {
      stage: "SHIPPING", status: "SHIPPED",
      steps: { create: { stage: "SHIPPING", status: "PASSED", operatorId: user.id, startedAt: new Date(), completedAt: new Date(), notes: carrier ? `Dërguar me ${carrier}` : "Dërguar" } },
    },
  });

  await logAction({ userId: user.id, action: "SHIP", entity: "Case", entityId: caseId, details: { trackingNumber, carrier } });
  revalidatePath("/shipping");
  revalidatePath(`/cases/${caseId}`);
}
