import { createFileRoute } from '@tanstack/react-router'
import { Landmark } from 'lucide-react'
import {
  useFinanceState,
  useCurrentCompanyId,
  scoped,
  bankAccountBalance,
  partyName,
  formatDate,
  formatMoney,
} from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td, Money, Badge } from '../components/finance/ui'

function Bank() {
  const state = useFinanceState()
  const companyId = useCurrentCompanyId()
  const banks = scoped(state.bankAccounts, companyId)

  return (
    <div>
      <PageHeader
        title="Banka"
        subtitle="Llogari të shumta, import statement, reconciliation, tarifa dhe kurs këmbimi."
      />

      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        {banks.map((b) => (
          <Card key={b.id} className="p-5">
            <div className="flex items-center gap-2 mb-3 text-slate-500">
              <Landmark className="w-4 h-4" />
              <span className="text-sm font-medium text-slate-700">{b.name}</span>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{formatMoney(bankAccountBalance(state, b.id))}</p>
            <p className="mt-1 font-mono text-xs text-slate-400">{b.iban}</p>
            <p className="mt-1 text-xs text-slate-400">Monedha: {b.currency} · Hapje: {formatMoney(b.openingBalance, b.currency)}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Transaksionet bankare" />
        <Table head={<><Th>Data</Th><Th>Llogaria</Th><Th>Pala</Th><Th>Lloji</Th><Th align="right">Shuma</Th><Th align="center">Reconciled</Th></>}>
          {scoped(state.payments, companyId)
            .filter((p) => p.bankAccountId)
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((p) => {
              const bank = state.bankAccounts.find((b) => b.id === p.bankAccountId)
              return (
                <tr key={p.id}>
                  <Td>{formatDate(p.date)}</Td>
                  <Td>{bank?.name}</Td>
                  <Td>{partyName(state, p.partyId)}</Td>
                  <Td>{p.direction === 'in' ? 'Hyrëse' : 'Dalëse'}</Td>
                  <Td align="right"><span className={p.direction === 'in' ? 'text-emerald-600' : 'text-rose-600'}>{p.direction === 'in' ? '+' : '−'}<Money amount={p.amount} currency={p.currency} /></span></Td>
                  <Td align="center"><Badge status="paid" label="✓ Reconciled" /></Td>
                </tr>
              )
            })}
        </Table>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/bank')({
  component: Bank,
})
