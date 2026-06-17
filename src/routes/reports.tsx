import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  useFinanceState,
  useCurrentCompanyId,
  summary,
  balanceSheet,
  cashflow,
  companyName,
  formatMoney,
  formatPercent,
} from '../finance'
import { PageHeader, Card, CardHeader } from '../components/finance/ui'

type Tab = 'pl' | 'bs' | 'cf'

function Row({ label, value, bold, indent, tone }: { label: string; value: number; bold?: boolean; indent?: boolean; tone?: 'pos' | 'neg' }) {
  const color = tone === 'pos' ? 'text-emerald-600' : tone === 'neg' ? 'text-rose-600' : bold ? 'text-slate-900' : 'text-slate-600'
  return (
    <div className={`flex justify-between py-2 ${bold ? 'border-t border-slate-200 font-semibold' : ''}`}>
      <span className={`${indent ? 'pl-4' : ''} ${color}`}>{label}</span>
      <span className={`tabular-nums ${color}`}>{formatMoney(value)}</span>
    </div>
  )
}

function Reports() {
  const state = useFinanceState()
  const companyId = useCurrentCompanyId()
  const [tab, setTab] = useState<Tab>('pl')

  const s = summary(state, companyId)
  const bs = balanceSheet(state, companyId)
  const cf = cashflow(state, companyId)

  const tabs: { id: Tab; label: string }[] = [
    { id: 'pl', label: 'Fitim & Humbje (P&L)' },
    { id: 'bs', label: 'Bilanci' },
    { id: 'cf', label: 'Cashflow' },
  ]

  return (
    <div>
      <PageHeader
        title="Raportet Financiare"
        subtitle={`${companyName(state, companyId)} · Eksportuese në PDF / Excel / CSV`}
      />

      <div className="inline-flex p-1 mb-6 rounded-lg bg-slate-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-2xl">
        {tab === 'pl' && (
          <Card>
            <CardHeader title="Pasqyra e Fitim-Humbjes" />
            <div className="p-5 text-sm">
              <Row label="Të ardhura totale" value={s.revenue} />
              <Row label="Kosto direkte (COGS)" value={-s.cogs} indent />
              <Row label="Fitim bruto" value={s.grossProfit} bold tone={s.grossProfit >= 0 ? 'pos' : 'neg'} />
              <Row label="Shpenzime operative" value={-s.operatingExpenses} indent />
              <Row label="EBITDA" value={s.ebitda} bold />
              <Row label="Amortizim" value={-s.depreciation} indent />
              <Row label="Fitim neto" value={s.netProfit} bold tone={s.netProfit >= 0 ? 'pos' : 'neg'} />
              <p className="mt-4 text-xs text-slate-400">Marzh bruto: {formatPercent(s.revenue > 0 ? s.grossProfit / s.revenue : 0)} · Marzh neto: {formatPercent(s.revenue > 0 ? s.netProfit / s.revenue : 0)}</p>
            </div>
          </Card>
        )}

        {tab === 'bs' && (
          <Card>
            <CardHeader title="Pasqyra e Bilancit" />
            <div className="p-5 text-sm">
              <p className="mb-1 text-xs font-semibold tracking-wide uppercase text-slate-400">Asete</p>
              <Row label="Banka" value={bs.bank} indent />
              <Row label="Arka" value={bs.cash} indent />
              <Row label="Klientë (të arkëtueshme)" value={bs.receivables} indent />
              <Row label="Inventar" value={bs.inventory} indent />
              <Row label="Total Asete" value={bs.totalAssets} bold />

              <p className="mt-4 mb-1 text-xs font-semibold tracking-wide uppercase text-slate-400">Detyrime</p>
              <Row label="Furnitorë (të pagueshme)" value={bs.payables} indent />
              <Row label="TVSH për pagesë" value={bs.vatPayable} indent />
              <Row label="Total Detyrime" value={bs.totalLiabilities} bold />

              <p className="mt-4 mb-1 text-xs font-semibold tracking-wide uppercase text-slate-400">Kapital</p>
              <Row label="Kapital + Fitime të pashpërndara" value={bs.equity} bold />
            </div>
          </Card>
        )}

        {tab === 'cf' && (
          <Card>
            <CardHeader title="Raport Cashflow" />
            <div className="p-5 text-sm">
              <Row label="Hyrje cash" value={cf.inflow} tone="pos" />
              <Row label="Dalje cash" value={-cf.outflow} tone="neg" />
              <Row label="Cashflow operativ neto" value={cf.operating} bold tone={cf.operating >= 0 ? 'pos' : 'neg'} />
              <p className="mt-4 mb-1 text-xs font-semibold tracking-wide uppercase text-slate-400">Parashikim</p>
              <Row label="Të arkëtueshme të ardhshme" value={cf.upcomingReceivables} indent />
              <Row label="Detyrime të ardhshme" value={-cf.upcomingPayables} indent />
              <Row label="Pozicion i projektuar" value={cf.operating + cf.upcomingReceivables - cf.upcomingPayables} bold />
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/reports')({
  component: Reports,
})
