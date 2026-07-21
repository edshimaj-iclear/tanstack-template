import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import {
  Download,
  FileText,
  FileCheck2,
  FileClock,
  FilePen,
  Files,
  AlertTriangle,
  ShieldCheck,
  Link2,
  CalendarClock,
  ChevronRight,
  CheckCircle2,
  History,
  MessageSquare,
} from "lucide-react";
import { PageHeader, SectionHeading } from "../../components/qms/PageHeader";
import { MetricCard } from "../../components/qms/MetricCard";
import { ProgressRing } from "../../components/qms/ProgressRing";
import { StatusBadge } from "../../components/qms/StatusBadge";
import { ApprovalStepper, type Step } from "../../components/qms/ApprovalStepper";
import { Timeline, type TimelineItem } from "../../components/qms/Timeline";
import { LabeledValue, MetaGrid } from "../../components/qms/LabeledValue";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { TECH_FILE_READINESS, TECH_DOC_SECTIONS } from "../../data/technical-documentation";
import type { TechDocSection } from "../../types";
import { formatDate } from "../../lib/utils";

export const Route = createFileRoute("/_app/technical-documentation")({
  component: TechnicalDocumentationPage,
});

/* ------------------------------------------------------------------ */
/*  Derivations                                                        */
/* ------------------------------------------------------------------ */

type CompletionTone = "success" | "brand" | "warning" | "danger";

function completionTone(v: number): CompletionTone {
  if (v >= 90) return "success";
  if (v >= 75) return "brand";
  if (v >= 55) return "warning";
  return "danger";
}

