import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Check, X } from 'lucide-react'
import {
  usePerdorGjendjen,
  useKompaniaAktualeId,
  useVeprimetFinanca,
  teFiltruara,
  formatoDate,
  formatoPara,
} from '../finance'
import type { Monedha, KategoriaShpenzimit, MenyraPageses } from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td, Button, Badge } from '../components/finance/ui'
import { Modal, Field, Input, Select } from '../components/finance/forms'

const KATEGORITE: Record<KategoriaShpenzimit, string> = {
  qira: 'Qira', rroga: 'Rroga', marketing: 'Marketing', transport: 'Transport',
  dogane: 'Doganë', materiale: 'Materiale', pajisje: 'Pajisje', mirembajtje: 'Mirëmbajtje',
  trajnime: 'Trajnime', komision: 'Komisione', udhetim: 'Udhëtime', tarifaBankare: 'Shpenzime bankare',
  konsulence: 'Konsulenca', tjeter: 'Të tjera',
}

const PRAGU_APROVIMIT = 100

function Shpenzimet() {
  const gjendja = usePerdorGjendjen()
  const kompaniaId = useKompaniaAktualeId()
  const veprimet = useVeprimetFinanca()
  const [hapur, setHapur] = useState(false)

  const kompaniaSynuar = kompaniaId === 'grp' ? gjendja.kompanite.find((k) => !k.eshteGrup)!.id : kompaniaId
  const lista = teFiltruara(gjendja.shpenzimet, kompaniaId).sort((a, b) => b.data.localeCompare(a.data))

  const [forma, setForma] = useState({
    kategoria: 'qira' as KategoriaShpenzimit,
    pershkrimi: '',
    shuma: '0',
    monedha: 'EUR' as Monedha,
    data: '2026-06-17',
    pergjegjesi: 'edshimaj',
    menyraPageses: 'banke' as MenyraPageses,
  })

  const ruaj = () => {
    if (!forma.pershkrimi || Number(forma.shuma) <= 0) return
    const shuma = Number(forma.shuma)
    veprimet.shtoShpenzim({
      kompaniaId: kompaniaSynuar,
      kategoria: forma.kategoria,
      pershkrimi: forma.pershkrimi,
      shuma,
      monedha: forma.monedha,
      kursiKembimit: gjendja.kursetKembimit.kurset[forma.monedha] ?? 1,
      data: forma.data,
      pergjegjesi: forma.pergjegjesi,
      // Sipas kërkesave: shpenzimet mbi 100 € kërkojnë aprovim
      statusi: shuma > PRAGU_APROVIMIT ? 'pritje' : 'aprovuar',
      menyraPageses: forma.menyraPageses,
    })
    setForma({ ...forma, pershkrimi: '', shuma: '0' })
    setHapur(false)
  }

  return (
    <div>
      <PageHeader
        title="Shpenzimet"
        subtitle="Kategori, person përgjegjës, dokument dhe workflow aprovimi (mbi 100 €)."
        actions={<Button onClick={() => setHapur(true)}><Plus className="w-4 h-4" /> Shpenzim i ri</Button>}
      />
      <Card>
        <CardHeader title={`${lista.length} shpenzime`} />
        <Table
          head={
            <>
              <Th>Data</Th>
              <Th>Kategoria</Th>
              <Th>Përshkrimi</Th>
              <Th>Përgjegjës</Th>
              <Th align="right">Shuma</Th>
              <Th align="center">Statusi</Th>
              <Th align="center">Veprime</Th>
            </>
          }
        >
          {lista.map((sh) => (
            <tr key={sh.id}>
              <Td>{formatoDate(sh.data)}</Td>
              <Td>{KATEGORITE[sh.kategoria]}</Td>
              <Td>{sh.pershkrimi}</Td>
              <Td className="text-slate-500">{sh.pergjegjesi}</Td>
              <Td align="right" className="font-medium">{formatoPara(sh.shuma, sh.monedha)}</Td>
              <Td align="center"><Badge status={sh.statusi} /></Td>
              <Td align="center">
                {sh.statusi === 'pritje' ? (
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => veprimet.vendosStatusinShpenzimit(sh.id, 'aprovuar')} className="p-1 rounded text-emerald-600 hover:bg-emerald-50" title="Aprovo"><Check className="w-4 h-4" /></button>
                    <button onClick={() => veprimet.vendosStatusinShpenzimit(sh.id, 'refuzuar')} className="p-1 rounded text-rose-600 hover:bg-rose-50" title="Refuzo"><X className="w-4 h-4" /></button>
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
        open={hapur}
        onClose={() => setHapur(false)}
        title="Regjistro shpenzim"
        footer={<><Button variant="secondary" onClick={() => setHapur(false)}>Anulo</Button><Button onClick={ruaj}>Ruaj</Button></>}
      >
        <Field label="Kategoria">
          <Select value={forma.kategoria} onChange={(e) => setForma({ ...forma, kategoria: e.target.value as KategoriaShpenzimit })}>
            {(Object.keys(KATEGORITE) as KategoriaShpenzimit[]).map((c) => <option key={c} value={c}>{KATEGORITE[c]}</option>)}
          </Select>
        </Field>
        <Field label="Përshkrimi"><Input value={forma.pershkrimi} onChange={(e) => setForma({ ...forma, pershkrimi: e.target.value })} /></Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Shuma"><Input type="number" value={forma.shuma} onChange={(e) => setForma({ ...forma, shuma: e.target.value })} /></Field>
          <Field label="Monedha">
            <Select value={forma.monedha} onChange={(e) => setForma({ ...forma, monedha: e.target.value as Monedha })}>
              {(['EUR', 'ALL', 'USD', 'GBP'] as Monedha[]).map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Data"><Input type="date" value={forma.data} onChange={(e) => setForma({ ...forma, data: e.target.value })} /></Field>
        </div>
        <p className="text-xs text-slate-400">Shpenzimet mbi {formatoPara(PRAGU_APROVIMIT)} kalojnë në aprovim.</p>
      </Modal>
    </div>
  )
}

export const Route = createFileRoute('/expenses')({
  component: Shpenzimet,
})
