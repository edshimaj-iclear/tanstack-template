import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  FileText,
  CheckCircle2,
  ClipboardCheck,
  CalendarClock,
  Plus,
  ChevronDown,
  Bookmark,
  GraduationCap,
  History,
  Link2,
  ShieldAlert,
  Workflow,
  FileCheck2,
  PenLine,
  Download,
} from "lucide-react";
import { PageHeader } from "../../components/qms/PageHeader";
import { MetricCard } from "../../components/qms/MetricCard";
import { StatusBadge } from "../../components/qms/StatusBadge";
import { ApprovalStepper } from "../../components/qms/ApprovalStepper";
import type { Step } from "../../components/qms/ApprovalStepper";
import { Timeline } from "../../components/qms/Timeline";
import type { TimelineItem } from "../../components/qms/Timeline";
import { FilterBar, FilterChips } from "../../components/qms/FilterBar";
import { LabeledValue, MetaGrid } from "../../components/qms/LabeledValue";
import { DataTable } from "../../components/tables/DataTable";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Select } from "../../components/ui/select";
import { Avatar } from "../../components/ui/misc";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import { DOCUMENTS, DOC_STATUSES } from "../../data/documents";
import type { QmsDocument } from "../../types";
import { formatDate, daysUntil, relativeDeadline, cn } from "../../lib/utils";

export const Route = createFileRoute("/_app/documents")({
  component: DocumentsPage,
});

/** The Quality Manager operating the document-control module. */
const CURRENT_USER = "Anila Berisha";

type SavedView = "all" | "mine" | "pending" | "expiring";

const SAVED_VIEWS: { label: string; value: SavedView }[] = [
  { label: "All documents", value: "all" },
  { label: "My documents", value: "mine" },
  { label: "Pending my approval", value: "pending" },
  { label: "Expiring soon", value: "expiring" },
];

function matchesView(doc: QmsDocument, view: SavedView) {
  switch (view) {
    case "mine":
      return doc.owner === CURRENT_USER;
    case "pending":
      return doc.status === "In Review" || doc.status === "Approved";
    case "expiring": {
      const d = daysUntil(doc.reviewDate);
      return d <= 30;
    }
    default:
      return true;
  }
}

const STEP_LABELS = [
  "Author",
  "Quality Review",
  "Regulatory Review",
  "Final Approval",
  "Effective",
];

const STEP_ACTORS = [
  "Fatjon Rama",
  "Anila Berisha",
  "Genti Hoxha",
  "Edison Shimaj",
  "—",
];

function buildSteps(doc: QmsDocument): Step[] {
  const terminal =
    doc.status === "Effective" ||
    doc.status === "Superseded" ||
    doc.status === "Obsolete";
  let doneCount: number;
  if (terminal) doneCount = 5;
  else if (doc.status === "Approved") doneCount = 4;
  else doneCount = Math.min(4, Math.floor(doc.approvalProgress / 20));

  return STEP_LABELS.map((label, i) => {
    const state: Step["state"] =
      i < doneCount ? "done" : i === doneCount ? "current" : "upcoming";
    const actor = i === 0 ? doc.owner : STEP_ACTORS[i];
    return {
      label,
      state,
      meta: state === "done" ? actor : state === "current" ? "in progress" : undefined,
    };
  });
}

function buildVersionHistory(doc: QmsDocument): TimelineItem[] {
  const major = parseInt(doc.version, 10) || 1;
  const items: TimelineItem[] = [];
  const years = ["2026", "2025", "2024"];
  for (let idx = 0; idx < 3; idx++) {
    const v = major - idx;
    if (v < 1) break;
    if (idx === 0) {
      items.push({
        title: `v${doc.version}`,
        time: years[idx],
        description: doc.status,
        tone: docStatusTone(doc.status),
        actor: doc.owner,
      });
    } else if (idx === 1) {
      items.push({
        title: `v${v}.0`,
        time: years[idx],
        description: "Superseded — replaced by current revision",
        tone: "warning",
        actor: doc.owner,
      });
    } else {
      items.push({
        title: `v${v}.0`,
        time: years[idx],
        description: "Obsolete — archived, withdrawn from use",
        tone: "neutral",
        actor: doc.owner,
      });
    }
  }
  return items;
}

