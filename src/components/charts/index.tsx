import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClientOnly } from "./ClientOnly";
import { cn } from "../../lib/utils";

export const CHART_COLORS = {
  brand: "#06b6d4",
  brand2: "#0891b2",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  regulatory: "#8b5cf6",
  ink: "#64748b",
};

export const PIE_PALETTE = [
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#0e7490",
];

const axisProps = {
  tick: { fontSize: 11, fill: "var(--text-muted)" },
  tickLine: false,
  axisLine: false,
};

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--border-base)] bg-[var(--bg-surface)] px-3 py-2 shadow-pop">
      {label && (
        <p className="mb-1 text-xs font-semibold text-fg">{label}</p>
      )}
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: entry.color ?? entry.fill }}
          />
          <span className="text-fg-muted">{entry.name}:</span>
          <span className="font-semibold text-fg tabular-nums">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function ChartShell({
  height = 260,
  children,
}: {
  height?: number;
  children: React.ReactElement;
}) {
  return (
    <ClientOnly
      fallback={<div className="skeleton rounded-lg" style={{ height }} />}
    >
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </ClientOnly>
  );
}

/* ---------- Multi-series line / trend ---------- */
export function TrendChart({
  data,
  series,
  height = 260,
  type = "area",
}: {
  data: any[];
  series: { key: string; name: string; color: string }[];
  height?: number;
  type?: "area" | "line";
}) {
  if (type === "line") {
    return (
      <ChartShell height={height}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-base)" vertical={false} />
          <XAxis dataKey="month" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip content={<ChartTooltip />} />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2.4}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ChartShell>
    );
  }
  return (
    <ChartShell height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-base)" vertical={false} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip content={<ChartTooltip />} />
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={2.4}
            fill={`url(#grad-${s.key})`}
          />
        ))}
      </AreaChart>
    </ChartShell>
  );
}

/* ---------- Bar chart ---------- */
export function BarChartCard({
  data,
  bars,
  height = 260,
  xKey = "month",
  stacked = false,
}: {
  data: any[];
  bars: { key: string; name: string; color: string }[];
  height?: number;
  xKey?: string;
  stacked?: boolean;
}) {
  return (
    <ChartShell height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-base)" vertical={false} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--bg-subtle)" }} />
        {bars.map((b) => (
          <Bar
            key={b.key}
            dataKey={b.key}
            name={b.name}
            fill={b.color}
            radius={stacked ? 0 : [4, 4, 0, 0]}
            stackId={stacked ? "a" : undefined}
            maxBarSize={38}
          />
        ))}
      </BarChart>
    </ChartShell>
  );
}

/* ---------- Horizontal category bars (simple, non-recharts) ---------- */
export function HorizontalBars({
  data,
  className,
}: {
  data: { label: string; value: number }[];
  className?: string;
}) {
  const barColor = (v: number) =>
    v >= 85 ? "#10b981" : v >= 70 ? "#06b6d4" : v >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className={cn("flex flex-col gap-3.5", className)}>
      {data.map((d) => (
        <div key={d.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-fg-secondary">{d.label}</span>
            <span className="font-semibold text-fg tabular-nums">{d.value}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-subtle">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${d.value}%`, backgroundColor: barColor(d.value) }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Donut ---------- */
export function DonutChart({
  data,
  height = 240,
  colors = PIE_PALETTE,
}: {
  data: { name: string; value: number }[];
  height?: number;
  colors?: string[];
}) {
  return (
    <ChartShell height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="58%"
          outerRadius="82%"
          paddingAngle={2}
          stroke="none"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
      </PieChart>
    </ChartShell>
  );
}

/* ---------- Radar ---------- */
export function RadarCard({
  data,
  dataKey = "value",
  height = 260,
  color = CHART_COLORS.brand,
}: {
  data: { axis: string; value: number }[];
  dataKey?: string;
  height?: number;
  color?: string;
}) {
  return (
    <ChartShell height={height}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="var(--border-base)" />
        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
        <Radar dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.25} strokeWidth={2} />
        <Tooltip content={<ChartTooltip />} />
      </RadarChart>
    </ChartShell>
  );
}
