import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  usePerdorGjendjen,
  useVeprimetFinanca,
  teFiltruara,
  formatoPara,
} from '../../finance'
import type { Monedha, LlojiFatures, RrjeshtFature } from '../../finance'
import { Modal, Field, Input, Select, Button } from './forms'

interface RrjeshtDraft {
  pershkrimi: string
  produktiId: string
  sasia: string
  cmimiNjesi: string
  zbritja: string
  normaTvsh: string
}

const rrjeshtBosh = (): RrjeshtDraft => ({
  pershkrimi: '',
  produktiId: '',
  sasia: '1',
  cmimiNjesi: '0',
  zbritja: '0',
  normaTvsh: '20',
})

const MONEDHAT: Monedha[] = ['EUR', 'ALL', 'USD', 'GBP']

export function InvoiceFormModal({
  lloji,
  kompaniaId,
  open,
  onClose,
}: {
  lloji: LlojiFatures
  kompaniaId: string
  open: boolean
  onClose: () => void
}) {
  const gjendja = usePerdorGjendjen()
  const veprimet = useVeprimetFinanca()
  const kompaniaSynuar = kompaniaId === 'grp' ? gjendja.kompanite.find((k) => !k.eshteGrup)!.id : kompaniaId

  const palet = lloji === 'shitje'
    ? teFiltruara(gjendja.klientet, kompaniaId)
    : teFiltruara(gjendja.furnitoret, kompaniaId)
  const produktet = teFiltruara(gjendja.produktet, kompaniaId)

  const [palaId, setPalaId] = useState('')
  const [dataLeshimit, setDataLeshimit] = useState('2026-06-17')
  const [dataAfatit, setDataAfatit] = useState('2026-07-17')
  const [monedha, setMonedha] = useState<Monedha>('EUR')
  const [rrjeshtat, setRrjeshtat] = useState<RrjeshtDraft[]>([rrjeshtBosh()])

  const perditesoRrjeshtin = (i: number, ndryshim: Partial<RrjeshtDraft>) => {
    setRrjeshtat((rr) => rr.map((l, idx) => (idx === i ? { ...l, ...ndryshim } : l)))
  }

  const zgjidhProduktin = (i: number, produktiId: string) => {
    const p = produktet.find((x) => x.id === produktiId)
    if (!p) {
      perditesoRrjeshtin(i, { produktiId: '' })
      return
    }
    perditesoRrjeshtin(i, {
      produktiId,
      pershkrimi: p.emri,
      cmimiNjesi: String(lloji === 'shitje' ? p.cmimiNjesi : p.kostoja),
      normaTvsh: String(p.normaTvsh * 100),
    })
  }

  const neto = rrjeshtat.reduce(
    (s, l) => s + Number(l.sasia) * Number(l.cmimiNjesi) * (1 - Number(l.zbritja) / 100),
    0,
  )
  const tvsh = rrjeshtat.reduce(
    (s, l) =>
      s +
      Number(l.sasia) * Number(l.cmimiNjesi) * (1 - Number(l.zbritja) / 100) * (Number(l.normaTvsh) / 100),
    0,
  )

  const rivendos = () => {
    setPalaId('')
    setRrjeshtat([rrjeshtBosh()])
    setMonedha('EUR')
  }

  const ruaj = () => {
    if (!palaId || rrjeshtat.length === 0) return
    const prefiks = lloji === 'shitje' ? 'SI' : 'PI'
    const seq = gjendja.faturat.filter((f) => f.lloji === lloji).length + 1
    const rrjeshtatFatures: RrjeshtFature[] = rrjeshtat.map((l, idx) => ({
      id: `l${idx + 1}`,
      produktiId: l.produktiId || undefined,
      pershkrimi: l.pershkrimi || 'Artikull',
      sasia: Number(l.sasia) || 0,
      cmimiNjesi: Number(l.cmimiNjesi) || 0,
      zbritja: (Number(l.zbritja) || 0) / 100,
      normaTvsh: (Number(l.normaTvsh) || 0) / 100,
    }))
    veprimet.shtoFature({
      kompaniaId: kompaniaSynuar,
      lloji,
      numri: `${prefiks}-2026-${String(9000 + seq)}`,
      palaId,
      dataLeshimit,
      dataAfatit,
      monedha,
      kursiKembimit: gjendja.kursetKembimit.kurset[monedha] ?? 1,
      statusi: 'aprovuar',
      shumaPaguar: 0,
      rrjeshtat: rrjeshtatFatures,
    })
    rivendos()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={lloji === 'shitje' ? 'Faturë e re shitjeje' : 'Faturë e re blerjeje'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Anulo</Button>
          <Button onClick={ruaj}>Krijo faturën</Button>
        </>
      }
    >
      <Field label={lloji === 'shitje' ? 'Klienti' : 'Furnitori'}>
        <Select value={palaId} onChange={(e) => setPalaId(e.target.value)}>
          <option value="">— Zgjidh —</option>
          {palet.map((p) => <option key={p.id} value={p.id}>{p.emri}</option>)}
        </Select>
      </Field>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Data"><Input type="date" value={dataLeshimit} onChange={(e) => setDataLeshimit(e.target.value)} /></Field>
        <Field label="Afati"><Input type="date" value={dataAfatit} onChange={(e) => setDataAfatit(e.target.value)} /></Field>
        <Field label="Monedha">
          <Select value={monedha} onChange={(e) => setMonedha(e.target.value as Monedha)}>
            {MONEDHAT.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Artikujt</p>
        <div className="space-y-2">
          {rrjeshtat.map((l, i) => (
            <div key={i} className="p-3 border rounded-lg border-slate-200 bg-slate-50">
              {produktet.length > 0 && (
                <Select value={l.produktiId} onChange={(e) => zgjidhProduktin(i, e.target.value)} className="mb-2">
                  <option value="">— Produkt (opsional) —</option>
                  {produktet.map((p) => <option key={p.id} value={p.id}>{p.emri}</option>)}
                </Select>
              )}
              <Input className="mb-2" placeholder="Përshkrim" value={l.pershkrimi} onChange={(e) => perditesoRrjeshtin(i, { pershkrimi: e.target.value })} />
              <div className="grid grid-cols-4 gap-2">
                <Input type="number" placeholder="Sasi" value={l.sasia} onChange={(e) => perditesoRrjeshtin(i, { sasia: e.target.value })} />
                <Input type="number" placeholder="Çmim" value={l.cmimiNjesi} onChange={(e) => perditesoRrjeshtin(i, { cmimiNjesi: e.target.value })} />
                <Input type="number" placeholder="Zbritje %" value={l.zbritja} onChange={(e) => perditesoRrjeshtin(i, { zbritja: e.target.value })} />
                <Input type="number" placeholder="TVSH %" value={l.normaTvsh} onChange={(e) => perditesoRrjeshtin(i, { normaTvsh: e.target.value })} />
              </div>
              {rrjeshtat.length > 1 && (
                <button onClick={() => setRrjeshtat((rr) => rr.filter((_, idx) => idx !== i))} className="inline-flex items-center gap-1 mt-2 text-xs text-rose-600 hover:underline">
                  <Trash2 className="w-3.5 h-3.5" /> Hiq
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={() => setRrjeshtat((rr) => [...rr, rrjeshtBosh()])} className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-indigo-600 hover:underline">
          <Plus className="w-4 h-4" /> Shto artikull
        </button>
      </div>

      <div className="pt-3 mt-2 space-y-1 text-sm border-t border-slate-100">
        <div className="flex justify-between text-slate-500"><span>Nëntotal</span><span>{formatoPara(neto, monedha)}</span></div>
        <div className="flex justify-between text-slate-500"><span>TVSH</span><span>{formatoPara(tvsh, monedha)}</span></div>
        <div className="flex justify-between text-base font-semibold text-slate-900"><span>Totali</span><span>{formatoPara(neto + tvsh, monedha)}</span></div>
      </div>
    </Modal>
  )
}
