import type { ReactNode } from 'react'
import { formatMoney } from '../../finance'
import type { Currency } from '../../finance'

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
      <h2 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">
        {title}
      </h2>
      {action}
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
  tone = 'default',
  icon,
}: {
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'positive' | 'negative' | 'warning'
  icon?: ReactNode
}) {
  const toneClass = {
    default: 'text-slate-900',
    positive: 'text-emerald-600',
    negative: 'text-rose-600',
    warning: 'text-amber-600',
  }[tone]
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium tracking-wide uppercase text-slate-500">
            {label}
          </p>
          <p className={`mt-2 text-2xl font-semibold ${toneClass}`}>{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
        {icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-500">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}

const BADGE_TONES: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-600',
  approved: 'bg-blue-100 text-blue-700',
  paid: 'bg-emerald-100 text-emerald-700',
  partially_paid: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-rose-100 text-rose-700',
  pending: 'bg-amber-100 text-amber-700',
  rejected: 'bg-rose-100 text-rose-700',
  positive: 'bg-emerald-100 text-emerald-700',
  negative: 'bg-rose-100 text-rose-700',
  neutral: 'bg-slate-100 text-slate-600',
}

const BADGE_LABELS: Record<string, string> = {
  draft: 'Draft',
  approved: 'Aprovuar',
  paid: 'Paguar',
  partially_paid: 'Pjesërisht',
  cancelled: 'Anuluar',
  pending: 'Në pritje',
  rejected: 'Refuzuar',
}

export function Badge({ status, label }: { status: string; label?: string }) {
  const tone = BADGE_TONES[status] ?? 'bg-slate-100 text-slate-600'
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tone}`}
    >
      {label ?? BADGE_LABELS[status] ?? status}
    </span>
  )
}

export function Money({
  amount,
  currency = 'EUR',
  tone,
}: {
  amount: number
  currency?: Currency
  tone?: 'auto' | 'none'
}) {
  let color = ''
  if (tone === 'auto') {
    color = amount < 0 ? 'text-rose-600' : 'text-slate-900'
  }
  return <span className={`tabular-nums ${color}`}>{formatMoney(amount, currency)}</span>
}

export function Table({
  head,
  children,
}: {
  head: ReactNode
  children: ReactNode
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-slate-100 text-slate-500">
            {head}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">{children}</tbody>
      </table>
    </div>
  )
}

export function Th({
  children,
  align = 'left',
}: {
  children: ReactNode
  align?: 'left' | 'right' | 'center'
}) {
  return (
    <th
      className={`px-5 py-3 text-xs font-semibold tracking-wide uppercase text-${align} text-slate-500`}
    >
      {children}
    </th>
  )
}

export function Td({
  children,
  align = 'left',
  className = '',
}: {
  children: ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
}) {
  return (
    <td className={`px-5 py-3 text-${align} text-slate-700 ${className}`}>
      {children}
    </td>
  )
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  type?: 'button' | 'submit'
  className?: string
}) {
  const variants = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
    secondary:
      'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="px-5 py-12 text-sm text-center text-slate-400">{message}</div>
  )
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="w-full h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full bg-indigo-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
