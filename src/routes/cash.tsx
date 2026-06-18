import { createFileRoute } from '@tanstack/react-router'
import { Banknote, User } from 'lucide-react'
import {
  usePerdorGjendjen,
  useKompaniaAktualeId,
  teFiltruara,
  balancaArkes,
  emriPales,
  formatoDate,
  formatoPara,
} from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td, Money } from '../components/finance/ui'

function Arka() {
  const gjendja = usePerdorGjendjen()
  const kompaniaId = useKompaniaAktualeId()
  const arkat = teFiltruara(gjendja.arkat, kompaniaId)

  return (
    <div>
      <PageHeader
        title="Arka"
        subtitle="Arkat me balancë fillestare, hyrje, dalje, person përgjegjës dhe mbyllje ditore."
      />

      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        {arkat.map((arka) => (
          <Card key={arka.id} className="p-5">
            <div className="flex items-center gap-2 mb-3 text-slate-500">
              <Banknote className="w-4 h-4" />
              <span className="text-sm font-medium text-slate-700">{arka.emri}</span>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{formatoPara(balancaArkes(gjendja, arka.id))}</p>
            <p className="mt-1 text-xs text-slate-400">Hapje: {formatoPara(arka.balancaFillestare, arka.monedha)}</p>
            <p className="flex items-center gap-1 mt-2 text-xs text-slate-500"><User className="w-3.5 h-3.5" /> {arka.pergjegjesi}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Lëvizjet e arkës" />
        <Table head={<><Th>Data</Th><Th>Arka</Th><Th>Pala</Th><Th>Lloji</Th><Th align="right">Shuma</Th></>}>
          {teFiltruara(gjendja.pagesat, kompaniaId)
            .filter((p) => p.arkaId)
            .sort((a, b) => b.data.localeCompare(a.data))
            .map((p) => {
              const arka = gjendja.arkat.find((a) => a.id === p.arkaId)
              return (
                <tr key={p.id}>
                  <Td>{formatoDate(p.data)}</Td>
                  <Td>{arka?.emri}</Td>
                  <Td>{emriPales(gjendja, p.palaId)}</Td>
                  <Td>{p.drejtimi === 'hyrje' ? 'Hyrje' : 'Dalje'}</Td>
                  <Td align="right"><span className={p.drejtimi === 'hyrje' ? 'text-emerald-600' : 'text-rose-600'}>{p.drejtimi === 'hyrje' ? '+' : '−'}<Money amount={p.shuma} currency={p.monedha} /></span></Td>
                </tr>
              )
            })}
        </Table>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/cash')({
  component: Arka,
})
