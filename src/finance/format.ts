import type { Monedha } from './types'

const LOKALJA_MONEDHES: Record<Monedha, string> = {
  EUR: 'de-DE',
  ALL: 'sq-AL',
  USD: 'en-US',
  GBP: 'en-GB',
}

export function formatoPara(shuma: number, monedha: Monedha = 'EUR'): string {
  try {
    return new Intl.NumberFormat(LOKALJA_MONEDHES[monedha] ?? 'en-US', {
      style: 'currency',
      currency: monedha,
      maximumFractionDigits: monedha === 'ALL' ? 0 : 2,
    }).format(shuma)
  } catch {
    return `${shuma.toFixed(2)} ${monedha}`
  }
}

export function formatoNumer(vlera: number, shifraDhjetore = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: shifraDhjetore,
    maximumFractionDigits: shifraDhjetore,
  }).format(vlera)
}

export function formatoPerqindje(vlera: number, shifraDhjetore = 1): string {
  return `${(vlera * 100).toFixed(shifraDhjetore)}%`
}

export function formatoDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function ditetMidis(ngaIso: string, deriIso: string): number {
  const nga = new Date(ngaIso).getTime()
  const deri = new Date(deriIso).getTime()
  return Math.round((deri - nga) / (1000 * 60 * 60 * 24))
}

export function celesiMuajit(iso: string): string {
  return iso.slice(0, 7) // "YYYY-MM"
}
