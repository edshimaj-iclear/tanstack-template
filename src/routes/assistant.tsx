import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Sparkles, Send } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import {
  useFinanceState,
  summary,
  companyName,
  customerStatement,
  formatMoney,
} from '../finance'
import type { FinanceState } from '../finance'
import { genAIResponse, type Message } from '../utils'
import { PageHeader, Card } from '../components/finance/ui'

// Build a compact financial snapshot the model can reason over.
function buildContext(state: FinanceState): string {
  const lines: string[] = []
  lines.push('Ti je AI Asistenti Financiar i grupit iClear. Përgjigju shkurt, profesionalisht, në shqip (ose në gjuhën e pyetjes). Bazohu VETËM në të dhënat e mëposhtme. Data e sotme: 2026-06-17. Të gjitha vlerat janë në EUR (monedha bazë).')
  lines.push('')
  for (const c of state.companies) {
    const s = summary(state, c.id)
    lines.push(`# ${c.name}${c.isGroup ? ' (KONSOLIDUAR)' : ''}`)
    lines.push(`- Të ardhura (YTD): ${formatMoney(s.revenue)}`)
    lines.push(`- Fitim bruto: ${formatMoney(s.grossProfit)} | Fitim neto: ${formatMoney(s.netProfit)}`)
    lines.push(`- Shpenzime operative: ${formatMoney(s.operatingExpenses)}`)
    lines.push(`- Të arkëtueshme (klientë borxh): ${formatMoney(s.receivables)} | Të pagueshme (furnitorë): ${formatMoney(s.payables)}`)
    lines.push(`- Banka: ${formatMoney(s.bankBalance)} | Arka: ${formatMoney(s.cashBalance)}`)
    lines.push(`- TVSH për pagesë: ${formatMoney(s.vatPayable)} | Vlera e stokut: ${formatMoney(s.inventoryValue)}`)
    lines.push(`- Fatura të papaguara: ${s.unpaidInvoiceCount} (mbi afat: ${s.overdueInvoiceCount})`)
    lines.push('')
  }
  // Customer debt detail
  lines.push('# Borxhet e klientëve')
  for (const cust of state.customers) {
    const st = customerStatement(state, cust.id)
    if (st.balance > 0) {
      lines.push(`- ${cust.name} (${companyName(state, cust.companyId)}): borxh ${formatMoney(st.balance)} nga ${formatMoney(st.invoiced)} të faturuara`)
    }
  }
  return lines.join('\n')
}

const SUGGESTIONS = [
  'Sa ishte fitimi neto për iClear Albania?',
  'Cilët klientë kanë borxhin më të madh?',
  'Sa është TVSH për pagesë në nivel grupi?',
  'Krahaso fitimin neto midis kompanive.',
]

function Assistant() {
  const state = useFinanceState()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState<Message | null>(null)
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, pending])

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return
      const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim() }
      const history = [...messages, userMsg]
      setMessages(history)
      setInput('')
      setLoading(true)
      try {
        const response = await genAIResponse({
          data: {
            messages: history,
            systemPrompt: { value: buildContext(state), enabled: true },
          },
        })
        const reader = response.body?.getReader()
        if (!reader) throw new Error('no reader')
        const decoder = new TextDecoder()
        let content = ''
        let buffer = ''
        let done = false
        while (!done) {
          const out = await reader.read()
          done = out.done
          if (out.value) {
            buffer += decoder.decode(out.value, { stream: true })
            const parts = buffer.split('\n')
            buffer = parts.pop() || ''
            for (const line of parts) {
              if (!line.trim()) continue
              try {
                const json = JSON.parse(line)
                if (json.type === 'content_block_delta' && json.delta?.text) {
                  content += json.delta.text
                  setPending({ id: 'pending', role: 'assistant', content })
                }
              } catch {
                /* ignore */
              }
            }
          }
        }
        setPending(null)
        setMessages((m) => [...m, { id: (Date.now() + 1).toString(), role: 'assistant', content: content || '...' }])
      } catch {
        setPending(null)
        setMessages((m) => [
          ...m,
          { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Gabim gjatë gjenerimit. Sigurohu që ANTHROPIC_API_KEY është konfiguruar.' },
        ])
      } finally {
        setLoading(false)
      }
    },
    [messages, loading, state],
  )

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      <PageHeader
        title="AI Asistent Financiar"
        subtitle="Analizë në gjuhë natyrale mbi të dhënat reale të grupit."
      />

      <Card className="flex flex-col flex-1 overflow-hidden">
        <div ref={scrollRef} className="flex-1 p-5 space-y-4 overflow-y-auto">
          {messages.length === 0 && !pending && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-xl bg-indigo-100 text-indigo-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="mb-4 text-sm text-slate-500">Pyet çfarëdo rreth financave të grupit.</p>
              <div className="flex flex-wrap justify-center max-w-xl gap-2">
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="px-3 py-1.5 text-sm border rounded-full border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {[...messages, pending].filter((m): m is Message => m !== null).map((m) => (
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
            send(input)
          }}
          className="flex items-center gap-2 p-3 border-t border-slate-100"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Shkruaj pyetjen tënde financiare..."
            className="flex-1 px-4 py-2.5 text-sm border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
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
  component: Assistant,
})
