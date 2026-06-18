import { createFileRoute } from '@tanstack/react-router'
import { Landmark } from 'lucide-react'
import {
  usePerdorGjendjen,
  useKompaniaAktualeId,
  teFiltruara,
  balancaLlogarise,
  emriPales,
  formatoDate,
  formatoPara,
} from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td, Money, Badge } from '../components/finance/ui'

function Banka() {
  const gjendja = usePerdorGjendjen()
  const kompaniaId = useKompaniaAktualeId()
  const bankat = teFiltruara(gjendja.llogariteBankare, kompaniaId)

  return (
    <div>
      <PageHeader
        title="Banka"
        subtitle="Llogari të shumta, import statement, reconciliation, tarifa dhe kurs këmbimi."
      />

      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        {bankat.map((b) => (
          <Card key={b.id} className="p-5">
            <div className="flex items-center gap-2 mb-3 text-slate-500">
              <Landmark className="w-4 h-4" />
              <span className="text-sm font-medium text-slate-700">{b.emri}</span>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{formatoPara(balancaLlogarise(gjendja, b.id))}</p>
            <p className="mt-1 font-mono text-xs text-slate-400">{b.iban}</p>
            <p className="mt-1 text-xs text-slate-400">Monedha: {b.monedha} · Hapje: {formatoPara(b.balancaFillestare, b.monedha)}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Transaksionet bankare" />
        <Table head={<><Th>Data</Th><Th>Llogaria</Th><Th>Pala</Th><Th>Lloji</Th><Th align="right">Shuma</Th><Th align="center">Reconciled</Th></>}>
          {teFiltruara(gjendja.pagesat, kompaniaId)
            .filter((p) => p.llogariaBankareId)
            .sort((a, b) => b.data.localeCompare(a.data))
            .map((p) => {
              const banka = gjendja.llogariteBankare.find((b) => b.id === p.llogariaBankareId)
              return (
                <tr key={p.id}>
                  <Td>{formatoDate(p.data)}</Td>
                  <Td>{banka?.emri}</Td>
                  <Td>{emriPales(gjendja, p.palaId)}</Td>
                  <Td>{p.drejtimi === 'hyrje' ? 'Hyrëse' : 'Dalëse'}</Td>
                  <Td align="right"><span className={p.drejtimi === 'hyrje' ? 'text-emerald-600' : 'text-rose-600'}>{p.drejtimi === 'hyrje' ? '+' : '−'}<Money amount={p.shuma} currency={p.monedha} /></span></Td>
                  <Td align="center"><Badge status="paguar" label="✓ Reconciled" /></Td>
                </tr>
              )
            })}
        </Table>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/bank')({
  component: Banka,
})
