import { createFileRoute } from '@tanstack/react-router'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Landmark,
  Users,
  Truck,
  Receipt,
  AlertTriangle,
  Percent,
  Boxes,
} from 'lucide-react'
import {
  useKompaniaAktualeId,
  usePerdorGjendjen,
  permbledhje,
  seriaMujore,
  fluksiParase,
  totaletFatures,
  emriPales,
  emriKompanise,
  teFiltruara,
  formatoPara,
  formatoDate,
  formatoPerqindje,
} from '../finance'
import { PageHeader, StatCard, Card, CardHeader, Table, Th, Td, Badge, Money } from '../components/finance/ui'

function GrafikuMujor() {
  const gjendja = usePerdorGjendjen()
  const kompaniaId = useKompaniaAktualeId()
  const seria = seriaMujore(gjendja, kompaniaId)
  const maks = Math.max(1, ...seria.map((p) => Math.max(p.teArdhura, p.shpenzime)))
  const etiketatMuajve = ['Jan', 'Shk', 'Mar', 'Pri', 'Maj', 'Qer', 'Kor', 'Gus', 'Sht', 'Tet', 'Nën', 'Dhj']
  return (
    <Card>
      <CardHeader title="Të ardhura vs Shpenzime (2026)" />
      <div className="p-5">
        <div className="flex items-end justify-between gap-2 h-48">
          {seria.map((p, i) => (
            <div key={p.muaji} className="flex flex-col items-center flex-1 gap-1">
              <div className="flex items-end justify-center w-full gap-1 h-40">
                <div
                  className="w-1/2 rounded-t bg-indigo-500"
                  style={{ height: `${(p.teArdhura / maks) * 100}%` }}
                  title={`Të ardhura: ${formatoPara(p.teArdhura)}`}
                />
                <div
                  className="w-1/2 rounded-t bg-rose-400"
                  style={{ height: `${(p.shpenzime / maks) * 100}%` }}
                  title={`Shpenzime: ${formatoPara(p.shpenzime)}`}
                />
              </div>
              <span className="text-[10px] text-slate-400">{etiketatMuajve[i]}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-500" /> Të ardhura
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-400" /> Shpenzime
          </span>
        </div>
      </div>
    </Card>
  )
}

function Dashboard() {
  const gjendja = usePerdorGjendjen()
  const kompaniaId = useKompaniaAktualeId()
  const p = permbledhje(gjendja, kompaniaId)
  const fluks = fluksiParase(gjendja, kompaniaId)
  const marzhi = p.teArdhura > 0 ? p.fitimiNeto / p.teArdhura : 0

  // faturat e shitjes të papaguara për tabelën
  const tePapaguara = teFiltruara(gjendja.faturat, kompaniaId)
    .filter((f) => f.lloji === 'shitje' && f.statusi !== 'anuluar')
    .map((f) => ({ fatura: f, t: totaletFatures(gjendja, f) }))
    .filter((x) => x.t.mbetur > 0)
    .sort((a, b) => b.t.mberturBaze - a.t.mberturBaze)
    .slice(0, 6)

  // klientët kryesorë debitorë
  const debitoret = teFiltruara(gjendja.klientet, kompaniaId)
    .map((klienti) => {
      const balanca = teFiltruara(gjendja.faturat, kompaniaId)
        .filter((f) => f.lloji === 'shitje' && f.palaId === klienti.id && f.statusi !== 'anuluar')
        .reduce((shuma, f) => shuma + totaletFatures(gjendja, f).mberturBaze, 0)
      return { klienti, balanca }
    })
    .filter((x) => x.balanca > 0)
    .sort((a, b) => b.balanca - a.balanca)
    .slice(0, 5)

  return (
    <div>
      <PageHeader
        title="Dashboard Financiar"
        subtitle={`${emriKompanise(gjendja, kompaniaId)} · në kohë reale · ${formatoDate('2026-06-17')}`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Të ardhura (YTD)" value={formatoPara(p.teArdhura)} tone="positive" icon={<TrendingUp className="w-5 h-5" />} hint="Pa TVSH" />
        <StatCard label="Fitim bruto" value={formatoPara(p.fitimiBruto)} hint={`Marzh: ${formatoPerqindje(p.teArdhura > 0 ? p.fitimiBruto / p.teArdhura : 0)}`} icon={<Percent className="w-5 h-5" />} />
        <StatCard label="Fitim neto" value={formatoPara(p.fitimiNeto)} tone={p.fitimiNeto >= 0 ? 'positive' : 'negative'} hint={`Marzh neto: ${formatoPerqindje(marzhi)}`} icon={p.fitimiNeto >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />} />
        <StatCard label="Cashflow operativ" value={formatoPara(fluks.operativ)} tone={fluks.operativ >= 0 ? 'positive' : 'negative'} icon={<Wallet className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Balanca bankare" value={formatoPara(p.balancaBankes)} icon={<Landmark className="w-5 h-5" />} />
        <StatCard label="Balanca në arkë" value={formatoPara(p.balancaArkes)} icon={<Wallet className="w-5 h-5" />} />
        <StatCard label="Klientë debitorë" value={formatoPara(p.teArketueshme)} tone="warning" hint={`${p.numriFaturaveTePapaguara} fatura të papaguara`} icon={<Users className="w-5 h-5" />} />
        <StatCard label="Furnitorë kreditorë" value={formatoPara(p.tePagueshme)} tone="warning" icon={<Truck className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="TVSH për pagesë" value={formatoPara(p.tvshPerPagese)} tone={p.tvshPerPagese > 0 ? 'warning' : 'positive'} hint={`Dalëse ${formatoPara(p.tvshDalese)} · Zbritëse ${formatoPara(p.tvshZbritese)}`} icon={<Percent className="w-5 h-5" />} />
        <StatCard label="Vlera e stokut" value={formatoPara(p.vleraStokut)} icon={<Boxes className="w-5 h-5" />} />
        <StatCard label="Shpenzime operative" value={formatoPara(p.shpenzimeOperative)} tone="negative" icon={<Receipt className="w-5 h-5" />} />
        <StatCard label="Pagesa të vonuara" value={String(p.numriFaturaveMbiAfat)} tone={p.numriFaturaveMbiAfat > 0 ? 'negative' : 'positive'} hint="Fatura mbi afat" icon={<AlertTriangle className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GrafikuMujor />
        </div>
        <Card>
          <CardHeader title="Klientë me borxh më të lartë" />
          {debitoret.length === 0 ? (
            <p className="px-5 py-8 text-sm text-center text-slate-400">Pa borxhe.</p>
          ) : (
            <div className="p-5 space-y-4">
              {debitoret.map(({ klienti, balanca }) => (
                <div key={klienti.id} className="flex items-center justify-between text-sm">
                  <span className="truncate text-slate-700">{klienti.emri}</span>
                  <Money amount={balanca} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader title="Fatura të papaguara" />
          <Table
            head={
              <>
                <Th>Faturë</Th>
                <Th>Klient</Th>
                <Th>Afati</Th>
                <Th align="right">Totali</Th>
                <Th align="right">Mbetur</Th>
                <Th align="center">Statusi</Th>
              </>
            }
          >
            {tePapaguara.length === 0 ? (
              <tr>
                <Td>—</Td><Td> </Td><Td> </Td><Td> </Td><Td> </Td><Td> </Td>
              </tr>
            ) : (
              tePapaguara.map(({ fatura, t }) => (
                <tr key={fatura.id}>
                  <Td className="font-medium">{fatura.numri}</Td>
                  <Td>{emriPales(gjendja, fatura.palaId)}</Td>
                  <Td>{formatoDate(fatura.dataAfatit)}</Td>
                  <Td align="right"><Money amount={t.totaliBaze} /></Td>
                  <Td align="right"><Money amount={t.mberturBaze} /></Td>
                  <Td align="center"><Badge status={fatura.statusi} /></Td>
                </tr>
              ))
            )}
          </Table>
        </Card>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Dashboard,
})
