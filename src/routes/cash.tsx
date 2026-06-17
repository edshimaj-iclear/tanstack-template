import { createFileRoute } from '@tanstack/react-router'
import { Banknote, User } from 'lucide-react'
import {
  useFinanceState,
  useCurrentCompanyId,
  scoped,
  cashRegisterBalance,
  partyName,
  formatDate,
  formatMoney,
} from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td, Money } from '../components/finance/ui'

function Cash() {
  const state = useFinanceState()
  const companyId = useCurrentCompanyId()
  const registers = scoped(state.cashRegisters, companyId)

  return (
    <div>
      <PageHeader
        title="Arka"
        subtitle="Arkat me balancë fillestare, hyrje, dalje, person përgjegjës dhe mbyllje ditore."
      />

      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        {registers.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-center gap-2 mb-3 text-slate-500">
              <Banknote className="w-4 h-4" />
              <span className="text-sm font-medium text-slate-700">{r.name}</span>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{formatMoney(cashRegisterBalance(state, r.id))}</p>
            <p className="mt-1 text-xs text-slate-400">Hapje: {formatMoney(r.openingBalance, r.currency)}</p>
            <p className="flex items-center gap-1 mt-2 text-xs text-slate-500"><User className="w-3.5 h-3.5" /> {r.responsible}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Lëvizjet e arkës" />
        <Table head={<><Th>Data</Th><Th>Arka</Th><Th>Pala</Th><Th>Lloji</Th><Th align="right">Shuma</Th></>}>
          {scoped(state.payments, companyId)
            .filter((p) => p.cashRegisterId)
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((p) => {
              const reg = state.cashRegisters.find((r) => r.id === p.cashRegisterId)
              return (
                <tr key={p.id}>
                  <Td>{formatDate(p.date)}</Td>
                  <Td>{reg?.name}</Td>
                  <Td>{partyName(state, p.partyId)}</Td>
                  <Td>{p.direction === 'in' ? 'Hyrje' : 'Dalje'}</Td>
                  <Td align="right"><span className={p.direction === 'in' ? 'text-emerald-600' : 'text-rose-600'}>{p.direction === 'in' ? '+' : '−'}<Money amount={p.amount} currency={p.currency} /></span></Td>
                </tr>
              )
            })}
        </Table>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/cash')({
  component: Cash,
})
