import type { GjendjaFinanca } from './store'
import { celesiMuajit } from './format'
import type { Monedha, Fatura, RrjeshtFature } from './types'

// ---------------------------------------------------------------------------
// Konvertim monedhe
// ---------------------------------------------------------------------------
export function neBaze(
  gjendja: GjendjaFinanca,
  shuma: number,
  monedha: Monedha,
  kursi?: number,
): number {
  if (kursi && kursi > 0) return shuma * kursi
  const k = gjendja.kursetKembimit.kurset[monedha] ?? 1
  return shuma * k
}

// ---------------------------------------------------------------------------
// Fokusimi sipas kompanisë. "grp" do të thotë grupi i konsoliduar (të gjitha kompanitë operative)
// ---------------------------------------------------------------------------
export function eshtePamjaGrup(kompaniaId: string): boolean {
  return kompaniaId === 'grp'
}

function brendaFushes<T extends { kompaniaId: string }>(
  rreshtat: T[],
  kompaniaId: string,
): T[] {
  if (eshtePamjaGrup(kompaniaId)) return rreshtat.filter((r) => r.kompaniaId !== 'grp')
  return rreshtat.filter((r) => r.kompaniaId === kompaniaId)
}

// ---------------------------------------------------------------------------
// Matematika e faturës
// ---------------------------------------------------------------------------
export function rrjeshtNeto(l: RrjeshtFature): number {
  return l.sasia * l.cmimiNjesi * (1 - l.zbritja)
}
export function rrjeshtTvsh(l: RrjeshtFature): number {
  return rrjeshtNeto(l) * l.normaTvsh
}

export interface TotaletFatures {
  neto: number
  tvsh: number
  totali: number
  totaliBaze: number
  netoBaze: number
  tvshBaze: number
  mbetur: number // në monedhën e faturës
  mberturBaze: number
}

export function totaletFatures(
  _gjendja: GjendjaFinanca,
  fatura: Fatura,
): TotaletFatures {
  const neto = fatura.rrjeshtat.reduce((shuma, l) => shuma + rrjeshtNeto(l), 0)
  const tvsh = fatura.rrjeshtat.reduce((shuma, l) => shuma + rrjeshtTvsh(l), 0)
  const totali = neto + tvsh
  const mbetur = Math.max(0, totali - fatura.shumaPaguar)
  const k = fatura.kursiKembimit || 1
  return {
    neto,
    tvsh,
    totali,
    netoBaze: neto * k,
    tvshBaze: tvsh * k,
    totaliBaze: totali * k,
    mbetur,
    mberturBaze: mbetur * k,
  }
}

// Kosto e mallrave të shitura (COGS) për një faturë shitjeje, duke përdorur koston e produktit.
export function kostoFatures(gjendja: GjendjaFinanca, fatura: Fatura): number {
  if (fatura.lloji !== 'shitje') return 0
  const k = fatura.kursiKembimit || 1
  return fatura.rrjeshtat.reduce((shuma, l) => {
    const produkti = l.produktiId
      ? gjendja.produktet.find((p) => p.id === l.produktiId)
      : undefined
    const kostoNjesi = produkti ? produkti.kostoja : l.cmimiNjesi * 0.4
    return shuma + kostoNjesi * l.sasia * k
  }, 0)
}

// ---------------------------------------------------------------------------
// Metrika financiare të agreguara (të gjitha në monedhën bazë = EUR)
// ---------------------------------------------------------------------------
export interface PermbledhjeFinanciare {
  teArdhura: number
  kosto: number
  fitimiBruto: number
  shpenzimeOperative: number
  ebitda: number
  amortizimi: number
  fitimiNeto: number
  teArketueshme: number
  tePagueshme: number
  balancaArkes: number
  balancaBankes: number
  tvshDalese: number
  tvshZbritese: number
  tvshPerPagese: number
  vleraStokut: number
  numriFaturaveTePapaguara: number
  numriFaturaveMbiAfat: number
}

const sot = '2026-06-17'

