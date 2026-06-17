import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  useFinanceState,
  useFinanceActions,
  scoped,
  formatMoney,
} from '../../finance'
import type { Currency, InvoiceKind, InvoiceLine } from '../../finance'
import { Modal, Field, Input, Select, Button } from './forms'

interface DraftLine {
  description: string
  productId: string
  quantity: string
  unitPrice: string
  discount: string
  vatRate: string
}

const emptyLine = (): DraftLine => ({
  description: '',
  productId: '',
  quantity: '1',
  unitPrice: '0',
  discount: '0',
  vatRate: '20',
})

const CURRENCIES: Currency[] = ['EUR', 'ALL', 'USD', 'GBP']

export function InvoiceFormModal({
  kind,
  companyId,
  open,
  onClose,
}: {
  kind: InvoiceKind
  companyId: string
  open: boolean
  onClose: () => void
}) {
  const state = useFinanceState()
  const actions = useFinanceActions()
  const targetCompany = companyId === 'grp' ? state.companies.find((c) => !c.isGroup)!.id : companyId

  const parties = kind === 'sale'
    ? scoped(state.customers, companyId)
    : scoped(state.suppliers, companyId)
  const products = scoped(state.products, companyId)

  const [partyId, setPartyId] = useState('')
  const [issueDate, setIssueDate] = useState('2026-06-17')
  const [dueDate, setDueDate] = useState('2026-07-17')
  const [currency, setCurrency] = useState<Currency>('EUR')
  const [lines, setLines] = useState<DraftLine[]>([emptyLine()])

  const updateLine = (i: number, patch: Partial<DraftLine>) => {
    setLines((ls) => ls.map((l, idx) => (idx === i ? { ...l, ...patch } : l)))
  }

  const onPickProduct = (i: number, productId: string) => {
    const p = products.find((x) => x.id === productId)
    if (!p) {
      updateLine(i, { productId: '' })
      return
    }
    updateLine(i, {
      productId,
      description: p.name,
      unitPrice: String(kind === 'sale' ? p.unitPrice : p.cost),
      vatRate: String(p.vatRate * 100),
    })
  }

  const net = lines.reduce(
    (s, l) => s + Number(l.quantity) * Number(l.unitPrice) * (1 - Number(l.discount) / 100),
    0,
  )
  const vat = lines.reduce(
    (s, l) =>
      s +
      Number(l.quantity) * Number(l.unitPrice) * (1 - Number(l.discount) / 100) * (Number(l.vatRate) / 100),
    0,
  )

  const reset = () => {
    setPartyId('')
    setLines([emptyLine()])
    setCurrency('EUR')
  }

  const submit = () => {
    if (!partyId || lines.length === 0) return
    const prefix = kind === 'sale' ? 'SI' : 'PI'
    const seq = state.invoices.filter((i) => i.kind === kind).length + 1
    const invLines: InvoiceLine[] = lines.map((l, idx) => ({
      id: `l${idx + 1}`,
      productId: l.productId || undefined,
      description: l.description || 'Artikull',
      quantity: Number(l.quantity) || 0,
      unitPrice: Number(l.unitPrice) || 0,
      discount: (Number(l.discount) || 0) / 100,
      vatRate: (Number(l.vatRate) || 0) / 100,
    }))
    actions.addInvoice({
      companyId: targetCompany,
      kind,
      number: `${prefix}-2026-${String(9000 + seq)}`,
      partyId,
      issueDate,
      dueDate,
      currency,
      exchangeRate: state.exchangeRates.rates[currency] ?? 1,
      status: 'approved',
      paidAmount: 0,
      lines: invLines,
    })
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={kind === 'sale' ? 'Faturë e re shitjeje' : 'Faturë e re blerjeje'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Anulo</Button>
          <Button onClick={submit}>Krijo faturën</Button>
        </>
      }
    >
      <Field label={kind === 'sale' ? 'Klienti' : 'Furnitori'}>
        <Select value={partyId} onChange={(e) => setPartyId(e.target.value)}>
          <option value="">— Zgjidh —</option>
          {parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </Select>
      </Field>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Data"><Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} /></Field>
        <Field label="Afati"><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></Field>
        <Field label="Monedha">
          <Select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Artikujt</p>
        <div className="space-y-2">
          {lines.map((l, i) => (
            <div key={i} className="p-3 border rounded-lg border-slate-200 bg-slate-50">
              {products.length > 0 && (
                <Select value={l.productId} onChange={(e) => onPickProduct(i, e.target.value)} className="mb-2">
                  <option value="">— Produkt (opsional) —</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </Select>
              )}
              <Input className="mb-2" placeholder="Përshkrim" value={l.description} onChange={(e) => updateLine(i, { description: e.target.value })} />
              <div className="grid grid-cols-4 gap-2">
                <Input type="number" placeholder="Sasi" value={l.quantity} onChange={(e) => updateLine(i, { quantity: e.target.value })} />
                <Input type="number" placeholder="Çmim" value={l.unitPrice} onChange={(e) => updateLine(i, { unitPrice: e.target.value })} />
                <Input type="number" placeholder="Zbritje %" value={l.discount} onChange={(e) => updateLine(i, { discount: e.target.value })} />
                <Input type="number" placeholder="TVSH %" value={l.vatRate} onChange={(e) => updateLine(i, { vatRate: e.target.value })} />
              </div>
              {lines.length > 1 && (
                <button onClick={() => setLines((ls) => ls.filter((_, idx) => idx !== i))} className="inline-flex items-center gap-1 mt-2 text-xs text-rose-600 hover:underline">
                  <Trash2 className="w-3.5 h-3.5" /> Hiq
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={() => setLines((ls) => [...ls, emptyLine()])} className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-indigo-600 hover:underline">
          <Plus className="w-4 h-4" /> Shto artikull
        </button>
      </div>

      <div className="pt-3 mt-2 space-y-1 text-sm border-t border-slate-100">
        <div className="flex justify-between text-slate-500"><span>Nëntotal</span><span>{formatMoney(net, currency)}</span></div>
        <div className="flex justify-between text-slate-500"><span>TVSH</span><span>{formatMoney(vat, currency)}</span></div>
        <div className="flex justify-between text-base font-semibold text-slate-900"><span>Totali</span><span>{formatMoney(net + vat, currency)}</span></div>
      </div>
    </Modal>
  )
}
