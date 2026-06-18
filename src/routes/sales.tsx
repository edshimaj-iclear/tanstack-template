import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  usePerdorGjendjen,
  useKompaniaAktualeId,
  teFiltruara,
  totaletFatures,
  emriPales,
  formatoDate,
} from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td, Button, Badge, Money } from '../components/finance/ui'
import { InvoiceFormModal } from '../components/finance/InvoiceFormModal'

function FaturaShitjeje() {
  const gjendja = usePerdorGjendjen()
  const kompaniaId = useKompaniaAktualeId()
  const [hapur, setHapur] = useState(false)

  const faturat = teFiltruara(gjendja.faturat, kompaniaId)
    .filter((f) => f.lloji === 'shitje')
    .sort((a, b) => b.dataLeshimit.localeCompare(a.dataLeshimit))

  return (
    <div>
      <PageHeader
        title="Fatura Shitjeje"
        subtitle="Faturë, proformë, e-invoice, me TVSH, zbritje, shumë monedha dhe pagesa të pjesshme."
        actions={<Button onClick={() => setHapur(true)}><Plus className="w-4 h-4" /> Faturë e re</Button>}
      />
      <Card>
        <CardHeader title={`${faturat.length} fatura`} />
        <Table
          head={
            <>
              <Th>Numri</Th>
              <Th>Klienti</Th>
              <Th>Data</Th>
              <Th>Afati</Th>
              <Th align="right">Nëntotal</Th>
              <Th align="right">TVSH</Th>
              <Th align="right">Totali</Th>
              <Th align="right">Mbetur</Th>
              <Th align="center">Statusi</Th>
            </>
          }
        >
          {faturat.map((fatura) => {
            const t = totaletFatures(gjendja, fatura)
            return (
              <tr key={fatura.id}>
                <Td className="font-medium">{fatura.numri}</Td>
                <Td>{emriPales(gjendja, fatura.palaId)}</Td>
                <Td>{formatoDate(fatura.dataLeshimit)}</Td>
                <Td className={fatura.dataAfatit < '2026-06-17' && t.mbetur > 0 ? 'text-rose-600' : ''}>{formatoDate(fatura.dataAfatit)}</Td>
                <Td align="right"><Money amount={t.neto} currency={fatura.monedha} /></Td>
                <Td align="right"><Money amount={t.tvsh} currency={fatura.monedha} /></Td>
                <Td align="right" className="font-medium"><Money amount={t.totali} currency={fatura.monedha} /></Td>
                <Td align="right"><Money amount={t.mbetur} currency={fatura.monedha} /></Td>
                <Td align="center"><Badge status={fatura.statusi} /></Td>
              </tr>
            )
          })}
        </Table>
      </Card>
      <InvoiceFormModal lloji="shitje" kompaniaId={kompaniaId} open={hapur} onClose={() => setHapur(false)} />
    </div>
  )
}

export const Route = createFileRoute('/sales')({
  component: FaturaShitjeje,
})