export function permbledhje(
  gjendja: GjendjaFinanca,
  kompaniaId: string,
  opsionet: { nga?: string; deri?: string } = {},
): PermbledhjeFinanciare {
  const faturat = brendaFushes(gjendja.faturat, kompaniaId).filter((f) => {
    if (f.statusi === 'anuluar') return false
    if (opsionet.nga && f.dataLeshimit < opsionet.nga) return false
    if (opsionet.deri && f.dataLeshimit > opsionet.deri) return false
    return true
  })
  const shitjet = faturat.filter((f) => f.lloji === 'shitje')
  const blerjet = faturat.filter((f) => f.lloji === 'blerje')

  let teArdhura = 0
  let kosto = 0
  let tvshDalese = 0
  let teArketueshme = 0
  let numriFaturaveTePapaguara = 0
  let numriFaturaveMbiAfat = 0
  for (const fatura of shitjet) {
    const t = totaletFatures(gjendja, fatura)
    teArdhura += t.netoBaze
    tvshDalese += t.tvshBaze
    kosto += kostoFatures(gjendja, fatura)
    teArketueshme += t.mberturBaze
    if (t.mbetur > 0) {
      numriFaturaveTePapaguara++
      if (fatura.dataAfatit < sot) numriFaturaveMbiAfat++
    }
  }

  let tvshZbritese = 0
  let tePagueshme = 0
  for (const fatura of blerjet) {
    const t = totaletFatures(gjendja, fatura)
    tvshZbritese += t.tvshBaze
    tePagueshme += t.mberturBaze
  }

  // Shpenzimet operative (vetëm të aprovuara) brenda intervalit
  const shpenzimet = brendaFushes(gjendja.shpenzimet, kompaniaId).filter((sh) => {
    if (sh.statusi !== 'aprovuar') return false
    if (opsionet.nga && sh.data < opsionet.nga) return false
    if (opsionet.deri && sh.data > opsionet.deri) return false
    return true
  })
  let shpenzimeOperative = 0
  for (const sh of shpenzimet) {
    shpenzimeOperative += neBaze(gjendja, sh.shuma, sh.monedha, sh.kursiKembimit)
  }
  // Trajtojmë një pjesë të pajisjeve si amortizim për demonstrimin e P&L-së
  const amortizimi = brendaFushes(gjendja.shpenzimet, kompaniaId)
    .filter((sh) => sh.kategoria === 'pajisje' && sh.statusi === 'aprovuar')
    .reduce((s, sh) => s + neBaze(gjendja, sh.shuma, sh.monedha, sh.kursiKembimit) * 0.2, 0)

  const fitimiBruto = teArdhura - kosto
  const ebitda = fitimiBruto - shpenzimeOperative
  const fitimiNeto = ebitda - amortizimi

  // Balancat e arkës & bankës (fillestare + lëvizjet neto)
  const balancaArkes = totaliArkes(gjendja, kompaniaId)
  const balancaBankes = totaliBankes(gjendja, kompaniaId)

  const vleraStokut = brendaFushes(gjendja.produktet, kompaniaId).reduce(
    (s, p) => s + p.stoku * p.kostoja,
    0,
  )

  return {
    teArdhura,
    kosto,
    fitimiBruto,
    shpenzimeOperative,
    ebitda,
    amortizimi,
    fitimiNeto,
    teArketueshme,
    tePagueshme,
    balancaArkes,
    balancaBankes,
    tvshDalese,
    tvshZbritese,
    tvshPerPagese: tvshDalese - tvshZbritese,
    vleraStokut,
    numriFaturaveTePapaguara,
    numriFaturaveMbiAfat,
  }
}

// ---------------------------------------------------------------------------
// Balancat e arkës / bankës
// ---------------------------------------------------------------------------
export function totaliArkes(gjendja: GjendjaFinanca, kompaniaId: string): number {
  const arkat = brendaFushes(gjendja.arkat, kompaniaId)
  return arkat.reduce((shuma, arka) => shuma + balancaArkes(gjendja, arka.id), 0)
}