function buildAuditTrail(doc: QmsDocument): TimelineItem[] {
  const items: TimelineItem[] = [
    {
      title: <>Document created</>,
      time: formatDate(doc.effectiveDate === "—" ? "2025-12-01" : doc.effectiveDate),
      description: `Initial draft ${doc.code} raised in the QMS.`,
      actor: doc.owner,
      tone: "info",
      icon: <PenLine />,
    },
    {
      title: <>Quality review completed</>,
      time: "12 Jun 2026",
      description: "Reviewed for accuracy, formatting and cross-references.",
      actor: "Anila Berisha",
      tone: "brand",
      icon: <ClipboardCheck />,
    },
  ];
  if (doc.approvalProgress >= 80) {
    items.push({
      title: <>Regulatory review approved</>,
      time: "28 Jun 2026",
      description: "Confirmed alignment with MDR 2017/745 and ISO 13485.",
      actor: "Genti Hoxha",
      tone: "regulatory",
      icon: <ShieldAlert />,
    });
  }
  if (doc.status === "Effective" || doc.status === "Approved") {
    items.push({
      title: <>Released and made effective</>,
      time: formatDate(doc.effectiveDate),
      description: `Approved by management and published to controlled library.`,
      actor: "Edison Shimaj",
      tone: "success",
      icon: <CheckCircle2 />,
    });
  }
  return items;
}

function docStatusTone(status: QmsDocument["status"]): TimelineItem["tone"] {
  switch (status) {
    case "Effective":
    case "Approved":
      return "success";
    case "In Review":
      return "info";
    case "Draft":
      return "neutral";
    default:
      return "warning";
  }
}

const REVIEWERS = ["Anila Berisha", "Genti Hoxha", "Besnik Lami"];

