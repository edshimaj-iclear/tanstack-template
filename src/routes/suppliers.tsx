import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  useFinanceState,
  useCurrentCompanyId,
  useFinanceActions,
  supplierStatement,
  scoped,
  formatMoney,
} from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td, Button, Money } from '../components/finance/ui'
import { Modal, Field, Input } from '../components/finance/forms'

function Suppliers() {
  const state = useFinanceState()
  const companyId = useCurrentCompanyId()
  const actions = useFinanceActions()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', nipt: '', email: '', paymentTermsDays: '30' })

  const targetCompany = companyId === 'grp' ? state.companies.find((c) => !c.isGroup)!.id : companyId
  const list = scoped(state.suppliers, companyId)

  const submit = () => {
    if (!form.name) return
    actions.addSupplier({
      companyId: targetCompany,
      name: form.name,
      nipt: form.nipt || undefined,
      email: form.email || undefined,
      paymentTermsDays: Number(form.paymentTermsDays) || 30,
      active: true,
    })
    setForm({ name: '', nipt: '', email: '', paymentTermsDays: '30' })
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Kartela e Furnitorit"
        subtitle="Fatura blerjeje, pagesa, detyrime të hapura dhe afate pagese."
        actions={<Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> Furnitor i ri</Button>}
      />
      <Card>
        <CardHeader title={`${list.length} furnitorë`} />
        <Table
          head={
            <>
              <Th>Furnitori</Th>
              <Th>Kontakt</Th>
              <Th align="center">Afati i pagesës</Th>
              <Th align="right">Faturuar</Th>
              <Th align="right">Paguar</Th>
              <Th align="right">Detyrim</Th>
            </>
          }
        >
          {list.map((sup) => {
            const st = supplierStatement(state, sup.id)
            return (
              <tr key={sup.id}>
                <Td>
                  <p className="font-medium text-slate-800">{sup.name}</p>
                  <p className="text-xs text-slate-400">{sup.nipt ?? '—'}</p>
                </Td>
                <Td className="text-xs text-slate-500">{sup.email}</Td>
                <Td align="center">{sup.paymentTermsDays} ditë</Td>
                <Td align="right"><Money amount={st.invoiced} /></Td>
                <Td align="right"><Money amount={st.paid} /></Td>
                <Td align="right"><span className={st.balance > 0 ? 'text-rose-600 font-medium' : 'text-slate-500'}>{formatMoney(st.balance)}</span></Td>
              </tr>
            )
          })}
        </Table>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Shto furnitor të ri"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Anulo</Button><Button onClick={submit}>Ruaj</Button></>}
      >
        <Field label="Emri"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="NIPT / VAT"><Input value={form.nipt} onChange={(e) => setForm({ ...form, nipt: e.target.value })} /></Field>
        <Field label="Email"><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Afati i pagesës (ditë)"><Input type="number" value={form.paymentTermsDays} onChange={(e) => setForm({ ...form, paymentTermsDays: e.target.value })} /></Field>
      </Modal>
    </div>
  )
}

export const Route = createFileRoute('/suppliers')({
  component: Suppliers,
})
