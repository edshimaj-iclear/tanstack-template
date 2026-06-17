import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Check, X } from 'lucide-react'
import {
  useFinanceState,
  useCurrentCompanyId,
  useFinanceActions,
  scoped,
  formatDate,
  formatMoney,
} from '../finance'
import type { Currency, ExpenseCategory, PaymentMethod } from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td, Button, Badge } from '../components/finance/ui'
import { Modal, Field, Input, Select } from '../components/finance/forms'

const CATEGORIES: Record<ExpenseCategory, string> = {
  rent: 'Qira', salary: 'Rroga', marketing: 'Marketing', transport: 'Transport',
  customs: 'Doganë', materials: 'Materiale', equipment: 'Pajisje', maintenance: 'Mirëmbajtje',
  training: 'Trajnime', commission: 'Komisione', travel: 'Udhëtime', bank_fees: 'Shpenzime bankare',
  consulting: 'Konsulenca', other: 'Të tjera',
}

const APPROVAL_THRESHOLD = 100

function Expenses() {
  const state = useFinanceState()
  const companyId = useCurrentCompanyId()
  const actions = useFinanceActions()
  const [open, setOpen] = useState(false)

  const targetCompany = companyId === 'grp' ? state.companies.find((c) => !c.isGroup)!.id : companyId
  const list = scoped(state.expenses, companyId).sort((a, b) => b.date.localeCompare(a.date))

  const [form, setForm] = useState({
    category: 'rent' as ExpenseCategory,
    description: '',
    amount: '0',
    currency: 'EUR' as Currency,
    date: '2026-06-17',
    responsible: 'edshimaj',
    paymentMethod: 'bank' as PaymentMethod,
  })

  const submit = () => {
    if (!form.description || Number(form.amount) <= 0) return
    const amount = Number(form.amount)
    actions.addExpense({
      companyId: targetCompany,
      category: form.category,
      description: form.description,
      amount,
      currency: form.currency,
      exchangeRate: state.exchangeRates.rates[form.currency] ?? 1,
      date: form.date,
      responsible: form.responsible,
      // Spec: expenses over 100 € require approval
      status: amount > APPROVAL_THRESHOLD ? 'pending' : 'approved',
      paymentMethod: form.paymentMethod,
    })
    setForm({ ...form, description: '', amount: '0' })
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Shpenzimet"
        subtitle="Kategori, person përgjegjës, dokument dhe workflow aprovimi (mbi 100 €)."
        actions={<Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> Shpenzim i ri</Button>}
      />
      <Card>
        <CardHeader title={`${list.length} shpenzime`} />
        <Table
          head={
            <>
              <Th>Data</Th>
              <Th>Kategoria</Th>
              <Th>Përshkrimi</Th>
              <Th>Përgjegjës</Th>
              <Th align="right">Shuma</Th>
              <Th align="center">Status</Th>
              <Th align="center">Veprime</Th>
            </>
          }
        >
          {list.map((e) => (
            <tr key={e.id}>
              <Td>{formatDate(e.date)}</Td>
              <Td>{CATEGORIES[e.category]}</Td>
              <Td>{e.description}</Td>
              <Td className="text-slate-500">{e.responsible}</Td>
              <Td align="right" className="font-medium">{formatMoney(e.amount, e.currency)}</Td>
              <Td align="center"><Badge status={e.status} /></Td>
              <Td align="center">
                {e.status === 'pending' ? (
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => actions.setExpenseStatus(e.id, 'approved')} className="p-1 rounded text-emerald-600 hover:bg-emerald-50" title="Aprovo"><Check className="w-4 h-4" /></button>
                    <button onClick={() => actions.setExpenseStatus(e.id, 'rejected')} className="p-1 rounded text-rose-600 hover:bg-rose-50" title="Refuzo"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-300">—</span>
                )}
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Regjistro shpenzim"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Anulo</Button><Button onClick={submit}>Ruaj</Button></>}
      >
        <Field label="Kategoria">
          <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ExpenseCategory })}>
            {(Object.keys(CATEGORIES) as ExpenseCategory[]).map((c) => <option key={c} value={c}>{CATEGORIES[c]}</option>)}
          </Select>
        </Field>
        <Field label="Përshkrimi"><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Shuma"><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></Field>
          <Field label="Monedha">
            <Select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as Currency })}>
              {(['EUR', 'ALL', 'USD', 'GBP'] as Currency[]).map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Data"><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
        </div>
        <p className="text-xs text-slate-400">Shpenzimet mbi {formatMoney(APPROVAL_THRESHOLD)} kalojnë në aprovim.</p>
      </Modal>
    </div>
  )
}

export const Route = createFileRoute('/expenses')({
  component: Expenses,
})