function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<SavedView>("all");
  const [status, setStatus] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [selected, setSelected] = useState<QmsDocument | null>(null);

  const metrics = useMemo(() => {
    const total = DOCUMENTS.length;
    const effective = DOCUMENTS.filter((d) => d.status === "Effective").length;
    const pending = DOCUMENTS.filter(
      (d) => d.status === "In Review" || d.status === "Approved",
    ).length;
    const expiring = DOCUMENTS.filter((d) => {
      const days = daysUntil(d.reviewDate);
      return (
        days <= 30 &&
        d.status !== "Superseded" &&
        d.status !== "Obsolete"
      );
    }).length;
    return { total, effective, pending, expiring };
  }, []);

  const statusOptions = useMemo(() => {
    return [
      { label: "All statuses", value: "all", count: DOCUMENTS.length },
      ...DOC_STATUSES.map((s) => ({
        label: s,
        value: s,
        count: DOCUMENTS.filter((d) => d.status === s).length,
      })),
    ];
  }, []);

  const filtered = useMemo(() => {
    return DOCUMENTS.filter((d) => {
      const matchView = matchesView(d, view);
      const matchStatus = status === "all" || d.status === status;
      const matchCategory = category === "all" || d.category === category;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        `${d.code} ${d.title} ${d.category} ${d.department} ${d.owner}`
          .toLowerCase()
          .includes(q);
      return matchView && matchStatus && matchCategory && matchSearch;
    });
  }, [view, status, category, search]);

  const columns: ColumnDef<QmsDocument>[] = [
    {
      accessorKey: "code",
      header: "Document Code",
      cell: ({ row }) => (
        <span className="font-mono text-[13px] font-semibold text-fg">
          {row.original.code}
        </span>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <p className="max-w-[260px] truncate font-medium text-fg">
          {row.original.title}
        </p>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge tone="outline" className="whitespace-nowrap">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-fg-secondary">
          {row.original.department}
        </span>
      ),
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.original.owner} size="xs" />
          <span className="whitespace-nowrap text-sm text-fg-secondary">
            {row.original.owner}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "version",
      header: "Ver.",
      cell: ({ row }) => (
        <span className="font-mono text-[13px] text-fg-secondary">
          v{row.original.version}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "effectiveDate",
      header: "Effective",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-fg-secondary">
          {row.original.effectiveDate === "—"
            ? "—"
            : formatDate(row.original.effectiveDate)}
        </span>
      ),
    },
    {
      accessorKey: "reviewDate",
      header: "Review Due",
      cell: ({ row }) => {
        const overdue = daysUntil(row.original.reviewDate) < 0;
        return (
          <span
            className={cn(
              "whitespace-nowrap text-sm font-medium",
              overdue ? "text-red-600" : "text-fg-secondary",
            )}
          >
            {relativeDeadline(row.original.reviewDate)}
          </span>
        );
      },
    },
    {
      accessorKey: "trainingRequired",
      header: "Training",
      cell: ({ row }) =>
        row.original.trainingRequired ? (
          <Badge tone="info">Yes</Badge>
        ) : (
          <Badge tone="neutral">No</Badge>
        ),
    },
    {
      accessorKey: "approvalProgress",
      header: "Approval",
      cell: ({ row }) => (
        <div className="flex w-28 items-center gap-2">
          <Progress
            value={row.original.approvalProgress}
            size="sm"
            className="flex-1"
          />
          <span className="w-8 text-right text-xs tabular-nums text-fg-muted">
            {row.original.approvalProgress}%
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Document Control"
        title="Document Control"
        subtitle="Controlled document lifecycle, approvals and periodic review across the ISO 13485 QMS."
        actions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">
                  <Bookmark className="size-4" /> Saved views
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Saved views</DropdownMenuLabel>
                {SAVED_VIEWS.map((v) => (
                  <DropdownMenuItem
                    key={v.value}
                    onSelect={() => setView(v.value)}
                  >
                    {v.value === view && (
                      <CheckCircle2 className="size-4 text-brand-600" />
                    )}
                    <span className={v.value === view ? "font-medium text-fg" : ""}>
                      {v.label}
                    </span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Download className="size-4" /> Export register
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <Plus className="size-4" /> New document
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Controlled documents"
          value={metrics.total}
          icon={FileText}
          tone="brand"
          hint="in the QMS library"
        />
        <MetricCard
          label="Effective"
          value={metrics.effective}
          icon={CheckCircle2}
          tone="success"
          hint="current & released"
        />
        <MetricCard
          label="Pending approval"
          value={metrics.pending}
          icon={ClipboardCheck}
          tone="info"
          hint="in review or approved"
        />
        <MetricCard
          label="Review due (30d)"
          value={metrics.expiring}
          icon={CalendarClock}
          tone="warning"
          hint="periodic review approaching"
        />
      </div>

      {/* Saved views */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
          Saved views
        </span>
        <FilterChips
          options={SAVED_VIEWS}
          value={view}
          onChange={(v) => setView(v)}
        />
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search code, title, department, owner…"
        right={
          <div className="flex items-center gap-2">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Category"
            >
              <option value="all">All categories</option>
              {[...new Set(DOCUMENTS.map((d) => d.category))].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Badge tone="neutral">
              {filtered.length} of {DOCUMENTS.length}
            </Badge>
          </div>
        }
      >
        <FilterChips
          options={statusOptions}
          value={status}
          onChange={(v) => setStatus(v)}
        />
      </FilterBar>

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={setSelected}
        pageSize={12}
        emptyMessage="No documents match the current filters."
      />

      {/* Detail drawer */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent widthClassName="w-full max-w-2xl">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-brand-600">
                    {selected.code}
                  </span>
                  <StatusBadge status={selected.status} />
                  <Badge tone="outline">v{selected.version}</Badge>
                </div>
                <SheetTitle>{selected.title}</SheetTitle>
                <p className="text-sm text-fg-muted">
                  {selected.category} · {selected.department}
                </p>
              </SheetHeader>
              <SheetBody className="space-y-7">
                {/* Metadata */}
                <MetaGrid cols={3}>
                  <LabeledValue label="Owner" value={selected.owner} />
                  <LabeledValue label="Department" value={selected.department} />
                  <LabeledValue label="Version" value={`v${selected.version}`} mono />
                  <LabeledValue
                    label="Effective date"
                    value={
                      selected.effectiveDate === "—"
                        ? "Not yet effective"
                        : formatDate(selected.effectiveDate)
                    }
                  />
                  <LabeledValue
                    label="Next review"
                    value={
                      <span
                        className={
                          daysUntil(selected.reviewDate) < 0
                            ? "text-red-600"
                            : undefined
                        }
                      >
                        {formatDate(selected.reviewDate)}
                        <span className="ml-1 text-xs text-fg-muted">
                          ({relativeDeadline(selected.reviewDate)})
                        </span>
                      </span>
                    }
                  />
                  <LabeledValue
                    label="Training"
                    value={
                      selected.trainingRequired ? (
                        <Badge tone="info">Required</Badge>
                      ) : (
                        <Badge tone="neutral">Not required</Badge>
                      )
                    }
                  />
                </MetaGrid>

                {/* Approval stepper */}
                <div>
                  <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-fg">
                    <Workflow className="size-4 text-brand-600" /> Approval workflow
                  </h4>
                  <ApprovalStepper steps={buildSteps(selected)} />
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-xs text-fg-muted">
                      <span>Approval progress</span>
                      <span className="tabular-nums">
                        {selected.approvalProgress}%
                      </span>
                    </div>
                    <Progress value={selected.approvalProgress} size="sm" />
                  </div>
                </div>

                {/* Reviewers */}
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-fg">
                    Reviewers & approvers
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {[selected.owner, ...REVIEWERS.filter((r) => r !== selected.owner)]
                      .slice(0, 4)
                      .map((name, i) => (
                        <div key={name} className="flex items-center gap-2">
                          <Avatar name={name} size="sm" />
                          <div className="leading-tight">
                            <p className="text-sm font-medium text-fg">{name}</p>
                            <p className="text-xs text-fg-muted">
                              {i === 0 ? "Author / owner" : STEP_LABELS[i]}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Training assignments */}
                <div className="rounded-xl border border-[var(--border-base)] bg-muted-surface p-4">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg">
                    <GraduationCap className="size-4 text-brand-600" /> Training
                    assignments
                  </h4>
                  {selected.trainingRequired ? (
                    <>
                      <p className="text-sm text-fg-secondary">
                        Read-and-understand training assigned to affected roles in{" "}
                        {selected.department}.
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <Progress value={75} tone="success" size="sm" className="flex-1" />
                        <span className="text-xs font-medium tabular-nums text-fg-secondary">
                          18 / 24 trained
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-fg-secondary">
                      No training is required for this document.
                    </p>
                  )}
                </div>

                {/* Version history */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
                    <History className="size-4 text-brand-600" /> Version history
                  </h4>
                  <Timeline items={buildVersionHistory(selected)} />
                </div>

                {/* Linked records */}
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-fg">
                    Linked records
                  </h4>
                  <MetaGrid cols={2}>
                    <LabeledValue
                      label="Related CAPA"
                      value={
                        <span className="inline-flex items-center gap-1 font-mono text-[13px]">
                          <Link2 className="size-3.5 text-fg-muted" /> CAPA-2026-024
                        </span>
                      }
                    />
                    <LabeledValue
                      label="Related risk"
                      value={
                        <span className="inline-flex items-center gap-1 font-mono text-[13px]">
                          <Link2 className="size-3.5 text-fg-muted" /> RSK-018
                        </span>
                      }
                    />
                    <LabeledValue
                      label="Related process"
                      value={
                        <span className="inline-flex items-center gap-1">
                          <Workflow className="size-3.5 text-fg-muted" /> Document Control
                        </span>
                      }
                    />
                    <LabeledValue
                      label="Supersedes"
                      value={
                        <span className="font-mono text-[13px]">
                          {(parseInt(selected.version, 10) || 1) > 1
                            ? `${selected.code} v${(parseInt(selected.version, 10) || 1) - 1}.0`
                            : "—"}
                        </span>
                      }
                    />
                  </MetaGrid>
                </div>

                {/* Audit trail */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
                    <FileCheck2 className="size-4 text-brand-600" /> Audit trail
                  </h4>
                  <Timeline items={buildAuditTrail(selected)} />
                </div>

                <div className="flex gap-2 pt-1">
                  <Button className="flex-1">
                    <FileText className="size-4" /> Open document
                  </Button>
                  <Button variant="secondary">Start revision</Button>
                </div>
              </SheetBody>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
