// Tipat e domenit për Sistemin e Menaxhimit Financiar & Kontabël.
// Vlerat monetare ruhen si numra në monedhën e vetë entitetit; vlera në
// monedhën bazë (EUR) nxirret duke përdorur kursin e këmbimit të ruajtur.

export type Monedha = 'EUR' | 'ALL' | 'USD' | 'GBP'

export type LlojiLlogarise =
  | 'aktiv'
  | 'detyrim'
  | 'kapital'
  | 'teArdhura'
  | 'shpenzim'

export type LlojiFatures = 'shitje' | 'blerje'

export type StatusiFatures =
  | 'draft'
  | 'aprovuar'
  | 'paguar'
  | 'pjeserisht'
  | 'anuluar'

export type DrejtimiPageses = 'hyrje' | 'dalje'

export type MenyraPageses = 'cash' | 'banke' | 'karte' | 'transferte'

export type StatusiAprovimit = 'pritje' | 'aprovuar' | 'refuzuar'

export type Roli =
  | 'ceo'
  | 'cfo'
  | 'kontabilist'
  | 'menaxherShitjesh'
  | 'menaxherMagazine'
  | 'menaxherHr'
  | 'menaxherDege'
  | 'punonjes'
  | 'auditues'

export interface Kompania {
  id: string
  emri: string
  nipt: string // NIPT / numri i TVSH-së
  monedhaBaze: Monedha
  shteti: string
  eshteGrup?: boolean // entiteti i konsoliduar i grupit
}

export interface Llogaria {
  id: string
  kodi: string // kodi kontabël, p.sh. "1010"
  emri: string
  lloji: LlojiLlogarise
  prinderId?: string // për nënllogaritë
}

export interface Klienti {
  id: string
  kompaniaId: string
  emri: string
  nipt?: string
  email?: string
  telefoni?: string
  adresa?: string
  limitiKreditit: number // në monedhën bazë
  aktiv: boolean
  shenime?: string
}

export interface Furnitori {
  id: string
  kompaniaId: string
  emri: string
  nipt?: string
  email?: string
  telefoni?: string
  afatiPagesesDite: number
  aktiv: boolean
}

export interface Magazina {
  id: string
  kompaniaId: string
  emri: string
}

export interface Produkti {
  id: string
  kompaniaId: string
  sku: string
  emri: string
  cmimiNjesi: number // çmimi i shitjes në monedhën bazë të kompanisë
  kostoja: number // kosto e plotë (landed cost) në monedhën bazë
  normaTvsh: number // p.sh. 0.2 për 20%
  stoku: number
  magazinaId: string
}

export interface RrjeshtFature {
  id: string
  produktiId?: string
  pershkrimi: string
  sasia: number
  cmimiNjesi: number
  zbritja: number // në fraksion, p.sh. 0.1 = 10%
  normaTvsh: number
}

export interface Fatura {
  id: string
  kompaniaId: string
  lloji: LlojiFatures
  numri: string
  palaId: string // klientiId për shitje, furnitoriId për blerje
  dataLeshimit: string // datë ISO
  dataAfatit: string
  monedha: Monedha
  kursiKembimit: number // shumëzo për të marrë monedhën bazë
  statusi: StatusiFatures
  rrjeshtat: RrjeshtFature[]
  shumaPaguar: number // në monedhën e faturës
  shenime?: string
  // Kosto shtesë për blerjet (transport, doganë, tarifa bankare...)
  kostoShtese?: { etiketa: string; shuma: number }[]
}

export interface Pagesa {
  id: string
  kompaniaId: string
  drejtimi: DrejtimiPageses
  menyra: MenyraPageses
  palaId: string
  faturaId?: string
  shuma: number
  monedha: Monedha
  kursiKembimit: number
  data: string
  referenca?: string
  // ku hyri/doli paraja
  arkaId?: string
  llogariaBankareId?: string
}

export interface Arka {
  id: string
  kompaniaId: string
  emri: string
  monedha: Monedha
  balancaFillestare: number
  pergjegjesi: string
}

export interface LlogariaBankare {
  id: string
  kompaniaId: string
  emri: string
  iban: string
  monedha: Monedha
  balancaFillestare: number
}

export type KategoriaShpenzimit =
  | 'qira'
  | 'rroga'
  | 'marketing'
  | 'transport'
  | 'dogane'
  | 'materiale'
  | 'pajisje'
  | 'mirembajtje'
  | 'trajnime'
  | 'komision'
  | 'udhetim'
  | 'tarifaBankare'
  | 'konsulence'
  | 'tjeter'

export interface Shpenzimi {
  id: string
  kompaniaId: string
  kategoria: KategoriaShpenzimit
  data: string
  pershkrimi: string
  shuma: number
  monedha: Monedha
  kursiKembimit: number
  pergjegjesi: string
  statusi: StatusiAprovimit
  menyraPageses: MenyraPageses
}

export interface ArtikullNoteKrediti {
  pershkrimi: string
  shuma: number
}

// Modelon një kthim nga klienti që mund të shkëmbehet me një produkt tjetër,
// duke regjistruar vetëm diferencën neto për pagesë (sipas shembullit te kërkesat).
export interface NotaKrediti {
  id: string
  kompaniaId: string
  klientiId: string
  faturaOrigjinaleId: string
  data: string
  artikujtKthyer: ArtikullNoteKrediti[]
  artikujtZevendesues: ArtikullNoteKrediti[]
  monedha: Monedha
  shenime?: string
}

export interface ZeriAuditit {
  id: string
  koha: number
  perdoruesi: string
  veprimi: string
  entiteti: string
  para?: string
  pas?: string
  ip: string
  pajisja: string
}

export interface KursetKembimit {
  // vlera e 1 njësie të monedhës në monedhën bazë të sistemit (EUR)
  baza: Monedha
  kurset: Record<Monedha, number>
}
