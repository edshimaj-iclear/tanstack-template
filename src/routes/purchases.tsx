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
  formatoPara,
} from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td, Button, Badge, Money } from '../components/finance/ui'
import { InvoiceFormModal } from '../components/finance/InvoiceFormModal'

function FaturaBlerjeje() {
  const gjendja = usePerdorGjendjen()
  const kompaniaId = useKompaniaAktualeId()
  const [hapur, setHapur] = useState(false)

  const faturat = teFiltruara(gjendja.faturat, kompaniaId)
    .filter((f) => f.lloji === 'blerje')
    .sort((a, b) => b.dataLeshimit.localeCompare(a.dataLeshimit))

  return (
    <div>
      <PageHeader
        title="Fatura Blerjeje"
        subtitle="Blerje, import, doganë, transport — kosto reale e produktit me kosto shtesë."
        actions={<Button onClick={() => setHapur(true)}><Plus className="w-4 h-4" /> Faturë e re</Button>}
      />
      <Card>
        <CardHeader title={`${faturat.length} fatura`} />
        <Table
          head={
            <>
              <Th>Numri</Th>
              <Th>Furnitori</Th>
              <Th>Data</Th>
              <Th align="right">Totali</Th>
              <Th align="right">Kosto shtesë</Th>
              <Th align="right">Mbetur</Th>
              <Th align="center">Statusi</Th>
            </>
          }
        >
          {faturat.map((fatura) => {
            const t = totaletFatures(gjendja, fatura)
            const shtese = (fatura.kostoShtese ?? []).reduce((s, c) => s + c.shuma, 0)
            return (
              <tr key={fatura.id}>
                <Td className="font-medium">{fatura.numri}</Td>
                <Td>{emriPales(gjendja, fatura.palaId)}</Td>
                <Td>{formatoDate(fatura.dataLeshimit)}</Td>
                <Td align="right" className="font-medium"><Money amount={t.totali} currency={fatura.monedha} /></Td>
                <Td align="right">{shtese > 0 ? formatoPara(shtese, fatura.monedha) : '—'}</Td>
                <Td align="right"><Money amount={t.mbetur} currency={fatura.monedha} /></Td>
                <Td align="center"><Badge status={fatura.statusi} /></Td>
              </tr>
            )
          })}
        </Table>
      </Card>
      <InvoiceFormModal lloji="blerje" kompaniaId={kompaniaId} open={hapur} onClose={() => setHapur(false)} />
    </div>
  )
}

export const Route = createFileRoute('/purchases')({
  component: FaturaBlerjeje,
})
