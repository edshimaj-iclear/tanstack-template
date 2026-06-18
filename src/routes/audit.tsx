import { createFileRoute } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { usePerdorGjendjen } from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td } from '../components/finance/ui'

function Auditi() {
  const gjendja = usePerdorGjendjen()
  const rreshtat = [...gjendja.regjistriAuditit].sort((a, b) => b.koha - a.koha)

  return (
    <div>
      <PageHeader
        title="Audit Log"
        subtitle="Çdo veprim financiar regjistrohet dhe nuk mund të fshihet."
      />
      <Card>
        <CardHeader title={`${rreshtat.length} veprime`} />
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
          {rreshtat.map((z) => (
            <tr key={z.id}>
              <Td>{new Date(z.koha).toLocaleString('en-GB')}</Td>
              <Td className="font-medium">{z.perdoruesi}</Td>
              <Td>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  {z.veprimi}
                </span>
              </Td>
              <Td>{z.entiteti}</Td>
              <Td>{z.pas ?? '—'}</Td>
              <Td className="text-xs text-slate-400">{z.ip} · {z.pajisja}</Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/audit')({
  component: Auditi,
})
