import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
        </div>
        {icon && (
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white/50 px-6 py-16 text-center">
      <p className="text-base font-medium text-gray-700">{title}</p>
      {description && (
        <p className="mt-1 max-w-md text-sm text-gray-500">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  className = "",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

// Tregues i vogël i një vlerësimi (score) me shirit progresi
export function ScoreBar({
  label,
  value,
}: {
  label: string;
  value?: number;
}) {
  const v = value ?? 0;
  const color =
    v >= 70 ? "bg-green-500" : v >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">{label}</span>
        <span className="font-medium text-gray-700">
          {value == null ? "—" : v}
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, v))}%` }}
        />
      </div>
    </div>
  );
}
