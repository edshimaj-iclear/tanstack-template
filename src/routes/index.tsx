import { createFileRoute } from '@tanstack/react-router'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Landmark,
  Users,
  Truck,
  Receipt,
  AlertTriangle,
  Percent,
  Boxes,
} from 'lucide-react'
import {
  useCurrentCompanyId,
  useFinanceState,
  summary,
  monthlySeries,
  cashflow,
  invoiceTotals,
  partyName,
  companyName,
  scoped,
  formatMoney,
  formatDate,
  formatPercent,
} from '../finance'
import { PageHeader, StatCard, Card, CardHeader, Table, Th, Td, Badge, Money } from '../components/finance/ui'

function MonthlyChart() {
  const state = useFinanceState()
  const companyId = useCurrentCompanyId()
  const series = monthlySeries(state, companyId)
  const max = Math.max(1, ...series.map((p) => Math.max(p.revenue, p.expenses)))
  const monthLabels = ['Jan', 'Shk', 'Mar', 'Pri', 'Maj', 'Qer', 'Kor', 'Gus', 'Sht', 'Tet', 'Nën', 'Dhj']
  return (
    <Card>
      <CardHeader title="Të ardhura vs Shpenzime (2026)" />
      <div className="p-5">
        <div className="flex items-end justify-between gap-2 h-48">
          {series.map((p, i) => (
            <div key={p.month} className="flex flex-col items-center flex-1 gap-1">
              <div className="flex items-end justify-center w-full gap-1 h-40">
                <div
                  className="w-1/2 rounded-t bg-indigo-500"
                  style={{ height: `${(p.revenue / max) * 100}%` }}
                  title={`Të ardhura: ${formatMoney(p.revenue)}`}
                />
                <div
                  className="w-1/2 rounded-t bg-rose-400"
                  style={{ height: `${(p.expenses / max) * 100}%` }}
                  title={`Shpenzime: ${formatMoney(p.expenses)}`}
                />
              </div>
              <span className="text-[10px] text-slate-400">{monthLabels[i]}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-500" /> Të ardhura
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-400" /> Shpenzime
          </span>
        </div>
      </div>
    </Card>
  )
}

function Dashboard() {
  const state = useFinanceState()
  const companyId = useCurrentCompanyId()
  const s = summary(state, companyId)
  const cf = cashflow(state, companyId)
  const margin = s.revenue > 0 ? s.netProfit / s.revenue : 0

  // unpaid sales invoices for the table
  const unpaid = scoped(state.invoices, companyId)
    .filter((i) => i.kind === 'sale' && i.status !== 'cancelled')
    .map((i) => ({ inv: i, t: invoiceTotals(state, i) }))
    .filter((x) => x.t.outstanding > 0)
    .sort((a, b) => b.t.baseOutstanding - a.t.baseOutstanding)
    .slice(0, 6)

  // top debtor customers
  const debtors = scoped(state.customers, companyId)
    .map((c) => {
      const bal = scoped(state.invoices, companyId)
        .filter((i) => i.kind === 'sale' && i.partyId === c.id && i.status !== 'cancelled')
        .reduce((sum, i) => sum + invoiceTotals(state, i).baseOutstanding, 0)
      return { c, bal }
    })
    .filter((x) => x.bal > 0)
    .sort((a, b) => b.bal - a.bal)
    .slice(0, 5)

  return (
    <div>
      <PageHeader
        title="Dashboard Financiar"
        subtitle={`${companyName(state, companyId)} · në kohë reale · ${formatDate('2026-06-17')}`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Të ardhura (YTD)" value={formatMoney(s.revenue)} tone="positive" icon={<TrendingUp className="w-5 h-5" />} hint="Pa TVSH" />
        <StatCard label="Fitim bruto" value={formatMoney(s.grossProfit)} hint={`Marzh: ${formatPercent(s.revenue > 0 ? s.grossProfit / s.revenue : 0)}`} icon={<Percent className="w-5 h-5" />} />
        <StatCard label="Fitim neto" value={formatMoney(s.netProfit)} tone={s.netProfit >= 0 ? 'positive' : 'negative'} hint={`Marzh neto: ${formatPercent(margin)}`} icon={s.netProfit >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />} />
        <StatCard label="Cashflow operativ" value={formatMoney(cf.operating)} tone={cf.operating >= 0 ? 'positive' : 'negative'} icon={<Wallet className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Balanca bankare" value={formatMoney(s.bankBalance)} icon={<Landmark className="w-5 h-5" />} />
        <StatCard label="Balanca në arkë" value={formatMoney(s.cashBalance)} icon={<Wallet className="w-5 h-5" />} />
        <StatCard label="Klientë debitorë" value={formatMoney(s.receivables)} tone="warning" hint={`${s.unpaidInvoiceCount} fatura të papaguara`} icon={<Users className="w-5 h-5" />} />
        <StatCard label="Furnitorë kreditorë" value={formatMoney(s.payables)} tone="warning" icon={<Truck className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="TVSH për pagesë" value={formatMoney(s.vatPayable)} tone={s.vatPayable > 0 ? 'warning' : 'positive'} hint={`Dalëse ${formatMoney(s.vatOutput)} · Zbritëse ${formatMoney(s.vatInput)}`} icon={<Percent className="w-5 h-5" />} />
        <StatCard label="Vlera e stokut" value={formatMoney(s.inventoryValue)} icon={<Boxes className="w-5 h-5" />} />
        <StatCard label="Shpenzime operative" value={formatMoney(s.operatingExpenses)} tone="negative" icon={<Receipt className="w-5 h-5" />} />
        <StatCard label="Pagesa të vonuara" value={String(s.overdueInvoiceCount)} tone={s.overdueInvoiceCount > 0 ? 'negative' : 'positive'} hint="Fatura mbi afat" icon={<AlertTriangle className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MonthlyChart />
        </div>
        <Card>
          <CardHeader title="Klientë me borxh më të lartë" />
          {debtors.length === 0 ? (
            <p className="px-5 py-8 text-sm text-center text-slate-400">Pa borxhe.</p>
          ) : (
            <div className="p-5 space-y-4">
              {debtors.map(({ c, bal }) => (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <span className="truncate text-slate-700">{c.name}</span>
                  <Money amount={bal} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader title="Fatura të papaguara" />
          <Table
            head={
              <>
                <Th>Faturë</Th>
                <Th>Klient</Th>
                <Th>Afati</Th>
                <Th align="right">Totali</Th>
                <Th align="right">Mbetur</Th>
                <Th align="center">Status</Th>
              </>
            }
          >
            {unpaid.length === 0 ? (
              <tr>
                <Td>—</Td><Td> </Td><Td> </Td><Td> </Td><Td> </Td><Td> </Td>
              </tr>
            ) : (
              unpaid.map(({ inv, t }) => (
                <tr key={inv.id}>
                  <Td className="font-medium">{inv.number}</Td>
                  <Td>{partyName(state, inv.partyId)}</Td>
                  <Td>{formatDate(inv.dueDate)}</Td>
                  <Td align="right"><Money amount={t.baseTotal} /></Td>
                  <Td align="right"><Money amount={t.baseOutstanding} /></Td>
                  <Td align="center"><Badge status={inv.status} /></Td>
                </tr>
              ))
            )}
          </Table>
        </Card>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Dashboard,
})