export function balancaArkes(gjendja: GjendjaFinanca, arkaId: string): number {
  const arka = gjendja.arkat.find((a) => a.id === arkaId)
  if (!arka) return 0
  let balanca = neBaze(gjendja, arka.balancaFillestare, arka.monedha)
  for (const p of gjendja.pagesat) {
    if (p.arkaId !== arkaId) continue
    const baze = neBaze(gjendja, p.shuma, p.monedha, p.kursiKembimit)
    balanca += p.drejtimi === 'hyrje' ? baze : -baze
  }
  return balanca
}

export function totaliBankes(gjendja: GjendjaFinanca, kompaniaId: string): number {
  const bankat = brendaFushes(gjendja.llogariteBankare, kompaniaId)
  return bankat.reduce((shuma, b) => shuma + balancaLlogarise(gjendja, b.id), 0)
}

export function balancaLlogarise(gjendja: GjendjaFinanca, bankaId: string): number {
  const banka = gjendja.llogariteBankare.find((b) => b.id === bankaId)
  if (!banka) return 0
  let balanca = neBaze(gjendja, banka.balancaFillestare, banka.monedha)
  for (const p of gjendja.pagesat) {
    if (p.llogariaBankareId !== bankaId) continue
    const baze = neBaze(gjendja, p.shuma, p.monedha, p.kursiKembimit)
    balanca += p.drejtimi === 'hyrje' ? baze : -baze
  }
  return balanca
}

// ---------------------------------------------------------------------------
// Seria mujore e të ardhurave / shpenzimeve (për grafikët)
// ---------------------------------------------------------------------------
export interface PikeMujore {
  muaji: string
  teArdhura: number
  shpenzime: number
  fitimi: number
}

export function seriaMujore(
  gjendja: GjendjaFinanca,
  kompaniaId: string,
  viti = '2026',
): PikeMujore[] {
  const muajt = Array.from({ length: 12 }, (_, i) =>
    `${viti}-${String(i + 1).padStart(2, '0')}`,
  )
  const harta = new Map<string, PikeMujore>(
    muajt.map((m) => [m, { muaji: m, teArdhura: 0, shpenzime: 0, fitimi: 0 }]),
  )

  for (const fatura of brendaFushes(gjendja.faturat, kompaniaId)) {
    if (fatura.lloji !== 'shitje' || fatura.statusi === 'anuluar') continue
    const celesi = celesiMuajit(fatura.dataLeshimit)
    const pika = harta.get(celesi)
    if (!pika) continue
    pika.teArdhura += totaletFatures(gjendja, fatura).netoBaze
  }
  for (const sh of brendaFushes(gjendja.shpenzimet, kompaniaId)) {
    if (sh.statusi !== 'aprovuar') continue
    const celesi = celesiMuajit(sh.data)
    const pika = harta.get(celesi)
    if (!pika) continue
    pika.shpenzime += neBaze(gjendja, sh.shuma, sh.monedha, sh.kursiKembimit)
  }
  // Shtojmë COGS-në te shpenzimet për vijën e fitimit
  for (const fatura of brendaFushes(gjendja.faturat, kompaniaId)) {
    if (fatura.lloji !== 'shitje' || fatura.statusi === 'anuluar') continue
    const celesi = celesiMuajit(fatura.dataLeshimit)
    const pika = harta.get(celesi)
    if (!pika) continue
    pika.shpenzime += kostoFatures(gjendja, fatura)
  }
  for (const p of harta.values()) p.fitimi = p.teArdhura - p.shpenzime
  return muajt.map((m) => harta.get(m)!)
}

// ---------------------------------------------------------------------------
// Kartelat e klientit & furnitorit
// ---------------------------------------------------------------------------
export interface KartelaPales {
  faturuar: number
  paguar: number
  balanca: number
  numriFaturave: number
}

