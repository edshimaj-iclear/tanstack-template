"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { logAction } from "@/lib/utils";

const NEXT: Record<string, string> = { NONE: "TRAINING", TRAINING: "QUALIFIED", QUALIFIED: "NONE" };

// Cycle a competency NONE -> TRAINING -> QUALIFIED -> NONE
export async function cycleCompetency(userId: string, competency: string) {
  const actor = await getSession();
  if (!actor) redirect("/login");

  const existing = await prisma.trainingRecord.findUnique({
    where: { userId_competency: { userId, competency } },
  });
  const level = NEXT[existing?.level ?? "NONE"] ?? "TRAINING";

  await prisma.trainingRecord.upsert({
    where: { userId_competency: { userId, competency } },
    create: { userId, competency, level, trainerId: actor.id, trainedAt: level === "QUALIFIED" ? new Date() : null },
    update: { level, trainerId: actor.id, trainedAt: level === "QUALIFIED" ? new Date() : null },
  });
  await logAction({ userId: actor.id, action: "TRAINING", entity: "TrainingRecord", entityId: userId, details: { competency, level } });
  revalidatePath("/training");
}
