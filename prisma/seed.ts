import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding iClear QMS…");

  // Clean (dev only)
  await prisma.auditLog.deleteMany();
  await prisma.qcInspection.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.productionStep.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.capa.deleteMany();
  await prisma.case.deleteMany();
  await prisma.equipmentEvent.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.materialLot.deleteMany();
  await prisma.material.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.trainingRecord.deleteMany();
  await prisma.risk.deleteMany();
  await prisma.audit.deleteMany();
  await prisma.document.deleteMany();
  await prisma.user.deleteMany();

  const pw = await bcrypt.hash("iclear123", 10);
  const [admin, tech, op1, op2, qc, sales] = await Promise.all([
    prisma.user.create({ data: { email: "admin@iclear.al", name: "Edison Shimaj", role: "CEO", passwordHash: pw } }),
    prisma.user.create({ data: { email: "tech@iclear.al", name: "Drejtori Teknik", role: "TECHNICAL_DIRECTOR", passwordHash: pw } }),
    prisma.user.create({ data: { email: "op1@iclear.al", name: "Operatori A", role: "OPERATOR", passwordHash: pw } }),
    prisma.user.create({ data: { email: "op2@iclear.al", name: "Operatori B", role: "OPERATOR", passwordHash: pw } }),
    prisma.user.create({ data: { email: "qc@iclear.al", name: "Inspektori QC", role: "QC", passwordHash: pw } }),
    prisma.user.create({ data: { email: "sales@iclear.al", name: "Shitjet", role: "SALES", passwordHash: pw } }),
  ]);

  // Suppliers + materials + lots
  const resinSup = await prisma.supplier.create({
    data: { code: "SUP-001", name: "ResinTech GmbH", type: "RESIN", status: "APPROVED", score: 94 },
  });
  const filmSup = await prisma.supplier.create({
    data: { code: "SUP-002", name: "ClearFilm Ltd", type: "FILM", status: "APPROVED", score: 88 },
  });
  const resin = await prisma.material.create({
    data: { code: "MAT-RES-01", name: "Dental Model Resin", type: "RESIN", supplierId: resinSup.id },
  });
  const film = await prisma.material.create({
    data: { code: "MAT-FLM-01", name: "Aligner Film 0.76mm", type: "THERMOFORM_FILM", supplierId: filmSup.id },
  });
  const resinLot = await prisma.materialLot.create({
    data: { lotNumber: "RES-2026-0148", materialId: resin.id, supplierId: resinSup.id, status: "ACCEPTED",
      expiryDate: new Date("2027-01-15"), quantity: 5, qtyRemaining: 3.4 },
  });
  const filmLot = await prisma.materialLot.create({
    data: { lotNumber: "FLM-2026-0072", materialId: film.id, supplierId: filmSup.id, status: "ACCEPTED",
      expiryDate: new Date("2028-06-01"), quantity: 500, qtyRemaining: 420 },
  });

  // Equipment
  const printer = await prisma.equipment.create({
    data: { code: "RF880", name: "Printer 3D RF880", type: "PRINTER", location: "Lab A", status: "OPERATIONAL", installedAt: new Date("2025-03-01") },
  });
  const thermo = await prisma.equipment.create({
    data: { code: "TF200", name: "Termoformues TF200", type: "THERMOFORMER", location: "Lab A", status: "OPERATIONAL", installedAt: new Date("2025-04-10") },
  });
  const laser = await prisma.equipment.create({
    data: { code: "LZ50", name: "Lazer Gravimi LZ50", type: "LASER", location: "Lab B", status: "OPERATIONAL" },
  });
  await prisma.equipmentEvent.create({
    data: { equipmentId: printer.id, type: "CALIBRATION", performedById: tech.id, notes: "Kalibrim javor", nextDue: new Date("2026-07-07") },
  });

  // Helper to build a case at a given stage
  const STAGES = ["RECEIVED","DESIGN","PLAN_APPROVAL","PRINTING","POST_PROCESS","THERMOFORMING","TRIMMING","LASER_MARKING","FINAL_QC","PACKAGING","SHIPPING"];
  async function makeCase(n: number, opts: { stage: string; status: string; doctor: string; aligners: number; priority?: string; hold?: string }) {
    const idx = STAGES.indexOf(opts.stage);
    const c = await prisma.case.create({
      data: {
        caseNumber: `IC-2026-${String(n).padStart(4, "0")}`,
        patientRef: `PT-${String(1000 + n)}`,
        doctorName: opts.doctor,
        doctorClinic: "Klinika Dentare",
        stlVersion: "v1.0",
        alignerCount: opts.aligners,
        priority: opts.priority ?? "NORMAL",
        stage: opts.stage,
        status: opts.status,
        holdReason: opts.hold ?? null,
        createdById: sales.id,
        dueDate: new Date(Date.now() + (3 + n) * 86400000),
      },
    });
    // create steps up to current stage
    for (let i = 0; i <= idx; i++) {
      const st = STAGES[i];
      const isCurrent = i === idx;
      const passed = !isCurrent || ["COMPLETED", "SHIPPED"].includes(opts.status);
      await prisma.productionStep.create({
        data: {
          caseId: c.id,
          stage: st,
          status: opts.hold && isCurrent ? "HOLD" : passed ? "PASSED" : "IN_PROGRESS",
          operatorId: [op1.id, op2.id][i % 2],
          equipmentId: st === "PRINTING" ? printer.id : st === "THERMOFORMING" ? thermo.id : st === "LASER_MARKING" ? laser.id : null,
          materialLotId: st === "PRINTING" ? resinLot.id : st === "THERMOFORMING" ? filmLot.id : null,
          startedAt: new Date(Date.now() - (idx - i + 1) * 3600000),
          completedAt: passed ? new Date(Date.now() - (idx - i) * 3600000) : null,
          parameters: st === "PRINTING" ? JSON.stringify({ layerHeight: "50µm", exposure: "2.5s", temp: "28°C" }) : null,
        },
      });
    }
    // receiving inspection
    await prisma.qcInspection.create({
      data: { caseId: c.id, type: "INCOMING", result: "PASS", inspectorId: qc.id,
        checklist: JSON.stringify({ stl_opens: true, missing_teeth: true, artifacts: true, scan_quality: true, margin: true }),
        eSignature: `${qc.name} · ${new Date().toISOString()}` },
    });
    if (idx >= 8) {
      await prisma.qcInspection.create({
        data: { caseId: c.id, type: "FINAL", result: "PASS", inspectorId: tech.id,
          eSignature: `${tech.name} · ${new Date().toISOString()}` },
      });
    }
    return c;
  }

  await makeCase(1, { stage: "SHIPPING", status: "SHIPPED", doctor: "Dr. Ana Hoxha", aligners: 18 });
  await makeCase(2, { stage: "FINAL_QC", status: "IN_PRODUCTION", doctor: "Dr. Besnik Krasniqi", aligners: 22 });
  await makeCase(3, { stage: "PRINTING", status: "IN_PRODUCTION", doctor: "Dr. Ana Hoxha", aligners: 14, priority: "RUSH" });
  await makeCase(4, { stage: "THERMOFORMING", status: "IN_PRODUCTION", doctor: "Dr. Lorena Dani", aligners: 26 });
  const held = await makeCase(5, { stage: "DESIGN", status: "ON_HOLD", doctor: "Dr. Besnik Krasniqi", aligners: 0, hold: "Skanim me cilësi të ulët" });
  await makeCase(6, { stage: "RECEIVED", status: "OPEN", doctor: "Dr. Lorena Dani", aligners: 20 });

  // a shipment for case 1
  const c1 = await prisma.case.findFirst({ where: { caseNumber: "IC-2026-0001" } });
  if (c1) {
    await prisma.shipment.create({
      data: { caseId: c1.id, trackingNumber: "TRK-99481", carrier: "DHL", shippedAt: new Date(), releasedById: tech.id },
    });
  }

  // CAPA / complaint / risk / training / docs
  await prisma.capa.create({
    data: { capaNumber: "CAPA-2026-001", source: "INTERNAL", description: "Defekt termoformimi mbi target", rootCause: "Kohë ngrohjeje jashtë intervalit",
      correctiveAction: "Riparametrim TF200", preventiveAction: "Kontroll ditor parametrash", status: "VERIFICATION", ownerId: tech.id },
  });
  await prisma.complaint.create({
    data: { complaintNumber: "CMP-2026-004", doctorName: "Dr. Ana Hoxha", description: "Adaptim i dobët në kuadrantin 2",
      status: "INVESTIGATION", caseId: c1?.id },
  });
  await prisma.risk.createMany({
    data: [
      { process: "3D Printing", hazard: "Printer Failure", probability: 3, severity: 5, riskScore: 15, action: "Mirëmbajtje javore", status: "MITIGATED" },
      { process: "Receiving", hazard: "Wrong Resin", probability: 2, severity: 5, riskScore: 10, action: "Barcode scan", status: "MITIGATED" },
      { process: "Packaging", hazard: "Wrong Patient", probability: 1, severity: 5, riskScore: 5, action: "Verifikim i dyfishtë", status: "MITIGATED" },
    ],
  });
  const comps = ["STL","PRINTER","CURE","THERMO","QC","SHIPPING"];
  for (const u of [op1, op2, qc]) {
    for (const comp of comps) {
      await prisma.trainingRecord.create({
        data: { userId: u.id, competency: comp, level: Math.random() > 0.25 ? "QUALIFIED" : "TRAINING", trainedAt: new Date("2025-12-01"), trainerId: tech.id },
      });
    }
  }
  await prisma.document.createMany({
    data: [
      { code: "QM-001", type: "QM", title: "Quality Manual", version: "1.2", status: "APPROVED", ownerId: admin.id },
      { code: "SOP-001", type: "SOP", title: "Receiving STL Files", version: "1.1", status: "APPROVED", ownerId: tech.id },
      { code: "SOP-005", type: "SOP", title: "3D Printing", version: "1.0", status: "APPROVED", ownerId: tech.id },
      { code: "SOP-008", type: "SOP", title: "Thermoforming", version: "1.0", status: "APPROVED", ownerId: tech.id },
      { code: "SOP-010", type: "SOP", title: "Final Inspection", version: "1.0", status: "REVIEW", ownerId: qc.id },
    ],
  });

  console.log("Seed complete. Login: admin@iclear.al / iclear123");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
