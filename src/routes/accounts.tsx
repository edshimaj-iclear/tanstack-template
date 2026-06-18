import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { usePerdorGjendjen, useVeprimetFinanca } from '../finance'
import type { LlojiLlogarise } from '../finance'
import { PageHeader, Card, CardHeader, Table, Th, Td, Button } from '../components/finance/ui'
import { Modal, Field, Input, Select } from '../components/finance/forms'

const ETIKETAT_LLOJIT: Record<LlojiLlogarise, string> = {
  aktiv: 'Asete',
  detyrim: 'Detyrime',
  kapital: 'Kapital',
  teArdhura: 'Të ardhura',
  shpenzim: 'Shpenzime',
}

const RENDITJA_LLOJEVE: LlojiLlogarise[] = ['aktiv', 'detyrim', 'kapital', 'teArdhura', 'shpenzim']

function PlaniKontabel() {
  const gjendja = usePerdorGjendjen()
  const veprimet = useVeprimetFinanca()
  const [hapur, setHapur] = useState(false)
  const [forma, setForma] = useState({ kodi: '', emri: '', lloji: 'aktiv' as LlojiLlogarise, prinderId: '' })

  const ruaj = () => {
    if (!forma.kodi || !forma.emri) return
    veprimet.shtoLlogari({
      kodi: forma.kodi,
      emri: forma.emri,
      lloji: forma.lloji,
      prinderId: forma.prinderId || undefined,
    })
    setForma({ kodi: '', emri: '', lloji: 'aktiv', prinderId: '' })
    setHapur(false)
  }

  return (
    <div>
      <PageHeader
        title="Plani Kontabël"
        subtitle="Chart of Accounts me kategori, nënllogari dhe kodifikim kontabël."
        actions={
          <Button onClick={() => setHapur(true)}>
            <Plus className="w-4 h-4" /> Llogari e re
          </Button>
        }
      />

      <div className="space-y-6">
        {RENDITJA_LLOJEVE.map((lloji) => {
          const rreshtat = gjendja.llogarite.filter((a) => a.lloji === lloji)
          if (rreshtat.length === 0) return null
          return (
            <Card key={lloji}>
              <CardHeader title={ETIKETAT_LLOJIT[lloji]} />
              <Table head={<><Th>Kodi</Th><Th>Emri</Th><Th>Nënllogari e</Th></>}>
                {rreshtat.map((a) => {
                  const prinderi = a.prinderId ? gjendja.llogarite.find((p) => p.id === a.prinderId) : null
                  return (
                    <tr key={a.id}>
                      <Td className="font-mono">{a.kodi}</Td>
                      <Td className={a.prinderId ? 'pl-8' : 'font-medium'}>{a.emri}</Td>
                      <Td>{prinderi ? `${prinderi.kodi} · ${prinderi.emri}` : '—'}</Td>
                    </tr>
                  )
                })}
              </Table>
            </Card>
          )
        })}
      </div>

      <Modal
        open={hapur}
        onClose={() => setHapur(false)}
        title="Krijo llogari të re"
        footer={
          <>
            <Button variant="secondary" onClick={() => setHapur(false)}>Anulo</Button>
            <Button onClick={ruaj}>Ruaj</Button>
          </>
        }
      >
        <Field label="Kodi kontabël">
          <Input value={forma.kodi} onChange={(e) => setForma({ ...forma, kodi: e.target.value })} placeholder="p.sh. 1060" />
        </Field>
        <Field label="Emri i llogarisë">
          <Input value={forma.emri} onChange={(e) => setForma({ ...forma, emri: e.target.value })} />
        </Field>
        <Field label="Kategoria">
          <Select value={forma.lloji} onChange={(e) => setForma({ ...forma, lloji: e.target.value as LlojiLlogarise })}>
            {RENDITJA_LLOJEVE.map((t) => <option key={t} value={t}>{ETIKETAT_LLOJIT[t]}</option>)}
          </Select>
        </Field>
        <Field label="Nënllogari e (opsionale)">
          <Select value={forma.prinderId} onChange={(e) => setForma({ ...forma, prinderId: e.target.value })}>
            <option value="">— Asnjë —</option>
            {gjendja.llogarite.filter((a) => a.lloji === forma.lloji && !a.prinderId).map((a) => (
              <option key={a.id} value={a.id}>{a.kodi} · {a.emri}</option>
            ))}
          </Select>
        </Field>
      </Modal>
    </div>
  )
}

export const Route = createFileRoute('/accounts')({
  component: PlaniKontabel,
})