export function kartelaKlientit(
  gjendja: GjendjaFinanca,
  klientiId: string,
): KartelaPales {
  const faturat = gjendja.faturat.filter(
    (f) => f.lloji === 'shitje' && f.palaId === klientiId && f.statusi !== 'anuluar',
  )
  let faturuar = 0
  let paguar = 0
  for (const fatura of faturat) {
    const t = totaletFatures(gjendja, fatura)
    faturuar += t.totaliBaze
    paguar += fatura.shumaPaguar * (fatura.kursiKembimit || 1)
  }
  return { faturuar, paguar, balanca: faturuar - paguar, numriFaturave: faturat.length }
}

export function kartelaFurnitorit(
  gjendja: GjendjaFinanca,
  furnitoriId: string,
): KartelaPales {
  const faturat = gjendja.faturat.filter(
    (f) => f.lloji === 'blerje' && f.palaId === furnitoriId && f.statusi !== 'anuluar',
  )
  let faturuar = 0
  let paguar = 0
  for (const fatura of faturat) {
    const t = totaletFatures(gjendja, fatura)
    faturuar += t.totaliBaze
    paguar += fatura.shumaPaguar * (fatura.kursiKembimit || 1)
  }
  return { faturuar, paguar, balanca: faturuar - paguar, numriFaturave: faturat.length }
}

// ---------------------------------------------------------------------------
// Raportet: P&L, Bilanci, Cashflow
// ---------------------------------------------------------------------------
export interface Bilanci {
  // asetet
  banka: number
  arka: number
  teArketueshme: number
  inventar: number
  totaliAseteve: number
  // detyrimet
  tePagueshme: number
  tvshPerPagese: number
  totaliDetyrimeve: number
  // kapitali
  kapitali: number
}

export function bilanci(gjendja: GjendjaFinanca, kompaniaId: string): Bilanci {
  const p = permbledhje(gjendja, kompaniaId)
  const banka = p.balancaBankes
  const arka = p.balancaArkes
  const teArketueshme = p.teArketueshme
  const inventar = p.vleraStokut
  const totaliAseteve = banka + arka + teArketueshme + inventar
  const tePagueshme = p.tePagueshme
  const tvshPerPagese = Math.max(0, p.tvshPerPagese)
  const totaliDetyrimeve = tePagueshme + tvshPerPagese
  const kapitali = totaliAseteve - totaliDetyrimeve
  return {
    banka,
    arka,
    teArketueshme,
    inventar,
    totaliAseteve,
    tePagueshme,
    tvshPerPagese,
    totaliDetyrimeve,
    kapitali,
  }
}

export interface FluksiParase {
  hyrje: number
  dalje: number
  operativ: number
  teArketueshmeTeArdhshme: number
  detyrimeTeArdhshme: number
}

export function fluksiParase(gjendja: GjendjaFinanca, kompaniaId: string): FluksiParase {
  const pagesat = brendaFushes(gjendja.pagesat, kompaniaId)
  let hyrje = 0
  let dalje = 0
  for (const p of pagesat) {
    const baze = neBaze(gjendja, p.shuma, p.monedha, p.kursiKembimit)
    if (p.drejtimi === 'hyrje') hyrje += baze
    else dalje += baze
  }
  const p = permbledhje(gjendja, kompaniaId)
  return {
    hyrje,
    dalje,
    operativ: hyrje - dalje,
    teArketueshmeTeArdhshme: p.teArketueshme,
    detyrimeTeArdhshme: p.tePagueshme,
  }
}

// ---------------------------------------------------------------------------
// Ndihmës që përdoren nga listat e UI-së
// ---------------------------------------------------------------------------
export function emriKompanise(gjendja: GjendjaFinanca, kompaniaId: string): string {
  return gjendja.kompanite.find((k) => k.id === kompaniaId)?.emri ?? kompaniaId
}

export function emriPales(gjendja: GjendjaFinanca, palaId: string): string {
  const klienti = gjendja.klientet.find((x) => x.id === palaId)
  if (klienti) return klienti.emri
  const furnitori = gjendja.furnitoret.find((x) => x.id === palaId)
  if (furnitori) return furnitori.emri
  return palaId
}

export function teFiltruara<T extends { kompaniaId: string }>(
  rreshtat: T[],
  kompaniaId: string,
): T[] {
  return brendaFushes(rreshtat, kompaniaId)
}