const accentBar: Record<CompletionTone, string> = {
  success: "bg-emerald-500",
  brand: "bg-brand-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

const STEP_LABELS = [
  "Author",
  "Quality Review",
  "Regulatory Review",
  "Final Approval",
  "Effective",
];

/** Map a document status to the "current" step index in the approval flow. */
function currentStepIndex(status: TechDocSection["status"]): number {
  switch (status) {
    case "Draft":
      return 0;
    case "In Review":
      return 1;
    case "Approved":
      return 4; // through final approval, awaiting effective release
    case "Effective":
      return 5; // fully complete
    case "Superseded":
    case "Obsolete":
      return 5;
    default:
      return 0;
  }
}

function buildSteps(section: TechDocSection): Step[] {
  const current = currentStepIndex(section.status);
  const meta = [
    section.owner,
    section.reviewer,
    "Genti Hoxha",
    "Edison Shimaj",
    formatDate(section.reviewDate, { month: "short", day: "numeric" }),
  ];
  return STEP_LABELS.map((label, i) => ({
    label,
    state: i < current ? "done" : i === current ? "current" : "upcoming",
    meta: i <= current ? meta[i] : undefined,
  }));
}

/** Mock version history derived from the section's current version. */
function buildHistory(section: TechDocSection): TimelineItem[] {
  const [maj, min] = section.version.split(".").map(Number);
  const prevMinor = `${maj}.${Math.max(0, (min || 1) - 1)}`;
  const prevMajor = `${Math.max(1, maj - 1)}.0`;
  const finalTone = section.status === "Draft" ? "warning" : "success";
  return [
    {
      title: (
        <span>
          <span className="font-mono text-[13px]">v{section.version}</span>{" "}
          {section.status === "Draft"
            ? "in draft"
            : section.status === "In Review"
              ? "under review"
              : section.status === "Approved"
                ? "approved"
                : "released as effective"}
        </span>
      ),
      time: formatDate(section.reviewDate),
      description:
        section.status === "Effective"
          ? "Released to the technical file and locked under document control."
          : section.status === "Approved"
            ? "Approved by regulatory lead — pending effective release."
            : "Working revision — changes in progress against the Annex requirement.",
      actor: section.owner,
      tone: finalTone,
      icon: <FileCheck2 />,
    },
    {
      title: (
        <span>
          <span className="font-mono text-[13px]">v{prevMinor}</span> superseded
        </span>
      ),
      time: formatDate(section.reviewDate, { year: "numeric", month: "short" }),
      description: "Editorial and evidence updates incorporated after quality review.",
      actor: section.reviewer,
      tone: "neutral",
      icon: <History />,
    },
    {
      title: (
        <span>
          <span className="font-mono text-[13px]">v{prevMajor}</span> baseline established
        </span>
      ),
      time: "2025",
      description: "Initial controlled release of this technical-file section.",
      actor: "Genti Hoxha",
      tone: "neutral",
      icon: <FileText />,
    },
  ];
}

interface ReviewComment {
  author: string;
  time: string;
  text: string;
  tone: "danger" | "info" | "neutral";
}

function buildComments(section: TechDocSection): ReviewComment[] {
  if (section.missingEvidence.length > 0) {
    return [
      {
        author: section.reviewer,
        time: "3 days ago",
        text: `Cannot close review until outstanding evidence is linked (${section.missingEvidence.length} item${section.missingEvidence.length > 1 ? "s" : ""}). Please attach and re-submit.`,
        tone: "danger",
      },
      {
        author: section.owner,
        time: "1 day ago",
        text: "Acknowledged — coordinating with the V&V team, expected upload this week.",
        tone: "neutral",
      },
    ];
  }
  return [
    {
      author: section.reviewer,
      time: "on approval",
      text: "All GSPR references verified against linked evidence. No open comments.",
      tone: "info",
    },
    {
      author: "Genti Hoxha",
      time: formatDate(section.reviewDate, { month: "short", day: "numeric" }),
      text: "Regulatory review complete — consistent with Annex II structure.",
      tone: "neutral",
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function TechnicalDocumentationPage() {
  const [selectedId, setSelectedId] = useState<string>(TECH_DOC_SECTIONS[0].id);
  const selected = useMemo(
    () => TECH_DOC_SECTIONS.find((s) => s.id === selectedId) ?? TECH_DOC_SECTIONS[0],
    [selectedId],
  );

  const stats = useMemo(() => {
    const effective = TECH_DOC_SECTIONS.filter((s) => s.status === "Effective").length;
    const approved = TECH_DOC_SECTIONS.filter((s) => s.status === "Approved").length;
    const inReview = TECH_DOC_SECTIONS.filter((s) => s.status === "In Review").length;
    const draft = TECH_DOC_SECTIONS.filter((s) => s.status === "Draft").length;
    const missingEvidenceCount = TECH_DOC_SECTIONS.reduce(
      (sum, s) => sum + s.missingEvidence.length,
      0,
    );
    const sectionsWithGaps = TECH_DOC_SECTIONS.filter((s) => s.missingEvidence.length > 0).length;
    const totalLinkedDocs = TECH_DOC_SECTIONS.reduce((sum, s) => sum + s.linkedDocs, 0);
    const lastUpdated = TECH_DOC_SECTIONS.reduce(
      (latest, s) => (s.reviewDate > latest ? s.reviewDate : latest),
      TECH_DOC_SECTIONS[0].reviewDate,
    );
    return {
      effective,
      approved,
      inReview,
      draft,
      complete: effective + approved,
      missingEvidenceCount,
      sectionsWithGaps,
      totalLinkedDocs,
      lastUpdated,
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="MDR Annex II / III · Technical File"
        title="Technical Documentation"
        subtitle="Structured technical file for CE marking — every Annex II/III section, its evidence, owner and approval state in one cockpit."
        actions={
          <>
            <Select defaultValue="adults" className="w-[220px]">
              <option value="adults">iClear Aligners for Adults</option>
              <option value="teens">iClear Aligners for Teens</option>
              <option value="retainers">iClear Retention System</option>
            </Select>
            <Button>
              <Download className="size-4" /> Export technical file
            </Button>
          </>
        }
      />

      {/* Readiness panel */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 grid-dots opacity-[0.15]" />
        <CardContent className="relative py-6">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[auto_1fr]">
            <div className="flex flex-col items-center">
              <Badge tone="brand" className="mb-4">
                <ShieldCheck className="size-3.5" /> Technical File Readiness
              </Badge>
              <ProgressRing
                value={TECH_FILE_READINESS}
                size={196}
                strokeWidth={16}
                label="Readiness"
              />
              <p className="mt-4 max-w-[240px] text-center text-sm text-fg-secondary">
                On track for Notified Body submission.{" "}
                <span className="font-semibold text-amber-600">{stats.sectionsWithGaps} sections</span>{" "}
                still have open evidence.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <ReadinessStat
                icon={FileCheck2}
                tone="success"
                value={`${stats.complete}/${TECH_DOC_SECTIONS.length}`}
                label="Sections complete"
                hint="Effective or approved"
              />
              <ReadinessStat
                icon={FileClock}
                tone="info"
                value={stats.inReview}
                label="In review"
                hint="Awaiting sign-off"
              />
              <ReadinessStat
                icon={AlertTriangle}
                tone="danger"
                value={stats.missingEvidenceCount}
                label="Missing evidence"
                hint={`${stats.sectionsWithGaps} sections affected`}
              />
              <ReadinessStat
                icon={CalendarClock}
                tone="neutral"
                value={formatDate(stats.lastUpdated, { month: "short", day: "numeric" })}
                label="Last updated"
                hint={formatDate(stats.lastUpdated, { year: "numeric" })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Effective sections" value={stats.effective} icon={FileCheck2} tone="success" hint="Locked & released" />
        <MetricCard label="In review" value={stats.inReview} icon={FileClock} tone="info" hint="Under sign-off" />
        <MetricCard label="Draft" value={stats.draft} icon={FilePen} tone="warning" hint="Work in progress" />
        <MetricCard label="Linked documents" value={stats.totalLinkedDocs} icon={Files} tone="brand" hint="Across all sections" />
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* LEFT — document tree / checklist */}
        <div className="lg:col-span-3">
          <SectionHeading
            title="Technical file structure"
            description="Select a section to inspect its evidence, owner and approval state"
          />
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-[var(--border-base)]">
                {TECH_DOC_SECTIONS.map((section) => {
                  const active = section.id === selectedId;
                  const tone = completionTone(section.completion);
                  const gaps = section.missingEvidence.length;
                  return (
                    <li key={section.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(section.id)}
                        className={`group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors ${
                          active ? "bg-brand-50/70" : "hover:bg-subtle"
                        }`}
                      >
                        <span
                          className={`h-9 w-1 shrink-0 rounded-full ${accentBar[tone]} ${active ? "" : "opacity-70"}`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-semibold text-fg">
                              {section.name}
                            </span>
                            {gaps > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-1.5 py-0.5 text-[11px] font-semibold text-red-600">
                                <AlertTriangle className="size-3" />
                                {gaps}
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="font-mono text-[11px] text-fg-muted">
                              {section.id} · {section.annex}
                            </span>
                          </div>
                        </div>

                        <div className="hidden w-32 shrink-0 sm:block">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-[11px] font-medium text-fg-muted">
                              {section.completion}%
                            </span>
                          </div>
                          <Progress value={section.completion} tone={tone} size="sm" />
                        </div>

                        <div className="hidden w-24 shrink-0 justify-end md:flex">
                          <StatusBadge status={section.status} />
                        </div>

                        <ChevronRight
                          className={`size-4 shrink-0 text-fg-muted transition-transform ${active ? "translate-x-0.5 text-brand-500" : "group-hover:translate-x-0.5"}`}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT — preview panel */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-6">
            <SectionHeading title="Section preview" description="Live view of the selected technical-file section" />
            <SectionPreview section={selected} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

const statToneStyles: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-600",
  info: "bg-blue-50 text-blue-600",
  danger: "bg-red-50 text-red-600",
  neutral: "bg-subtle text-fg-secondary",
};

function ReadinessStat({
  icon: Icon,
  tone,
  value,
  label,
  hint,
}: {
  icon: ComponentType<{ className?: string }>;
  tone: "success" | "info" | "danger" | "neutral";
  value: ReactNode;
  label: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-base)] bg-[var(--bg-surface)]/70 p-4">
      <span className={`inline-flex size-8 items-center justify-center rounded-lg ${statToneStyles[tone]}`}>
        <Icon className="size-4" />
      </span>
      <p className="mt-3 text-2xl font-bold tabular-nums text-fg">{value}</p>
      <p className="text-sm font-medium text-fg-secondary">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-fg-muted">{hint}</p>}
    </div>
  );
}

function SectionPreview({ section }: { section: TechDocSection }) {
  const tone = completionTone(section.completion);
  const steps = buildSteps(section);
  const history = buildHistory(section);
  const comments = buildComments(section);

  return (
    <Card>
      <CardHeader className="gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-xs font-semibold text-brand-600">{section.id}</span>
          <StatusBadge status={section.status} />
        </div>
        <CardTitle className="text-lg">{section.name}</CardTitle>
        <span className="font-mono text-xs text-fg-muted">{section.annex}</span>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Completion + core meta */}
        <div className="flex items-center gap-5 rounded-xl border border-[var(--border-base)] bg-muted-surface p-4">
          <ProgressRing value={section.completion} size={92} strokeWidth={9} tone={tone} animate={false} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Completion</p>
            <p className="text-sm text-fg-secondary">
              {section.completion === 100
                ? "Fully documented and evidenced."
                : `${100 - section.completion}% of required content still outstanding.`}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-fg-muted">
              <Link2 className="size-3.5" />
              {section.linkedDocs} linked document{section.linkedDocs === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        <MetaGrid cols={2}>
          <LabeledValue label="Owner" value={section.owner} />
          <LabeledValue label="Reviewer" value={section.reviewer} />
          <LabeledValue label="Version" value={`v${section.version}`} mono />
          <LabeledValue label="Review date" value={formatDate(section.reviewDate)} />
        </MetaGrid>

        {/* Approval flow */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-fg">Approval workflow</h4>
          <ApprovalStepper steps={steps} />
        </div>

        {/* Missing evidence */}
        {section.missingEvidence.length > 0 ? (
          <div className="rounded-xl border border-red-200 bg-red-50/60 p-4">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-700">
              <AlertTriangle className="size-4" /> Missing evidence ({section.missingEvidence.length})
            </h4>
            <ul className="space-y-1.5">
              {section.missingEvidence.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-red-700">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-red-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-sm text-emerald-700">
            <CheckCircle2 className="size-4 shrink-0" />
            All required evidence linked and verified.
          </div>
        )}

        {/* Version history */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
            <History className="size-4 text-fg-muted" /> Version history
          </h4>
          <Timeline items={history} />
        </div>

        {/* Review comments */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
            <MessageSquare className="size-4 text-fg-muted" /> Review comments
          </h4>
          <div className="space-y-3">
            {comments.map((c, i) => (
              <div
                key={i}
                className={`rounded-lg border p-3 ${
                  c.tone === "danger"
                    ? "border-red-200 bg-red-50/50"
                    : "border-[var(--border-base)] bg-muted-surface"
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-fg">{c.author}</span>
                  <span className="text-[11px] text-fg-muted">{c.time}</span>
                </div>
                <p className={`text-sm ${c.tone === "danger" ? "text-red-700" : "text-fg-secondary"}`}>
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full">
          Open full section <ChevronRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
