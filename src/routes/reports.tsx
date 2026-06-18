import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  usePerdorGjendjen,
  useKompaniaAktualeId,
  permbledhje,
  bilanci,
  fluksiParase,
  emriKompanise,
  formatoPara,
  formatoPerqindje,
} from '../finance'
import { PageHeader, Card, CardHeader } from '../components/finance/ui'

type Tab = 'pl' | 'bs' | 'cf'

function Rresht({ label, value, bold, indent, tone }: { label: string; value: number; bold?: boolean; indent?: boolean; tone?: 'pos' | 'neg' }) {
  const color = tone === 'pos' ? 'text-emerald-600' : tone === 'neg' ? 'text-rose-600' : bold ? 'text-slate-900' : 'text-slate-600'
  return (
    <div className={`flex justify-between py-2 ${bold ? 'border-t border-slate-200 font-semibold' : ''}`}>
      <span className={`${indent ? 'pl-4' : ''} ${color}`}>{label}</span>
      <span className={`tabular-nums ${color}`}>{formatoPara(value)}</span>
    </div>
  )
}

function Raportet() {
  const gjendja = usePerdorGjendjen()
  const kompaniaId = useKompaniaAktualeId()
  const [tab, setTab] = useState<Tab>('pl')

  const p = permbledhje(gjendja, kompaniaId)
  const bil = bilanci(gjendja, kompaniaId)
  const fluks = fluksiParase(gjendja, kompaniaId)

  const tabs: { id: Tab; label: string }[] = [
    { id: 'pl', label: 'Fitim & Humbje (P&L)' },
    { id: 'bs', label: 'Bilanci' },
    { id: 'cf', label: 'Cashflow' },
  ]

  return (
    <div>
      <PageHeader
        title="Raportet Financiare"
        subtitle={`${emriKompanise(gjendja, kompaniaId)} · Eksportuese në PDF / Excel / CSV`}
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
              <Rresht label="Të ardhura totale" value={p.teArdhura} />
              <Rresht label="Kosto direkte (COGS)" value={-p.kosto} indent />
              <Rresht label="Fitim bruto" value={p.fitimiBruto} bold tone={p.fitimiBruto >= 0 ? 'pos' : 'neg'} />
              <Rresht label="Shpenzime operative" value={-p.shpenzimeOperative} indent />
              <Rresht label="EBITDA" value={p.ebitda} bold />
              <Rresht label="Amortizim" value={-p.amortizimi} indent />
              <Rresht label="Fitim neto" value={p.fitimiNeto} bold tone={p.fitimiNeto >= 0 ? 'pos' : 'neg'} />
              <p className="mt-4 text-xs text-slate-400">Marzh bruto: {formatoPerqindje(p.teArdhura > 0 ? p.fitimiBruto / p.teArdhura : 0)} · Marzh neto: {formatoPerqindje(p.teArdhura > 0 ? p.fitimiNeto / p.teArdhura : 0)}</p>
            </div>
          </Card>
        )}

        {tab === 'bs' && (
          <Card>
            <CardHeader title="Pasqyra e Bilancit" />
            <div className="p-5 text-sm">
              <p className="mb-1 text-xs font-semibold tracking-wide uppercase text-slate-400">Asete</p>
              <Rresht label="Banka" value={bil.banka} indent />
              <Rresht label="Arka" value={bil.arka} indent />
              <Rresht label="Klientë (të arkëtueshme)" value={bil.teArketueshme} indent />
              <Rresht label="Inventar" value={bil.inventar} indent />
              <Rresht label="Total Asete" value={bil.totaliAseteve} bold />

              <p className="mt-4 mb-1 text-xs font-semibold tracking-wide uppercase text-slate-400">Detyrime</p>
              <Rresht label="Furnitorë (të pagueshme)" value={bil.tePagueshme} indent />
              <Rresht label="TVSH për pagesë" value={bil.tvshPerPagese} indent />
              <Rresht label="Total Detyrime" value={bil.totaliDetyrimeve} bold />

              <p className="mt-4 mb-1 text-xs font-semibold tracking-wide uppercase text-slate-400">Kapital</p>
              <Rresht label="Kapital + Fitime të pashpërndara" value={bil.kapitali} bold />
            </div>
          </Card>
        )}

        {tab === 'cf' && (
          <Card>
            <CardHeader title="Raport Cashflow" />
            <div className="p-5 text-sm">
              <Rresht label="Hyrje cash" value={fluks.hyrje} tone="pos" />
              <Rresht label="Dalje cash" value={-fluks.dalje} tone="neg" />
              <Rresht label="Cashflow operativ neto" value={fluks.operativ} bold tone={fluks.operativ >= 0 ? 'pos' : 'neg'} />
              <p className="mt-4 mb-1 text-xs font-semibold tracking-wide uppercase text-slate-400">Parashikim</p>
              <Rresht label="Të arkëtueshme të ardhshme" value={fluks.teArketueshmeTeArdhshme} indent />
              <Rresht label="Detyrime të ardhshme" value={-fluks.detyrimeTeArdhshme} indent />
              <Rresht label="Pozicion i projektuar" value={fluks.operativ + fluks.teArketueshmeTeArdhshme - fluks.detyrimeTeArdhshme} bold />
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/reports')({
  component: Raportet,
})
