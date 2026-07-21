import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import {
  CalendarDays,
  CalendarRange,
  List as ListIcon,
  Plus,
  Bell,
  X,
  ChevronLeft,
  ChevronRight,
  Building2,
  User,
  ShieldAlert,
} from "lucide-react";
import { PageHeader } from "../../components/qms/PageHeader";
import { Timeline } from "../../components/qms/Timeline";
import type { TimelineItem } from "../../components/qms/Timeline";
import { FilterChips } from "../../components/qms/FilterBar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  CAL_EVENTS,
  EVENT_TONES,
  EVENT_TYPES,
  type EventType,
} from "../../data/calendar";
import type { CalendarEvent } from "../../types";
import { cn, formatDate, daysUntil, relativeDeadline } from "../../lib/utils";

export const Route = createFileRoute("/_app/calendar")({
  component: CalendarPage,
});

type ViewMode = "month" | "timeline" | "list";
const TODAY_ISO = "2026-07-21";

const RISK_TONE: Record<CalendarEvent["risk"], "success" | "warning" | "danger"> = {
  Low: "success",
  Medium: "warning",
  High: "danger",
};

/* ---------------- month grid helpers ---------------- */

interface DayCell {
  date: Date | null;
  iso: string;
  inMonth: boolean;
}

function isoOf(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

/** Build a Monday-first 6-week grid for the given month. */
function buildMonth(year: number, month: number): DayCell[] {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // days before the 1st (Mon-first)
  const start = new Date(year, month, 1 - offset);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    return { date: d, iso: isoOf(d), inMonth: d.getMonth() === month };
  });
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  { year: 2026, month: 6, label: "July 2026" },
  { year: 2026, month: 7, label: "August 2026" },
];

/* ---------------- page ---------------- */

