import { createFileRoute } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { useFinanceState } from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td } from '../components/finance/ui'

function Audit() {
  const state = useFinanceState()
  const rows = [...state.auditLog].sort((a, b) => b.timestamp - a.timestamp)

  return (
    <div>
      <PageHeader
        title="Audit Log"
        subtitle="Çdo veprim financiar regjistrohet dhe nuk mund të fshihet."
      />
      <Card>
        <CardHeader title={`${rows.length} veprime`} />
        <Table
          head={
            <>
              <Th>Koha</Th>
              <Th>Përdoruesi</Th>
              <Th>Veprimi</Th>
              <Th>Entiteti</Th>
              <Th>Vlera</Th>
              <Th>IP / Pajisja</Th>
            </>
          }
        >
          {rows.map((e) => (
            <tr key={e.id}>
              <Td>{new Date(e.timestamp).toLocaleString('en-GB')}</Td>
              <Td className="font-medium">{e.user}</Td>
              <Td>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  {e.action}
                </span>
              </Td>
              <Td>{e.entity}</Td>
              <Td>{e.after ?? '—'}</Td>
              <Td className="text-xs text-slate-400">{e.ip} · {e.device}</Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/audit')({
  component: Audit,
})
