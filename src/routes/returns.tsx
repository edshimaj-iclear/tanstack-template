import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, RotateCcw, ArrowRight } from 'lucide-react'
import {
  usePerdorGjendjen,
  useKompaniaAktualeId,
  useVeprimetFinanca,
  teFiltruara,
  emriPales,
  formatoDate,
  formatoPara,
} from '../finance'
import { PageHeader, Card, CardHeader, Button } from '../components/finance/ui'
import { Modal, Field, Input, Select } from '../components/finance/forms'

function diferencaNeto(kthyer: number, zevendesim: number) {
  return zevendesim - kthyer
}

function Kthimet() {
  const gjendja = usePerdorGjendjen()
  const kompaniaId = useKompaniaAktualeId()
  const veprimet = useVeprimetFinanca()
  const [hapur, setHapur] = useState(false)

  const kompaniaSynuar = kompaniaId === 'grp' ? gjendja.kompanite.find((k) => !k.eshteGrup)!.id : kompaniaId
  const notat = teFiltruara(gjendja.notatKrediti, kompaniaId).sort((a, b) => b.data.localeCompare(a.data))
  const klientet = teFiltruara(gjendja.klientet, kompaniaId)

  const [forma, setForma] = useState({
    klientiId: '',
    faturaOrigjinaleId: '',
    pershkrimiKthyer: '',
    shumaKthyer: '0',
    pershkrimiZevendesim: '',
    shumaZevendesim: '0',
  })

  const faturatKlientit = teFiltruara(gjendja.faturat, kompaniaId).filter(
    (f) => f.lloji === 'shitje' && f.palaId === forma.klientiId,
  )
  const diferencaLive = diferencaNeto(Number(forma.shumaKthyer), Number(forma.shumaZevendesim))

  const ruaj = () => {
    if (!forma.klientiId || !forma.faturaOrigjinaleId) return
    veprimet.shtoNoteKrediti({
      kompaniaId: kompaniaSynuar,
      klientiId: forma.klientiId,
      faturaOrigjinaleId: forma.faturaOrigjinaleId,
      data: '2026-06-17',
      monedha: 'EUR',
      artikujtKthyer: forma.pershkrimiKthyer ? [{ pershkrimi: forma.pershkrimiKthyer, shuma: Number(forma.shumaKthyer) }] : [],
      artikujtZevendesues: forma.pershkrimiZevendesim ? [{ pershkrimi: forma.pershkrimiZevendesim, shuma: Number(forma.shumaZevendesim) }] : [],
      shenime: `Diferenca për pagesë: ${formatoPara(diferencaLive)}`,
    })
    setForma({ klientiId: '', faturaOrigjinaleId: '', pershkrimiKthyer: '', shumaKthyer: '0', pershkrimiZevendesim: '', shumaZevendesim: '0' })
    setHapur(false)
  }

  return (
    <div>
      <PageHeader
        title="Kthime & Credit Note"
        subtitle="Kthim produkti, zëvendësim dhe vetëm diferenca për pagesë regjistrohet qartë në kartelën e klientit."
        actions={<Button onClick={() => setHapur(true)}><Plus className="w-4 h-4" /> Kthim / Credit Note</Button>}
      />

      {notat.length === 0 ? (
        <Card><p className="px-5 py-12 text-sm text-center text-slate-400">Nuk ka kthime të regjistruara.</p></Card>
      ) : (
        <div className="space-y-4">
          {notat.map((nota) => {
            const kthyer = nota.artikujtKthyer.reduce((s, i) => s + i.shuma, 0)
            const zevendesim = nota.artikujtZevendesues.reduce((s, i) => s + i.shuma, 0)
            const diferenca = diferencaNeto(kthyer, zevendesim)
            const origjinale = gjendja.faturat.find((f) => f.id === nota.faturaOrigjinaleId)
            return (
              <Card key={nota.id}>
                <CardHeader title={`Credit Note · ${nota.id}`} action={<span className="text-xs text-slate-400">{formatoDate(nota.data)}</span>} />
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
                    <span className="text-slate-500">Klienti:</span>
                    <span className="font-medium text-slate-800">{emriPales(gjendja, nota.klientiId)}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500">Faturë origjinale:</span>
                    <span className="font-medium text-slate-800">{origjinale?.numri ?? nota.faturaOrigjinaleId}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="p-4 rounded-lg bg-rose-50">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 uppercase"><RotateCcw className="w-3.5 h-3.5" /> Kthyer</p>
                      {nota.artikujtKthyer.map((it, i) => (
                        <p key={i} className="mt-2 text-sm text-slate-700">{it.pershkrimi} — {formatoPara(it.shuma)}</p>
                      ))}
                    </div>
                    <div className="p-4 rounded-lg bg-emerald-50">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 uppercase"><ArrowRight className="w-3.5 h-3.5" /> Zëvendësim</p>
                      {nota.artikujtZevendesues.map((it, i) => (
                        <p key={i} className="mt-2 text-sm text-slate-700">{it.pershkrimi} — {formatoPara(it.shuma)}</p>
                      ))}
                    </div>
                    <div className="p-4 rounded-lg bg-indigo-50">
                      <p className="text-xs font-semibold text-indigo-700 uppercase">Diferenca</p>
                      <p className="mt-2 text-2xl font-semibold text-indigo-700">{formatoPara(diferenca)}</p>
                      <p className="mt-1 text-xs text-slate-500">{diferenca >= 0 ? 'Për pagesë nga klienti' : 'Për kreditim te klienti'}</p>
                    </div>
                  </div>
                  {nota.shenime && <p className="mt-4 text-sm text-slate-500">{nota.shenime}</p>}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        open={hapur}
        onClose={() => setHapur(false)}
        title="Regjistro kthim / credit note"
        footer={<><Button variant="secondary" onClick={() => setHapur(false)}>Anulo</Button><Button onClick={ruaj}>Ruaj</Button></>}
      >
        <Field label="Klienti">
          <Select value={forma.klientiId} onChange={(e) => setForma({ ...forma, klientiId: e.target.value, faturaOrigjinaleId: '' })}>
            <option value="">— Zgjidh —</option>
            {klientet.map((c) => <option key={c.id} value={c.id}>{c.emri}</option>)}
          </Select>
        </Field>
        <Field label="Faturë origjinale">
          <Select value={forma.faturaOrigjinaleId} onChange={(e) => setForma({ ...forma, faturaOrigjinaleId: e.target.value })}>
            <option value="">— Zgjidh —</option>
            {faturatKlientit.map((f) => <option key={f.id} value={f.id}>{f.numri}</option>)}
          </Select>
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2"><Field label="Produkt i kthyer"><Input value={forma.pershkrimiKthyer} onChange={(e) => setForma({ ...forma, pershkrimiKthyer: e.target.value })} /></Field></div>
          <Field label="Vlera €"><Input type="number" value={forma.shumaKthyer} onChange={(e) => setForma({ ...forma, shumaKthyer: e.target.value })} /></Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2"><Field label="Produkt zëvendësues"><Input value={forma.pershkrimiZevendesim} onChange={(e) => setForma({ ...forma, pershkrimiZevendesim: e.target.value })} /></Field></div>
          <Field label="Vlera €"><Input type="number" value={forma.shumaZevendesim} onChange={(e) => setForma({ ...forma, shumaZevendesim: e.target.value })} /></Field>
        </div>
        <div className="p-3 text-sm rounded-lg bg-indigo-50">
          Diferenca për pagesë: <span className="font-semibold text-indigo-700">{formatoPara(diferencaLive)}</span>
        </div>
      </Modal>
    </div>
  )
}

export const Route = createFileRoute('/returns')({
  component: Kthimet,
})
