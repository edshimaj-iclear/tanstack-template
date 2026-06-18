import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Sparkles, Send } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import {
  usePerdorGjendjen,
  permbledhje,
  emriKompanise,
  kartelaKlientit,
  formatoPara,
} from '../finance'
import type { GjendjaFinanca } from '../finance'
import { genAIResponse, type Message } from '../utils'
import { PageHeader, Card } from '../components/finance/ui'

// Ndërton një fotografi kompakte financiare që modeli mund të arsyetojë mbi të.
function ndertoKontekstin(gjendja: GjendjaFinanca): string {
  const rreshtat: string[] = []
  rreshtat.push('Ti je AI Asistenti Financiar i grupit iClear. Përgjigju shkurt, profesionalisht, në shqip (ose në gjuhën e pyetjes). Bazohu VETËM në të dhënat e mëposhtme. Data e sotme: 2026-06-17. Të gjitha vlerat janë në EUR (monedha bazë).')
  rreshtat.push('')
  for (const k of gjendja.kompanite) {
    const p = permbledhje(gjendja, k.id)
    rreshtat.push(`# ${k.emri}${k.eshteGrup ? ' (KONSOLIDUAR)' : ''}`)
    rreshtat.push(`- Të ardhura (YTD): ${formatoPara(p.teArdhura)}`)
    rreshtat.push(`- Fitim bruto: ${formatoPara(p.fitimiBruto)} | Fitim neto: ${formatoPara(p.fitimiNeto)}`)
    rreshtat.push(`- Shpenzime operative: ${formatoPara(p.shpenzimeOperative)}`)
    rreshtat.push(`- Të arkëtueshme (klientë borxh): ${formatoPara(p.teArketueshme)} | Të pagueshme (furnitorë): ${formatoPara(p.tePagueshme)}`)
    rreshtat.push(`- Banka: ${formatoPara(p.balancaBankes)} | Arka: ${formatoPara(p.balancaArkes)}`)
    rreshtat.push(`- TVSH për pagesë: ${formatoPara(p.tvshPerPagese)} | Vlera e stokut: ${formatoPara(p.vleraStokut)}`)
    rreshtat.push(`- Fatura të papaguara: ${p.numriFaturaveTePapaguara} (mbi afat: ${p.numriFaturaveMbiAfat})`)
    rreshtat.push('')
  }
  // Detaji i borxheve të klientëve
  rreshtat.push('# Borxhet e klientëve')
  for (const klienti of gjendja.klientet) {
    const kartela = kartelaKlientit(gjendja, klienti.id)
    if (kartela.balanca > 0) {
      rreshtat.push(`- ${klienti.emri} (${emriKompanise(gjendja, klienti.kompaniaId)}): borxh ${formatoPara(kartela.balanca)} nga ${formatoPara(kartela.faturuar)} të faturuara`)
    }
  }
  return rreshtat.join('\n')
}

const SUGJERIMET = [
  'Sa ishte fitimi neto për iClear Albania?',
  'Cilët klientë kanë borxhin më të madh?',
  'Sa është TVSH për pagesë në nivel grupi?',
  'Krahaso fitimin neto midis kompanive.',
]

function AsistentiFinanciar() {
  const gjendja = usePerdorGjendjen()
  const [mesazhet, setMesazhet] = useState<Message[]>([])
  const [hyrja, setHyrja] = useState('')
  const [nePritje, setNePritje] = useState<Message | null>(null)
  const [duke, setDuke] = useState(false)
  const refScroll = useRef<HTMLDivElement>(null)

  useEffect(() => {
    refScroll.current?.scrollTo({ top: refScroll.current.scrollHeight, behavior: 'smooth' })
  }, [mesazhet, nePritje])

  const dergo = useCallback(
    async (teksti: string) => {
      if (!teksti.trim() || duke) return
      const mesazhiPerdoruesit: Message = { id: Date.now().toString(), role: 'user', content: teksti.trim() }
      const historiku = [...mesazhet, mesazhiPerdoruesit]
      setMesazhet(historiku)
      setHyrja('')
      setDuke(true)
      try {
        const pergjigja = await genAIResponse({
          data: {
            messages: historiku,
            systemPrompt: { value: ndertoKontekstin(gjendja), enabled: true },
          },
        })
        const lexuesi = pergjigja.body?.getReader()
        if (!lexuesi) throw new Error('no reader')
        const dekoderi = new TextDecoder()
        let permbajtja = ''
        let buffer = ''
        let mbaroi = false
        while (!mbaroi) {
          const out = await lexuesi.read()
          mbaroi = out.done
          if (out.value) {
            buffer += dekoderi.decode(out.value, { stream: true })
            const pjeset = buffer.split('\n')
            buffer = pjeset.pop() || ''
            for (const rresht of pjeset) {
              if (!rresht.trim()) continue
              try {
                const json = JSON.parse(rresht)
                if (json.type === 'content_block_delta' && json.delta?.text) {
                  permbajtja += json.delta.text
                  setNePritje({ id: 'pending', role: 'assistant', content: permbajtja })
                }
              } catch {
                /* injoro */
              }
            }
          }
        }
        setNePritje(null)
        setMesazhet((m) => [...m, { id: (Date.now() + 1).toString(), role: 'assistant', content: permbajtja || '...' }])
      } catch {
        setNePritje(null)
        setMesazhet((m) => [
          ...m,
          { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Gabim gjatë gjenerimit. Sigurohu që ANTHROPIC_API_KEY është konfiguruar.' },
        ])
      } finally {
        setDuke(false)
      }
    },
    [mesazhet, duke, gjendja],
  )

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      <PageHeader
        title="AI Asistent Financiar"
        subtitle="Analizë në gjuhë natyrale mbi të dhënat reale të grupit."
      />

      <Card className="flex flex-col flex-1 overflow-hidden">
        <div ref={refScroll} className="flex-1 p-5 space-y-4 overflow-y-auto">
          {mesazhet.length === 0 && !nePritje && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-xl bg-indigo-100 text-indigo-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="mb-4 text-sm text-slate-500">Pyet çfarëdo rreth financave të grupit.</p>
              <div className="flex flex-wrap justify-center max-w-xl gap-2">
                {SUGJERIMET.map((q) => (
                  <button
                    key={q}
                    onClick={() => dergo(q)}
                    className="px-3 py-1.5 text-sm border rounded-full border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {[...mesazhet, nePritje].filter((m): m is Message => m !== null).map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                {m.role === 'assistant' ? (
                  <div className="prose-sm prose max-w-none prose-p:my-1 prose-headings:my-2">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            dergo(hyrja)
          }}
          className="flex items-center gap-2 p-3 border-t border-slate-100"
        >
          <input
            value={hyrja}
            onChange={(e) => setHyrja(e.target.value)}
            placeholder="Shkruaj pyetjen tënde financiare..."
            className="flex-1 px-4 py-2.5 text-sm border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={duke}
            className="inline-flex items-center justify-center w-10 h-10 text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/assistant')({
  component: AsistentiFinanciar,
})
