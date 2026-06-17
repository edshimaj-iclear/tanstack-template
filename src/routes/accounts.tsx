import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useFinanceState, useFinanceActions } from '../finance'
import type { AccountType } from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td, Button } from '../components/finance/ui'
import { Modal, Field, Input, Select } from '../components/finance/forms'

const TYPE_LABELS: Record<AccountType, string> = {
  asset: 'Asete',
  liability: 'Detyrime',
  equity: 'Kapital',
  income: 'Të ardhura',
  expense: 'Shpenzime',
}

const TYPE_ORDER: AccountType[] = ['asset', 'liability', 'equity', 'income', 'expense']

function Accounts() {
  const state = useFinanceState()
  const actions = useFinanceActions()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ code: '', name: '', type: 'asset' as AccountType, parentId: '' })

  const submit = () => {
    if (!form.code || !form.name) return
    actions.addAccount({
      code: form.code,
      name: form.name,
      type: form.type,
      parentId: form.parentId || undefined,
    })
    setForm({ code: '', name: '', type: 'asset', parentId: '' })
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Plani Kontabël"
        subtitle="Chart of Accounts me kategori, nënllogari dhe kodifikim kontabël."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4" /> Llogari e re
          </Button>
        }
      />

      <div className="space-y-6">
        {TYPE_ORDER.map((type) => {
          const rows = state.accounts.filter((a) => a.type === type)
          if (rows.length === 0) return null
          return (
            <Card key={type}>
              <CardHeader title={TYPE_LABELS[type]} />
              <Table head={<><Th>Kodi</Th><Th>Emri</Th><Th>Nënllogari e</Th></>}>
                {rows.map((a) => {
                  const parent = a.parentId ? state.accounts.find((p) => p.id === a.parentId) : null
                  return (
                    <tr key={a.id}>
                      <Td className="font-mono">{a.code}</Td>
                      <Td className={a.parentId ? 'pl-8' : 'font-medium'}>{a.name}</Td>
                      <Td>{parent ? `${parent.code} · ${parent.name}` : '—'}</Td>
                    </tr>
                  )
                })}
              </Table>
            </Card>
          )
        })}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Krijo llogari të re"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Anulo</Button>
            <Button onClick={submit}>Ruaj</Button>
          </>
        }
      >
        <Field label="Kodi kontabël">
          <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="p.sh. 1060" />
        </Field>
        <Field label="Emri i llogarisë">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Kategoria">
          <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AccountType })}>
            {TYPE_ORDER.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
          </Select>
        </Field>
        <Field label="Nënllogari e (opsionale)">
          <Select value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })}>
            <option value="">— Asnjë —</option>
            {state.accounts.filter((a) => a.type === form.type && !a.parentId).map((a) => (
              <option key={a.id} value={a.id}>{a.code} · {a.name}</option>
            ))}
          </Select>
        </Field>
      </Modal>
    </div>
  )
}

export const Route = createFileRoute('/accounts')({
  component: Accounts,
})
