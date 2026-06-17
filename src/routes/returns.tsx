import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, RotateCcw, ArrowRight } from 'lucide-react'
import {
  useFinanceState,
  useCurrentCompanyId,
  useFinanceActions,
  scoped,
  partyName,
  formatDate,
  formatMoney,
} from '../finance'
import { PageHeader, Card, CardHeader, Button } from '../components/finance/ui'
import { Modal, Field, Input, Select } from '../components/finance/forms'

function netDifference(returned: number, replacement: number) {
  return replacement - returned
}

function Returns() {
  const state = useFinanceState()
  const companyId = useCurrentCompanyId()
  const actions = useFinanceActions()
  const [open, setOpen] = useState(false)

  const targetCompany = companyId === 'grp' ? state.companies.find((c) => !c.isGroup)!.id : companyId
  const notes = scoped(state.creditNotes, companyId).sort((a, b) => b.date.localeCompare(a.date))
  const customers = scoped(state.customers, companyId)

  const [form, setForm] = useState({
    customerId: '',
    originalInvoiceId: '',
    returnedDesc: '',
    returnedAmount: '0',
    replacementDesc: '',
    replacementAmount: '0',
  })

  const customerInvoices = scoped(state.invoices, companyId).filter(
    (i) => i.kind === 'sale' && i.partyId === form.customerId,
  )
  const liveDiff = netDifference(Number(form.returnedAmount), Number(form.replacementAmount))

  const submit = () => {
    if (!form.customerId || !form.originalInvoiceId) return
    actions.addCreditNote({
      companyId: targetCompany,
      customerId: form.customerId,
      originalInvoiceId: form.originalInvoiceId,
      date: '2026-06-17',
      currency: 'EUR',
      returnedItems: form.returnedDesc ? [{ description: form.returnedDesc, amount: Number(form.returnedAmount) }] : [],
      replacementItems: form.replacementDesc ? [{ description: form.replacementDesc, amount: Number(form.replacementAmount) }] : [],
      notes: `Diferenca për pagesë: ${formatMoney(liveDiff)}`,
    })
    setForm({ customerId: '', originalInvoiceId: '', returnedDesc: '', returnedAmount: '0', replacementDesc: '', replacementAmount: '0' })
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Kthime & Credit Note"
        subtitle="Kthim produkti, zëvendësim dhe vetëm diferenca për pagesë regjistrohet qartë në kartelën e klientit."
        actions={<Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> Kthim / Credit Note</Button>}
      />

      {notes.length === 0 ? (
        <Card><p className="px-5 py-12 text-sm text-center text-slate-400">Nuk ka kthime të regjistruara.</p></Card>
      ) : (
        <div className="space-y-4">
          {notes.map((cn) => {
            const returned = cn.returnedItems.reduce((s, i) => s + i.amount, 0)
            const replacement = cn.replacementItems.reduce((s, i) => s + i.amount, 0)
            const diff = netDifference(returned, replacement)
            const orig = state.invoices.find((i) => i.id === cn.originalInvoiceId)
            return (
              <Card key={cn.id}>
                <CardHeader title={`Credit Note · ${cn.id}`} action={<span className="text-xs text-slate-400">{formatDate(cn.date)}</span>} />
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
                    <span className="text-slate-500">Klienti:</span>
                    <span className="font-medium text-slate-800">{partyName(state, cn.customerId)}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500">Faturë origjinale:</span>
                    <span className="font-medium text-slate-800">{orig?.number ?? cn.originalInvoiceId}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="p-4 rounded-lg bg-rose-50">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 uppercase"><RotateCcw className="w-3.5 h-3.5" /> Kthyer</p>
                      {cn.returnedItems.map((it, i) => (
                        <p key={i} className="mt-2 text-sm text-slate-700">{it.description} — {formatMoney(it.amount)}</p>
                      ))}
                    </div>
                    <div className="p-4 rounded-lg bg-emerald-50">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 uppercase"><ArrowRight className="w-3.5 h-3.5" /> Zëvendësim</p>
                      {cn.replacementItems.map((it, i) => (
                        <p key={i} className="mt-2 text-sm text-slate-700">{it.description} — {formatMoney(it.amount)}</p>
                      ))}
                    </div>
                    <div className="p-4 rounded-lg bg-indigo-50">
                      <p className="text-xs font-semibold text-indigo-700 uppercase">Diferenca</p>
                      <p className="mt-2 text-2xl font-semibold text-indigo-700">{formatMoney(diff)}</p>
                      <p className="mt-1 text-xs text-slate-500">{diff >= 0 ? 'Për pagesë nga klienti' : 'Për kreditim te klienti'}</p>
                    </div>
                  </div>
                  {cn.notes && <p className="mt-4 text-sm text-slate-500">{cn.notes}</p>}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Regjistro kthim / credit note"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Anulo</Button><Button onClick={submit}>Ruaj</Button></>}
      >
        <Field label="Klienti">
          <Select value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value, originalInvoiceId: '' })}>
            <option value="">— Zgjidh —</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </Field>
        <Field label="Faturë origjinale">
          <Select value={form.originalInvoiceId} onChange={(e) => setForm({ ...form, originalInvoiceId: e.target.value })}>
            <option value="">— Zgjidh —</option>
            {customerInvoices.map((i) => <option key={i.id} value={i.id}>{i.number}</option>)}
          </Select>
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2"><Field label="Produkt i kthyer"><Input value={form.returnedDesc} onChange={(e) => setForm({ ...form, returnedDesc: e.target.value })} /></Field></div>
          <Field label="Vlera €"><Input type="number" value={form.returnedAmount} onChange={(e) => setForm({ ...form, returnedAmount: e.target.value })} /></Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2"><Field label="Produkt zëvendësues"><Input value={form.replacementDesc} onChange={(e) => setForm({ ...form, replacementDesc: e.target.value })} /></Field></div>
          <Field label="Vlera €"><Input type="number" value={form.replacementAmount} onChange={(e) => setForm({ ...form, replacementAmount: e.target.value })} /></Field>
        </div>
        <div className="p-3 text-sm rounded-lg bg-indigo-50">
          Diferenca për pagesë: <span className="font-semibold text-indigo-700">{formatMoney(liveDiff)}</span>
        </div>
      </Modal>
    </div>
  )
}

export const Route = createFileRoute('/returns')({
  component: Returns,
})
