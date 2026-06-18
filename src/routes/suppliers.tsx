import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  usePerdorGjendjen,
  useKompaniaAktualeId,
  useVeprimetFinanca,
  kartelaFurnitorit,
  teFiltruara,
  formatoPara,
} from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td, Button, Money } from '../components/finance/ui'
import { Modal, Field, Input } from '../components/finance/forms'

function Furnitoret() {
  const gjendja = usePerdorGjendjen()
  const kompaniaId = useKompaniaAktualeId()
  const veprimet = useVeprimetFinanca()
  const [hapur, setHapur] = useState(false)
  const [forma, setForma] = useState({ emri: '', nipt: '', email: '', afatiPagesesDite: '30' })

  const kompaniaSynuar = kompaniaId === 'grp' ? gjendja.kompanite.find((k) => !k.eshteGrup)!.id : kompaniaId
  const lista = teFiltruara(gjendja.furnitoret, kompaniaId)

  const ruaj = () => {
    if (!forma.emri) return
    veprimet.shtoFurnitor({
      kompaniaId: kompaniaSynuar,
      emri: forma.emri,
      nipt: forma.nipt || undefined,
      email: forma.email || undefined,
      afatiPagesesDite: Number(forma.afatiPagesesDite) || 30,
      aktiv: true,
    })
    setForma({ emri: '', nipt: '', email: '', afatiPagesesDite: '30' })
    setHapur(false)
  }

  return (
    <div>
      <PageHeader
        title="Kartela e Furnitorit"
        subtitle="Fatura blerjeje, pagesa, detyrime të hapura dhe afate pagese."
        actions={<Button onClick={() => setHapur(true)}><Plus className="w-4 h-4" /> Furnitor i ri</Button>}
      />
      <Card>
        <CardHeader title={`${lista.length} furnitorë`} />
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
          {lista.map((furnitori) => {
            const kartela = kartelaFurnitorit(gjendja, furnitori.id)
            return (
              <tr key={furnitori.id}>
                <Td>
                  <p className="font-medium text-slate-800">{furnitori.emri}</p>
                  <p className="text-xs text-slate-400">{furnitori.nipt ?? '—'}</p>
                </Td>
                <Td className="text-xs text-slate-500">{furnitori.email}</Td>
                <Td align="center">{furnitori.afatiPagesesDite} ditë</Td>
                <Td align="right"><Money amount={kartela.faturuar} /></Td>
                <Td align="right"><Money amount={kartela.paguar} /></Td>
                <Td align="right"><span className={kartela.balanca > 0 ? 'text-rose-600 font-medium' : 'text-slate-500'}>{formatoPara(kartela.balanca)}</span></Td>
              </tr>
            )
          })}
        </Table>
      </Card>

      <Modal
        open={hapur}
        onClose={() => setHapur(false)}
        title="Shto furnitor të ri"
        footer={<><Button variant="secondary" onClick={() => setHapur(false)}>Anulo</Button><Button onClick={ruaj}>Ruaj</Button></>}
      >
        <Field label="Emri"><Input value={forma.emri} onChange={(e) => setForma({ ...forma, emri: e.target.value })} /></Field>
        <Field label="NIPT / VAT"><Input value={forma.nipt} onChange={(e) => setForma({ ...forma, nipt: e.target.value })} /></Field>
        <Field label="Email"><Input value={forma.email} onChange={(e) => setForma({ ...forma, email: e.target.value })} /></Field>
        <Field label="Afati i pagesës (ditë)"><Input type="number" value={forma.afatiPagesesDite} onChange={(e) => setForma({ ...forma, afatiPagesesDite: e.target.value })} /></Field>
      </Modal>
    </div>
  )
}

export const Route = createFileRoute('/suppliers')({
  component: Furnitoret,
})
