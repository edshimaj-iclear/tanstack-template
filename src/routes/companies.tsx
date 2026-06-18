import { createFileRoute } from '@tanstack/react-router'
import { Building2 } from 'lucide-react'
import {
  usePerdorGjendjen,
  permbledhje,
  formatoPara,
  formatoPerqindje,
  veprimetFinanca,
} from '../finance'
import { PageHeader, Card } from '../components/finance/ui'

function Kompanite() {
  const gjendja = usePerdorGjendjen()
  const operative = gjendja.kompanite.filter((k) => !k.eshteGrup)
  const grupi = permbledhje(gjendja, 'grp')

  return (
    <div>
      <PageHeader
        title="Kompanitë e Grupit"
        subtitle="Strukturë multi-company me bilanc dhe raporte më vete + raport i konsoliduar."
      />

      <Card className="p-5 mb-6 bg-gradient-to-br from-indigo-600 to-violet-600 border-0">
        <p className="text-sm font-medium text-indigo-100">iClear Group Global — Konsoliduar</p>
        <div className="grid grid-cols-2 gap-6 mt-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-indigo-200">Të ardhura</p>
            <p className="text-xl font-semibold text-white">{formatoPara(grupi.teArdhura)}</p>
          </div>
          <div>
            <p className="text-xs text-indigo-200">Fitim neto</p>
            <p className="text-xl font-semibold text-white">{formatoPara(grupi.fitimiNeto)}</p>
          </div>
          <div>
            <p className="text-xs text-indigo-200">Të arkëtueshme</p>
            <p className="text-xl font-semibold text-white">{formatoPara(grupi.teArketueshme)}</p>
          </div>
          <div>
            <p className="text-xs text-indigo-200">Banka + Arka</p>
            <p className="text-xl font-semibold text-white">{formatoPara(grupi.balancaBankes + grupi.balancaArkes)}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {operative.map((k) => {
          const p = permbledhje(gjendja, k.id)
          const marzhi = p.teArdhura > 0 ? p.fitimiNeto / p.teArdhura : 0
          return (
            <Card key={k.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center rounded-lg w-9 h-9 bg-slate-100 text-slate-500">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{k.emri}</p>
                    <p className="text-xs text-slate-400">{k.shteti}</p>
                  </div>
                </div>
                <button
                  onClick={() => veprimetFinanca.vendosKompanineAktuale(k.id)}
                  className="text-xs font-medium text-indigo-600 hover:underline"
                >
                  Shiko
                </button>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-slate-500">NIPT / VAT</dt><dd className="font-medium text-slate-700">{k.nipt}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Monedha bazë</dt><dd className="font-medium text-slate-700">{k.monedhaBaze}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Të ardhura</dt><dd className="font-medium text-slate-700">{formatoPara(p.teArdhura)}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Fitim neto</dt><dd className={`font-medium ${p.fitimiNeto >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatoPara(p.fitimiNeto)} ({formatoPerqindje(marzhi)})</dd></div>
              </dl>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/companies')({
  component: Kompanite,
})
