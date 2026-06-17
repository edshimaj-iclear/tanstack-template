import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  useFinanceState,
  useCurrentCompanyId,
  useFinanceActions,
  customerStatement,
  scoped,
  formatMoney,
} from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td, Button, Money, ProgressBar } from '../components/finance/ui'
import { Modal, Field, Input } from '../components/finance/forms'

function Customers() {
  const state = useFinanceState()
  const companyId = useCurrentCompanyId()
  const actions = useFinanceActions()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', nipt: '', email: '', phone: '', creditLimit: '5000' })

  const targetCompany = companyId === 'grp' ? state.companies.find((c) => !c.isGroup)!.id : companyId
  const list = scoped(state.customers, companyId)

  const submit = () => {
    if (!form.name) return
    actions.addCustomer({
      companyId: targetCompany,
      name: form.name,
      nipt: form.nipt || undefined,
      email: form.email || undefined,
      phone: form.phone || undefined,
      creditLimit: Number(form.creditLimit) || 0,
      active: true,
    })
    setForm({ name: '', nipt: '', email: '', phone: '', creditLimit: '5000' })
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Kartela e Klientit"
        subtitle="Bleu, pagoi, borxhi, limiti i kreditit dhe statusi për çdo klient."
        actions={<Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> Klient i ri</Button>}
      />
      <Card>
        <CardHeader title={`${list.length} klientë`} />
        <Table
          head={
            <>
              <Th>Klienti</Th>
              <Th>Kontakt</Th>
              <Th align="right">Blerë</Th>
              <Th align="right">Paguar</Th>
              <Th align="right">Borxh</Th>
              <Th>Limiti i kreditit</Th>
            </>
          }
        >
          {list.map((c) => {
            const st = customerStatement(state, c.id)
            return (
              <tr key={c.id}>
                <Td>
                  <p className="font-medium text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.nipt ?? 'Klient privat'}</p>
                </Td>
                <Td className="text-xs text-slate-500">{c.email}<br />{c.phone}</Td>
                <Td align="right"><Money amount={st.invoiced} /></Td>
                <Td align="right"><Money amount={st.paid} /></Td>
                <Td align="right"><span className={st.balance > 0 ? 'text-amber-600 font-medium' : 'text-slate-500'}>{formatMoney(st.balance)}</span></Td>
                <Td>
                  <div className="w-32">
                    <ProgressBar value={st.balance} max={c.creditLimit} />
                    <p className="mt-1 text-xs text-slate-400">{formatMoney(c.creditLimit)} limit</p>
                  </div>
                </Td>
              </tr>
            )
          })}
        </Table>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Shto klient të ri"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Anulo</Button><Button onClick={submit}>Ruaj</Button></>}
      >
        <Field label="Emri"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="NIPT / VAT"><Input value={form.nipt} onChange={(e) => setForm({ ...form, nipt: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email"><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Telefon"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        </div>
        <Field label="Limiti i kreditit (€)"><Input type="number" value={form.creditLimit} onChange={(e) => setForm({ ...form, creditLimit: e.target.value })} /></Field>
      </Modal>
    </div>
  )
}

export const Route = createFileRoute('/customers')({
  component: Customers,
})
