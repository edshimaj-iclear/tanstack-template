import { createFileRoute } from '@tanstack/react-router'
import { Building2 } from 'lucide-react'
import {
  useFinanceState,
  summary,
  formatMoney,
  formatPercent,
} from '../finance'
import { PageHeader, Card } from '../components/finance/ui'
import { financeActions } from '../finance'

function Companies() {
  const state = useFinanceState()
  const operating = state.companies.filter((c) => !c.isGroup)
  const group = summary(state, 'grp')

  return (
    <div>
      <PageHeader
        title="Kompanitë e Grupit"
        subtitle="Strukturë multi-company me bilanc dhe raporte më vete + raport i konsoliduar."
      />

      <Card className="p-5 mb-6 bg-gradient-to-br from-indigo-600 to-violet-600 border-0">
        <p className="text-sm font-medium text-indigo-100">iClear Group Global — Konsoliduar</p>
        <div className="grid grid-cols-2 gap-6 mt-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-indigo-200">Të ardhura</p>
            <p className="text-xl font-semibold text-white">{formatMoney(group.revenue)}</p>
          </div>
          <div>
            <p className="text-xs text-indigo-200">Fitim neto</p>
            <p className="text-xl font-semibold text-white">{formatMoney(group.netProfit)}</p>
          </div>
          <div>
            <p className="text-xs text-indigo-200">Të arkëtueshme</p>
            <p className="text-xl font-semibold text-white">{formatMoney(group.receivables)}</p>
          </div>
          <div>
            <p className="text-xs text-indigo-200">Banka + Arka</p>
            <p className="text-xl font-semibold text-white">{formatMoney(group.bankBalance + group.cashBalance)}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {operating.map((c) => {
          const s = summary(state, c.id)
          const margin = s.revenue > 0 ? s.netProfit / s.revenue : 0
          return (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center rounded-lg w-9 h-9 bg-slate-100 text-slate-500">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.country}</p>
                  </div>
                </div>
                <button
                  onClick={() => financeActions.setCurrentCompany(c.id)}
                  className="text-xs font-medium text-indigo-600 hover:underline"
                >
                  Shiko
                </button>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-slate-500">NIPT / VAT</dt><dd className="font-medium text-slate-700">{c.nipt}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Monedha bazë</dt><dd className="font-medium text-slate-700">{c.baseCurrency}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Të ardhura</dt><dd className="font-medium text-slate-700">{formatMoney(s.revenue)}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Fitim neto</dt><dd className={`font-medium ${s.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatMoney(s.netProfit)} ({formatPercent(margin)})</dd></div>
              </dl>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/companies')({
  component: Companies,
})
