import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import {
  usePerdorGjendjen,
  useKompaniaAktualeId,
  useVeprimetFinanca,
  teFiltruara,
  emriPales,
  formatoDate,
  formatoPara,
} from '../finance'
import type { Monedha, DrejtimiPageses, MenyraPageses } from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td, Button, Money } from '../components/finance/ui'
import { Modal, Field, Input, Select } from '../components/finance/forms'

const ETIKETAT_MENYRES: Record<MenyraPageses, string> = {
  cash: 'Cash', banke: 'Bankë', karte: 'Kartë', transferte: 'Transfertë',
}

function Pagesat() {
  const gjendja = usePerdorGjendjen()
  const kompaniaId = useKompaniaAktualeId()
  const veprimet = useVeprimetFinanca()
  const [hapur, setHapur] = useState(false)

  const kompaniaSynuar = kompaniaId === 'grp' ? gjendja.kompanite.find((k) => !k.eshteGrup)!.id : kompaniaId
  const lista = teFiltruara(gjendja.pagesat, kompaniaId).sort((a, b) => b.data.localeCompare(a.data))

  const [forma, setForma] = useState({
    drejtimi: 'hyrje' as DrejtimiPageses,
    menyra: 'banke' as MenyraPageses,
    palaId: '',
    faturaId: '',
    shuma: '0',
    monedha: 'EUR' as Monedha,
    data: '2026-06-17',
  })

  const palet = forma.drejtimi === 'hyrje' ? teFiltruara(gjendja.klientet, kompaniaId) : teFiltruara(gjendja.furnitoret, kompaniaId)
  const faturatHapura = teFiltruara(gjendja.faturat, kompaniaId).filter(
    (f) => f.lloji === (forma.drejtimi === 'hyrje' ? 'shitje' : 'blerje') && f.palaId === forma.palaId,
  )
  const bankat = teFiltruara(gjendja.llogariteBankare, kompaniaId)
  const arkat = teFiltruara(gjendja.arkat, kompaniaId)

  const ruaj = () => {
    if (!forma.palaId || Number(forma.shuma) <= 0) return
    veprimet.shtoPagese({
      kompaniaId: kompaniaSynuar,
      drejtimi: forma.drejtimi,
      menyra: forma.menyra,
      palaId: forma.palaId,
      faturaId: forma.faturaId || undefined,
      shuma: Number(forma.shuma),
      monedha: forma.monedha,
      kursiKembimit: gjendja.kursetKembimit.kurset[forma.monedha] ?? 1,
      data: forma.data,
      llogariaBankareId: forma.menyra !== 'cash' ? bankat[0]?.id : undefined,
      arkaId: forma.menyra === 'cash' ? arkat[0]?.id : undefined,
    })
    setForma({ ...forma, palaId: '', faturaId: '', shuma: '0' })
    setHapur(false)
  }

  return (
    <div>
      <PageHeader
        title="Pagesat"
        subtitle="Cash, bankë, kartë, transfertë — pagesa hyrëse dhe dalëse të lidhura me fatura."
        actions={<Button onClick={() => setHapur(true)}><Plus className="w-4 h-4" /> Pagesë e re</Button>}
      />
      <Card>
        <CardHeader title={`${lista.length} pagesa`} />
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
          {lista.map((p) => {
            const fatura = p.faturaId ? gjendja.faturat.find((f) => f.id === p.faturaId) : null
            return (
              <tr key={p.id}>
                <Td>{formatoDate(p.data)}</Td>
                <Td>
                  {p.drejtimi === 'hyrje' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600"><ArrowDownLeft className="w-4 h-4" /> Hyrëse</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-600"><ArrowUpRight className="w-4 h-4" /> Dalëse</span>
                  )}
                </Td>
                <Td>{emriPales(gjendja, p.palaId)}</Td>
                <Td>{ETIKETAT_MENYRES[p.menyra]}</Td>
                <Td className="text-xs text-slate-500">{fatura?.numri ?? '—'}</Td>
                <Td align="right"><Money amount={p.shuma} currency={p.monedha} /></Td>
                <Td align="right" className="text-slate-500">{formatoPara(p.shuma * (p.kursiKembimit || 1))}</Td>
              </tr>
            )
          })}
        </Table>
      </Card>

      <Modal
        open={hapur}
        onClose={() => setHapur(false)}
        title="Regjistro pagesë"
        footer={<><Button variant="secondary" onClick={() => setHapur(false)}>Anulo</Button><Button onClick={ruaj}>Ruaj</Button></>}
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Drejtimi">
            <Select value={forma.drejtimi} onChange={(e) => setForma({ ...forma, drejtimi: e.target.value as DrejtimiPageses, palaId: '', faturaId: '' })}>
              <option value="hyrje">Hyrëse (nga klienti)</option>
              <option value="dalje">Dalëse (te furnitori)</option>
            </Select>
          </Field>
          <Field label="Metoda">
            <Select value={forma.menyra} onChange={(e) => setForma({ ...forma, menyra: e.target.value as MenyraPageses })}>
              {(Object.keys(ETIKETAT_MENYRES) as MenyraPageses[]).map((m) => <option key={m} value={m}>{ETIKETAT_MENYRES[m]}</option>)}
            </Select>
          </Field>
        </div>
        <Field label={forma.drejtimi === 'hyrje' ? 'Klienti' : 'Furnitori'}>
          <Select value={forma.palaId} onChange={(e) => setForma({ ...forma, palaId: e.target.value, faturaId: '' })}>
            <option value="">— Zgjidh —</option>
            {palet.map((p) => <option key={p.id} value={p.id}>{p.emri}</option>)}
          </Select>
        </Field>
        <Field label="Faturë (opsionale)">
          <Select value={forma.faturaId} onChange={(e) => setForma({ ...forma, faturaId: e.target.value })}>
            <option value="">— Pa faturë —</option>
            {faturatHapura.map((f) => <option key={f.id} value={f.id}>{f.numri}</option>)}
          </Select>
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Shuma"><Input type="number" value={forma.shuma} onChange={(e) => setForma({ ...forma, shuma: e.target.value })} /></Field>
          <Field label="Monedha">
            <Select value={forma.monedha} onChange={(e) => setForma({ ...forma, monedha: e.target.value as Monedha })}>
              {(['EUR', 'ALL', 'USD', 'GBP'] as Monedha[]).map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Data"><Input type="date" value={forma.data} onChange={(e) => setForma({ ...forma, data: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  )
}

export const Route = createFileRoute('/payments')({
  component: Pagesat,
})
