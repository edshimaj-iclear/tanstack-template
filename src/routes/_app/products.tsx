import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Package,
  Plus,
  Download,
  ArrowUpRight,
  ScanLine,
  CalendarClock,
  FileText,
  ShieldAlert,
  Stethoscope,
  Activity as ActivityIcon,
} from "lucide-react";
import { PageHeader } from "../../components/qms/PageHeader";
import { FilterChips } from "../../components/qms/FilterBar";
import { StatusBadge } from "../../components/qms/StatusBadge";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Avatar } from "../../components/ui/misc";
import { PRODUCTS } from "../../data/products";
import type { Product } from "../../types";
import { formatDate } from "../../lib/utils";

export const Route = createFileRoute("/_app/products")({
  component: ProductsPage,
});

const AUDIENCE_FILTERS = ["Adult", "Pediatric"] as const;

function ProductsPage() {
  const matchRoute = useMatchRoute();
  // products.tsx is the layout for products.$id — render the grid only on the
  // exact /products route; the detail route paints itself into the outlet.
  const isDetail = !!matchRoute({ to: "/products/$id", fuzzy: false });
  const [filter, setFilter] = useState<string>("all");

  const counts = useMemo(() => {
    const by = (pred: (p: Product) => boolean) => PRODUCTS.filter(pred).length;
    return {
      all: PRODUCTS.length,
      Active: by((p) => p.status === "Active"),
      Draft: by((p) => p.status === "Draft"),
      "Under Review": by((p) => p.status === "Under Review"),
      Suspended: by((p) => p.status === "Suspended"),
      Adult: by((p) => p.audience === "Adult"),
      Pediatric: by((p) => p.audience === "Pediatric"),
    } as Record<string, number>;
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return PRODUCTS;
    if ((AUDIENCE_FILTERS as readonly string[]).includes(filter))
      return PRODUCTS.filter((p) => p.audience === filter);
    return PRODUCTS.filter((p) => p.status === filter);
  }, [filter]);

  // On /products/$id the detail route paints into this layout's outlet.
  if (isDetail) return <Outlet />;

  const options = [
    { label: "All", value: "all", count: counts.all },
    { label: "Active", value: "Active", count: counts.Active },
    { label: "Draft", value: "Draft", count: counts.Draft },
    { label: "Under Review", value: "Under Review", count: counts["Under Review"] },
    { label: "Suspended", value: "Suspended", count: counts.Suspended },
    { label: "Adult", value: "Adult", count: counts.Adult },
    { label: "Pediatric", value: "Pediatric", count: counts.Pediatric },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Device Master"
        title="Products"
        subtitle="The device master register — every iClear device family with its lifecycle stage, regulatory status and technical-file readiness."
        actions={
          <>
            <Button variant="secondary">
              <Download className="size-4" /> Export register
            </Button>
            <Button>
              <Plus className="size-4" /> New product
            </Button>
          </>
        }
      />

      <FilterChips options={options} value={filter} onChange={setFilter} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <Package className="size-8 text-fg-muted" />
          <p className="text-sm font-medium text-fg">No products in this view</p>
          <p className="text-sm text-fg-muted">Adjust the filters to see more devices.</p>
        </Card>
      )}
    </div>
  );
}

const COMPLIANCE_METRICS = [
  { key: "techDoc", label: "Technical Doc.", icon: FileText },
  { key: "riskStatus", label: "Risk", icon: ShieldAlert },
  { key: "clinical", label: "Clinical", icon: Stethoscope },
  { key: "pms", label: "PMS", icon: ActivityIcon },
] as const;

function ProductCard({ product: p }: { product: Product }) {
  const udiTone =
    p.udiStatus === "Complete" ? "success" : p.udiStatus === "In Progress" ? "info" : "warning";

  return (
    <Link
      to="/products/$id"
      params={{ id: p.id }}
      className="group block focus-visible:outline-none"
    >
      <Card className="flex h-full flex-col p-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[var(--border-strong)] group-hover:shadow-elevated group-focus-visible:ring-2 group-focus-visible:ring-brand-500/40">
        {/* Header: identity + completion ring */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <Badge tone={p.audience === "Pediatric" ? "regulatory" : "brand"}>{p.audience}</Badge>
              <Badge tone="outline">{p.deviceClass}</Badge>
            </div>
            <h3 className="truncate text-[17px] font-semibold tracking-tight text-fg">{p.name}</h3>
            <p className="mt-0.5 font-mono text-xs text-fg-muted">{p.code}</p>
          </div>
          <Ring value={p.completion} />
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <StatusBadge status={p.status} />
          <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
            Open file <ArrowUpRight className="size-3.5" />
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-fg-secondary">{p.intendedUse}</p>

        {/* Compliance mini-grid */}
        <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-[var(--border-base)] pt-4">
          {COMPLIANCE_METRICS.map((m) => {
            const value = p[m.key] as number;
            return (
              <div key={m.key} className="min-w-0">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 truncate text-[11px] font-medium text-fg-muted">
                    <m.icon className="size-3 shrink-0" /> {m.label}
                  </span>
                  <span className="text-[11px] font-semibold tabular-nums text-fg-secondary">
                    {value}%
                  </span>
                </div>
                <Progress value={value} size="sm" />
              </div>
            );
          })}
        </div>

        {/* Footer: UDI · review · owner */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--border-base)] pt-4">
          <div className="flex flex-col gap-1.5">
            <Badge tone={udiTone as "success" | "info" | "warning"}>
              <ScanLine className="size-3" /> UDI {p.udiStatus}
            </Badge>
            <span className="flex items-center gap-1 text-[11px] text-fg-muted">
              <CalendarClock className="size-3" /> Reviewed {formatDate(p.lastReview)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Owner</p>
              <p className="text-xs font-medium text-fg">{p.responsible}</p>
            </div>
            <Avatar name={p.responsible} size="sm" />
          </div>
        </div>
      </Card>
    </Link>
  );
}

/** Compact completion ring for cards (ProgressRing's fixed large type is too big here). */
function Ring({ value, size = 58, stroke = 5 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color =
    value >= 85 ? "#10b981" : value >= 70 ? "#06b6d4" : value >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-[var(--bg-subtle)]"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-sm font-bold tabular-nums text-fg">
        {value}
        <span className="text-[10px] text-fg-muted">%</span>
      </span>
    </div>
  );
}