function CalendarPage() {
  const [view, setView] = useState<ViewMode>("month");
  const [dept, setDept] = useState<string>("all");
  const [risk, setRisk] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [monthIdx, setMonthIdx] = useState(0);
  const [selected, setSelected] = useState<CalendarEvent | null>(null);

  const departments = useMemo(
    () => Array.from(new Set(CAL_EVENTS.map((e) => e.department))).sort(),
    [],
  );

  const filtered = useMemo(
    () =>
      CAL_EVENTS.filter(
        (e) =>
          (dept === "all" || e.department === dept) &&
          (risk === "all" || e.risk === risk) &&
          (type === "all" || e.type === type),
      ).sort((a, b) => a.date.localeCompare(b.date)),
    [dept, risk, type],
  );

  const byDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of filtered) {
      map.set(e.date, [...(map.get(e.date) ?? []), e]);
    }
    return map;
  }, [filtered]);

  const activeFilters = [dept, risk, type].filter((v) => v !== "all").length;
  const clearAll = () => {
    setDept("all");
    setRisk("all");
    setType("all");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Regulatory Planning"
        title="Regulatory Calendar"
        subtitle="Plan and track regulatory obligations, audits, reviews and expiries across the QMS."
        actions={
          <>
            <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
              <TabsList>
                <TabsTrigger value="month">
                  <CalendarDays /> Month
                </TabsTrigger>
                <TabsTrigger value="timeline">
                  <CalendarRange /> Timeline
                </TabsTrigger>
                <TabsTrigger value="list">
                  <ListIcon /> List
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button>
              <Plus className="size-4" /> Add reminder
            </Button>
          </>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-4 py-4">
          <FilterRow icon={Building2} label="Department">
            <FilterChips
              value={dept}
              onChange={setDept}
              options={[
                { label: "All", value: "all", count: CAL_EVENTS.length },
                ...departments.map((d) => ({
                  label: d,
                  value: d,
                  count: CAL_EVENTS.filter((e) => e.department === d).length,
                })),
              ]}
            />
          </FilterRow>
          <FilterRow icon={ShieldAlert} label="Risk">
            <FilterChips
              value={risk}
              onChange={setRisk}
              options={[
                { label: "All", value: "all" },
                { label: "Low", value: "Low" },
                { label: "Medium", value: "Medium" },
                { label: "High", value: "High" },
              ]}
            />
          </FilterRow>
          <FilterRow icon={CalendarDays} label="Event type">
            <FilterChips
              value={type}
              onChange={setType}
              options={[
                { label: "All", value: "all" },
                ...EVENT_TYPES.map((t) => ({
                  label: EVENT_TONES[t].label,
                  value: t as string,
                })),
              ]}
            />
          </FilterRow>
          {activeFilters > 0 && (
            <div className="flex items-center gap-3 border-t border-[var(--border-base)] pt-3 text-sm">
              <Badge tone="brand">{filtered.length} matching events</Badge>
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-fg-muted hover:text-fg"
              >
                <X className="size-3.5" /> Clear filters
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {view === "month" && (
        <MonthView
          monthIdx={monthIdx}
          setMonthIdx={setMonthIdx}
          byDay={byDay}
          onSelect={setSelected}
        />
      )}
      {view === "timeline" && <TimelineView events={filtered} />}
      {view === "list" && <ListView events={filtered} onSelect={setSelected} />}

      <EventDialog event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

/* ---------------- filter row ---------------- */

function FilterRow({
  icon: Icon,
  label,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <div className="flex w-32 shrink-0 items-center gap-2 pt-1.5 text-xs font-semibold uppercase tracking-wider text-fg-muted">
        <Icon className="size-3.5" /> {label}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/* ---------------- month view ---------------- */

function MonthView({
  monthIdx,
  setMonthIdx,
  byDay,
  onSelect,
}: {
  monthIdx: number;
  setMonthIdx: (n: number) => void;
  byDay: Map<string, CalendarEvent[]>;
  onSelect: (e: CalendarEvent) => void;
}) {
  const { year, month, label } = MONTHS[monthIdx];
  const cells = useMemo(() => buildMonth(year, month), [year, month]);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{label}</CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            disabled={monthIdx === 0}
            onClick={() => setMonthIdx(Math.max(0, monthIdx - 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={monthIdx === MONTHS.length - 1}
            onClick={() => setMonthIdx(Math.min(MONTHS.length - 1, monthIdx + 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-xl border border-[var(--border-base)]">
          {/* weekday header */}
          <div className="grid grid-cols-7 border-b border-[var(--border-base)] bg-subtle">
            {WEEKDAYS.map((w) => (
              <div
                key={w}
                className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-fg-muted"
              >
                {w}
              </div>
            ))}
          </div>
          {/* day grid */}
          <div className="grid grid-cols-7">
            {cells.map((cell, i) => {
              const events = byDay.get(cell.iso) ?? [];
              const isToday = cell.iso === TODAY_ISO;
              const isWeekend = i % 7 >= 5;
              return (
                <div
                  key={cell.iso}
                  className={cn(
                    "min-h-[112px] border-b border-r border-[var(--border-base)] p-1.5 [&:nth-child(7n)]:border-r-0",
                    !cell.inMonth && "bg-subtle/40",
                    isWeekend && cell.inMonth && "bg-subtle/30",
                  )}
                >
                  <div className="mb-1 flex items-center justify-between px-0.5">
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                        isToday
                          ? "bg-brand-600 text-white shadow-sm"
                          : cell.inMonth
                            ? "text-fg-secondary"
                            : "text-fg-muted/50",
                      )}
                    >
                      {cell.date?.getDate()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {events.slice(0, 3).map((e) => {
                      const tone = EVENT_TONES[e.type as EventType];
                      return (
                        <button
                          key={e.id}
                          onClick={() => onSelect(e)}
                          title={e.title}
                          className={cn(
                            "flex w-full items-center gap-1 rounded-md border px-1.5 py-1 text-left text-[11px] font-medium leading-tight transition-colors",
                            tone.pill,
                          )}
                        >
                          <span className="truncate">{e.title}</span>
                        </button>
                      );
                    })}
                    {events.length > 3 && (
                      <button
                        onClick={() => onSelect(events[3])}
                        className="w-full rounded-md px-1.5 py-0.5 text-left text-[11px] font-medium text-fg-muted hover:bg-subtle"
                      >
                        +{events.length - 3} more
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* legend */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {EVENT_TYPES.map((t) => (
            <span key={t} className="flex items-center gap-1.5 text-xs text-fg-muted">
              <span className={cn("size-2 rounded-full", EVENT_TONES[t].dot)} />
              {EVENT_TONES[t].label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------- timeline view ---------------- */

function TimelineView({ events }: { events: CalendarEvent[] }) {
  const items: TimelineItem[] = events.map((e) => {
    const tone = EVENT_TONES[e.type as EventType];
    const overdue = daysUntil(e.date) < 0;
    return {
      tone: tone.tone,
      time: formatDate(e.date),
      title: (
        <span className="flex flex-wrap items-center gap-2">
          <span>{e.title}</span>
          <Badge tone={tone.tone}>{tone.label}</Badge>
        </span>
      ),
      description: (
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1">
            <Building2 className="size-3.5 text-fg-muted" /> {e.department}
          </span>
          <span className="inline-flex items-center gap-1">
            <User className="size-3.5 text-fg-muted" /> {e.owner}
          </span>
          <Badge tone={RISK_TONE[e.risk]} dot>
            {e.risk} risk
          </Badge>
          <span
            className={cn(
              "text-xs font-medium",
              overdue ? "text-red-600" : "text-fg-muted",
            )}
          >
            {relativeDeadline(e.date)}
          </span>
        </span>
      ),
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chronological timeline</CardTitle>
        <p className="text-sm text-fg-muted">{events.length} scheduled events</p>
      </CardHeader>
      <CardContent>
        {items.length ? (
          <Timeline items={items} />
        ) : (
          <p className="py-8 text-center text-sm text-fg-muted">
            No events match the current filters.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/* ---------------- list view ---------------- */

function ListView({
  events,
  onSelect,
}: {
  events: CalendarEvent[];
  onSelect: (e: CalendarEvent) => void;
}) {
  const groups = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const key = formatDate(e.date, { month: "long", year: "numeric" });
      map.set(key, [...(map.get(key) ?? []), e]);
    }
    return Array.from(map.entries());
  }, [events]);

  if (!events.length) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-fg-muted">
          No events match the current filters.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map(([month, list]) => (
        <Card key={month}>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{month}</CardTitle>
            <Badge tone="neutral">{list.length} events</Badge>
          </CardHeader>
          <CardContent className="space-y-1">
            {list.map((e) => {
              const tone = EVENT_TONES[e.type as EventType];
              const days = daysUntil(e.date);
              const overdue = days < 0;
              const soon = days >= 0 && days <= 7;
              return (
                <button
                  key={e.id}
                  onClick={() => onSelect(e)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-subtle"
                >
                  <div className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-subtle py-1.5">
                    <span className="text-[10px] font-semibold uppercase text-fg-muted">
                      {formatDate(e.date, { month: "short" })}
                    </span>
                    <span className="text-base font-bold tabular-nums text-fg">
                      {formatDate(e.date, { day: "2-digit" })}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg">{e.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-muted">
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="size-3.5" /> {e.department}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <User className="size-3.5" /> {e.owner}
                      </span>
                    </div>
                  </div>
                  <Badge tone={tone.tone}>{tone.label}</Badge>
                  <span
                    className={cn(
                      "w-20 shrink-0 text-right text-xs font-semibold",
                      overdue
                        ? "text-red-600"
                        : soon
                          ? "text-amber-600"
                          : "text-fg-muted",
                    )}
                  >
                    {relativeDeadline(e.date)}
                  </span>
                </button>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ---------------- detail dialog ---------------- */

function EventDialog({
  event,
  onClose,
}: {
  event: CalendarEvent | null;
  onClose: () => void;
}) {
  if (!event) return null;
  const tone = EVENT_TONES[event.type as EventType];
  const overdue = daysUntil(event.date) < 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-[var(--border-base)] bg-[var(--bg-surface)] p-6 shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-brand-600">
                {event.id}
              </span>
              <Badge tone={tone.tone}>{tone.label}</Badge>
            </div>
            <h3 className="text-lg font-semibold text-fg">{event.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1 text-fg-muted hover:bg-subtle hover:text-fg"
          >
            <X className="size-4" />
          </button>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-4">
          <Field label="Date">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-fg">
              <CalendarDays className="size-4 text-fg-muted" />
              {formatDate(event.date)}
            </span>
          </Field>
          <Field label="Due">
            <span
              className={cn(
                "text-sm font-semibold",
                overdue ? "text-red-600" : "text-fg",
              )}
            >
              {relativeDeadline(event.date)}
            </span>
          </Field>
          <Field label="Department">
            <span className="text-sm text-fg">{event.department}</span>
          </Field>
          <Field label="Owner">
            <span className="text-sm text-fg">{event.owner}</span>
          </Field>
          <Field label="Risk">
            <Badge tone={RISK_TONE[event.risk]} dot>
              {event.risk}
            </Badge>
          </Field>
        </dl>

        <div className="mt-6 flex gap-2">
          <Button className="flex-1">
            <Bell className="size-4" /> Set reminder
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}
