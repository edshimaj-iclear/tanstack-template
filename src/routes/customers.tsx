import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  usePerdorGjendjen,
  useKompaniaAktualeId,
  useVeprimetFinanca,
  kartelaKlientit,
  teFiltruara,
  formatoPara,
} from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td, Button, Money, ProgressBar } from '../components/finance/ui'
import { Modal, Field, Input } from '../components/finance/forms'

function Klientet() {
  const gjendja = usePerdorGjendjen()
  const kompaniaId = useKompaniaAktualeId()
  const veprimet = useVeprimetFinanca()
  const [hapur, setHapur] = useState(false)
  const [forma, setForma] = useState({ emri: '', nipt: '', email: '', telefoni: '', limitiKreditit: '5000' })

  const kompaniaSynuar = kompaniaId === 'grp' ? gjendja.kompanite.find((k) => !k.eshteGrup)!.id : kompaniaId
  const lista = teFiltruara(gjendja.klientet, kompaniaId)

  const ruaj = () => {
    if (!forma.emri) return
    veprimet.shtoKlient({
      kompaniaId: kompaniaSynuar,
      emri: forma.emri,
      nipt: forma.nipt || undefined,
      email: forma.email || undefined,
      telefoni: forma.telefoni || undefined,
      limitiKreditit: Number(forma.limitiKreditit) || 0,
      aktiv: true,
    })
    setForma({ emri: '', nipt: '', email: '', telefoni: '', limitiKreditit: '5000' })
    setHapur(false)
  }

  return (
    <div>
      <PageHeader
        title="Kartela e Klientit"
        subtitle="Bleu, pagoi, borxhi, limiti i kreditit dhe statusi për çdo klient."
        actions={<Button onClick={() => setHapur(true)}><Plus className="w-4 h-4" /> Klient i ri</Button>}
      />
      <Card>
        <CardHeader title={`${lista.length} klientë`} />
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
          {lista.map((klienti) => {
            const kartela = kartelaKlientit(gjendja, klienti.id)
            return (
              <tr key={klienti.id}>
                <Td>
                  <p className="font-medium text-slate-800">{klienti.emri}</p>
                  <p className="text-xs text-slate-400">{klienti.nipt ?? 'Klient privat'}</p>
                </Td>
                <Td className="text-xs text-slate-500">{klienti.email}<br />{klienti.telefoni}</Td>
                <Td align="right"><Money amount={kartela.faturuar} /></Td>
                <Td align="right"><Money amount={kartela.paguar} /></Td>
                <Td align="right"><span className={kartela.balanca > 0 ? 'text-amber-600 font-medium' : 'text-slate-500'}>{formatoPara(kartela.balanca)}</span></Td>
                <Td>
                  <div className="w-32">
                    <ProgressBar value={kartela.balanca} max={klienti.limitiKreditit} />
                    <p className="mt-1 text-xs text-slate-400">{formatoPara(klienti.limitiKreditit)} limit</p>
                  </div>
                </Td>
              </tr>
            )
          })}
        </Table>
      </Card>

      <Modal
        open={hapur}
        onClose={() => setHapur(false)}
        title="Shto klient të ri"
        footer={<><Button variant="secondary" onClick={() => setHapur(false)}>Anulo</Button><Button onClick={ruaj}>Ruaj</Button></>}
      >
        <Field label="Emri"><Input value={forma.emri} onChange={(e) => setForma({ ...forma, emri: e.target.value })} /></Field>
        <Field label="NIPT / VAT"><Input value={forma.nipt} onChange={(e) => setForma({ ...forma, nipt: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email"><Input value={forma.email} onChange={(e) => setForma({ ...forma, email: e.target.value })} /></Field>
          <Field label="Telefon"><Input value={forma.telefoni} onChange={(e) => setForma({ ...forma, telefoni: e.target.value })} /></Field>
        </div>
        <Field label="Limiti i kreditit (€)"><Input type="number" value={forma.limitiKreditit} onChange={(e) => setForma({ ...forma, limitiKreditit: e.target.value })} /></Field>
      </Modal>
    </div>
  )
}

export const Route = createFileRoute('/customers')({
  component: Klientet,
})
