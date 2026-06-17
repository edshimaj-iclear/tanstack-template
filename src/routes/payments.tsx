import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import {
  useFinanceState,
  useCurrentCompanyId,
  useFinanceActions,
  scoped,
  partyName,
  formatDate,
  formatMoney,
} from '../finance'
import type { Currency, PaymentDirection, PaymentMethod } from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td, Button, Money } from '../components/finance/ui'
import { Modal, Field, Input, Select } from '../components/finance/forms'

const METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Cash', bank: 'Bankë', card: 'Kartë', transfer: 'Transfertë',
}

function Payments() {
  const state = useFinanceState()
  const companyId = useCurrentCompanyId()
  const actions = useFinanceActions()
  const [open, setOpen] = useState(false)

  const targetCompany = companyId === 'grp' ? state.companies.find((c) => !c.isGroup)!.id : companyId
  const list = scoped(state.payments, companyId).sort((a, b) => b.date.localeCompare(a.date))

  const [form, setForm] = useState({
    direction: 'in' as PaymentDirection,
    method: 'bank' as PaymentMethod,
    partyId: '',
    invoiceId: '',
    amount: '0',
    currency: 'EUR' as Currency,
    date: '2026-06-17',
  })

  const parties = form.direction === 'in' ? scoped(state.customers, companyId) : scoped(state.suppliers, companyId)
  const openInvoices = scoped(state.invoices, companyId).filter(
    (i) => i.kind === (form.direction === 'in' ? 'sale' : 'purchase') && i.partyId === form.partyId,
  )
  const banks = scoped(state.bankAccounts, companyId)
  const registers = scoped(state.cashRegisters, companyId)

  const submit = () => {
    if (!form.partyId || Number(form.amount) <= 0) return
    actions.addPayment({
      companyId: targetCompany,
      direction: form.direction,
      method: form.method,
      partyId: form.partyId,
      invoiceId: form.invoiceId || undefined,
      amount: Number(form.amount),
      currency: form.currency,
      exchangeRate: state.exchangeRates.rates[form.currency] ?? 1,
      date: form.date,
      bankAccountId: form.method !== 'cash' ? banks[0]?.id : undefined,
      cashRegisterId: form.method === 'cash' ? registers[0]?.id : undefined,
    })
    setForm({ ...form, partyId: '', invoiceId: '', amount: '0' })
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Pagesat"
        subtitle="Cash, bankë, kartë, transfertë — pagesa hyrëse dhe dalëse të lidhura me fatura."
        actions={<Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> Pagesë e re</Button>}
      />
      <Card>
        <CardHeader title={`${list.length} pagesa`} />
        <Table
          head={
            <>
              <Th>Data</Th>
              <Th>Drejtimi</Th>
              <Th>Pala</Th>
              <Th>Metoda</Th>
              <Th>Faturë</Th>
              <Th align="right">Shuma</Th>
              <Th align="right">Në EUR</Th>
            </>
          }
        >
          {list.map((p) => {
            const inv = p.invoiceId ? state.invoices.find((i) => i.id === p.invoiceId) : null
            return (
              <tr key={p.id}>
                <Td>{formatDate(p.date)}</Td>
                <Td>
                  {p.direction === 'in' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600"><ArrowDownLeft className="w-4 h-4" /> Hyrëse</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-600"><ArrowUpRight className="w-4 h-4" /> Dalëse</span>
                  )}
                </Td>
                <Td>{partyName(state, p.partyId)}</Td>
                <Td>{METHOD_LABELS[p.method]}</Td>
                <Td className="text-xs text-slate-500">{inv?.number ?? '—'}</Td>
                <Td align="right"><Money amount={p.amount} currency={p.currency} /></Td>
                <Td align="right" className="text-slate-500">{formatMoney(p.amount * (p.exchangeRate || 1))}</Td>
              </tr>
            )
          })}
        </Table>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Regjistro pagesë"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Anulo</Button><Button onClick={submit}>Ruaj</Button></>}
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Drejtimi">
            <Select value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value as PaymentDirection, partyId: '', invoiceId: '' })}>
              <option value="in">Hyrëse (nga klienti)</option>
              <option value="out">Dalëse (te furnitori)</option>
            </Select>
          </Field>
          <Field label="Metoda">
            <Select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value as PaymentMethod })}>
              {(Object.keys(METHOD_LABELS) as PaymentMethod[]).map((m) => <option key={m} value={m}>{METHOD_LABELS[m]}</option>)}
            </Select>
          </Field>
        </div>
        <Field label={form.direction === 'in' ? 'Klienti' : 'Furnitori'}>
          <Select value={form.partyId} onChange={(e) => setForm({ ...form, partyId: e.target.value, invoiceId: '' })}>
            <option value="">— Zgjidh —</option>
            {parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
        </Field>
        <Field label="Faturë (opsionale)">
          <Select value={form.invoiceId} onChange={(e) => setForm({ ...form, invoiceId: e.target.value })}>
            <option value="">— Pa faturë —</option>
            {openInvoices.map((i) => <option key={i.id} value={i.id}>{i.number}</option>)}
          </Select>
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Shuma"><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></Field>
          <Field label="Monedha">
            <Select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as Currency })}>
              {(['EUR', 'ALL', 'USD', 'GBP'] as Currency[]).map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Data"><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  )
}

export const Route = createFileRoute('/payments')({
  component: Payments,
})
