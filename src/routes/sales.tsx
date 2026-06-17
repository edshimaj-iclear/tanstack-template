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
} from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td, Button, Badge, Money } from '../components/finance/ui'
import { InvoiceFormModal } from '../components/finance/InvoiceFormModal'

function Sales() {
  const state = useFinanceState()
  const companyId = useCurrentCompanyId()
  const [open, setOpen] = useState(false)

  const invoices = scoped(state.invoices, companyId)
    .filter((i) => i.kind === 'sale')
    .sort((a, b) => b.issueDate.localeCompare(a.issueDate))

  return (
    <div>
      <PageHeader
        title="Fatura Shitjeje"
        subtitle="Faturë, proformë, e-invoice, me TVSH, zbritje, shumë monedha dhe pagesa të pjesshme."
        actions={<Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> Faturë e re</Button>}
      />
      <Card>
        <CardHeader title={`${invoices.length} fatura`} />
        <Table
          head={
            <>
              <Th>Numri</Th>
              <Th>Klienti</Th>
              <Th>Data</Th>
              <Th>Afati</Th>
              <Th align="right">Nëntotal</Th>
              <Th align="right">TVSH</Th>
              <Th align="right">Totali</Th>
              <Th align="right">Mbetur</Th>
              <Th align="center">Status</Th>
            </>
          }
        >
          {invoices.map((inv) => {
            const t = invoiceTotals(state, inv)
            return (
              <tr key={inv.id}>
                <Td className="font-medium">{inv.number}</Td>
                <Td>{partyName(state, inv.partyId)}</Td>
                <Td>{formatDate(inv.issueDate)}</Td>
                <Td className={inv.dueDate < '2026-06-17' && t.outstanding > 0 ? 'text-rose-600' : ''}>{formatDate(inv.dueDate)}</Td>
                <Td align="right"><Money amount={t.net} currency={inv.currency} /></Td>
                <Td align="right"><Money amount={t.vat} currency={inv.currency} /></Td>
                <Td align="right" className="font-medium"><Money amount={t.total} currency={inv.currency} /></Td>
                <Td align="right"><Money amount={t.outstanding} currency={inv.currency} /></Td>
                <Td align="center"><Badge status={inv.status} /></Td>
              </tr>
            )
          })}
        </Table>
      </Card>
      <InvoiceFormModal kind="sale" companyId={companyId} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

export const Route = createFileRoute('/sales')({
  component: Sales,
})
