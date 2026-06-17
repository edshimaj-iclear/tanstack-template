import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  useFinanceState,
  useCurrentCompanyId,
  scoped,
  invoiceTotals,
  partyName,
  formatDate,
  formatMoney,
} from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td, Button, Badge, Money } from '../components/finance/ui'
import { InvoiceFormModal } from '../components/finance/InvoiceFormModal'

function Purchases() {
  const state = useFinanceState()
  const companyId = useCurrentCompanyId()
  const [open, setOpen] = useState(false)

  const invoices = scoped(state.invoices, companyId)
    .filter((i) => i.kind === 'purchase')
    .sort((a, b) => b.issueDate.localeCompare(a.issueDate))

  return (
    <div>
      <PageHeader
        title="Fatura Blerjeje"
        subtitle="Blerje, import, doganë, transport — kosto reale e produktit me kosto shtesë."
        actions={<Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> Faturë e re</Button>}
      />
      <Card>
        <CardHeader title={`${invoices.length} fatura`} />
        <Table
          head={
            <>
              <Th>Numri</Th>
              <Th>Furnitori</Th>
              <Th>Data</Th>
              <Th align="right">Totali</Th>
              <Th align="right">Kosto shtesë</Th>
              <Th align="right">Mbetur</Th>
              <Th align="center">Status</Th>
            </>
          }
        >
          {invoices.map((inv) => {
            const t = invoiceTotals(state, inv)
            const extra = (inv.extraCosts ?? []).reduce((s, c) => s + c.amount, 0)
            return (
              <tr key={inv.id}>
                <Td className="font-medium">{inv.number}</Td>
                <Td>{partyName(state, inv.partyId)}</Td>
                <Td>{formatDate(inv.issueDate)}</Td>
                <Td align="right" className="font-medium"><Money amount={t.total} currency={inv.currency} /></Td>
                <Td align="right">{extra > 0 ? formatMoney(extra, inv.currency) : '—'}</Td>
                <Td align="right"><Money amount={t.outstanding} currency={inv.currency} /></Td>
                <Td align="center"><Badge status={inv.status} /></Td>
              </tr>
            )
          })}
        </Table>
      </Card>
      <InvoiceFormModal kind="purchase" companyId={companyId} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

export const Route = createFileRoute('/purchases')({
  component: Purchases,
})
