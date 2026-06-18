import type {
  Llogaria,
  ZeriAuditit,
  LlogariaBankare,
  Arka,
  Kompania,
  NotaKrediti,
  Klienti,
  KursetKembimit,
  Shpenzimi,
  Fatura,
  RrjeshtFature,
  Pagesa,
  Produkti,
  Furnitori,
  Magazina,
} from './types'

// ---------------------------------------------------------------------------
// Kompanitë (strukturë multi-company)
// ---------------------------------------------------------------------------
export const kompanite: Kompania[] = [
  { id: 'grp', emri: 'iClear Group Global', nipt: 'L00000000A', monedhaBaze: 'EUR', shteti: 'Global', eshteGrup: true },
  { id: 'alb', emri: 'iClear Albania', nipt: 'L41511008A', monedhaBaze: 'EUR', shteti: 'Shqipëri' },
  { id: 'idn', emri: 'iDental', nipt: 'L72318044K', monedhaBaze: 'EUR', shteti: 'Shqipëri' },
  { id: 'den', emri: 'Dentis', nipt: 'L91402015M', monedhaBaze: 'EUR', shteti: 'Shqipëri' },
  { id: 'kos', emri: 'iClear Kosovo', nipt: '811234567', monedhaBaze: 'EUR', shteti: 'Kosovë' },
  { id: 'ita', emri: 'iClear Italy', nipt: 'IT09876543210', monedhaBaze: 'EUR', shteti: 'Itali' },
]

export const idteKompaniveOperative = kompanite.filter((k) => !k.eshteGrup).map((k) => k.id)

// ---------------------------------------------------------------------------
// Kurset e këmbimit (1 njësi monedhe = X EUR)
// ---------------------------------------------------------------------------
export const kursetKembimit: KursetKembimit = {
  baza: 'EUR',
  kurset: { EUR: 1, ALL: 0.0101, USD: 0.92, GBP: 1.17 },
}

// ---------------------------------------------------------------------------
// Plani kontabël (i përbashkët për grupin)
// ---------------------------------------------------------------------------
export const llogarite: Llogaria[] = [
  // Asete
  { id: 'a-1', kodi: '1000', emri: 'Asete', lloji: 'aktiv' },
  { id: 'a-bank', kodi: '1010', emri: 'Banka', lloji: 'aktiv', prinderId: 'a-1' },
  { id: 'a-cash', kodi: '1020', emri: 'Arka', lloji: 'aktiv', prinderId: 'a-1' },
  { id: 'a-recv', kodi: '1030', emri: 'Klientë (të arkëtueshme)', lloji: 'aktiv', prinderId: 'a-1' },
  { id: 'a-inv', kodi: '1040', emri: 'Inventar', lloji: 'aktiv', prinderId: 'a-1' },
  { id: 'a-vat-in', kodi: '1050', emri: 'TVSH e zbritshme', lloji: 'aktiv', prinderId: 'a-1' },
  { id: 'a-fixed', kodi: '1500', emri: 'Asete afatgjata', lloji: 'aktiv', prinderId: 'a-1' },
  // Detyrime
  { id: 'l-1', kodi: '2000', emri: 'Detyrime', lloji: 'detyrim' },
  { id: 'l-pay', kodi: '2010', emri: 'Furnitorë (të pagueshme)', lloji: 'detyrim', prinderId: 'l-1' },
  { id: 'l-vat-out', kodi: '2020', emri: 'TVSH për pagesë', lloji: 'detyrim', prinderId: 'l-1' },
  { id: 'l-tax', kodi: '2030', emri: 'Detyrime tatimore', lloji: 'detyrim', prinderId: 'l-1' },
  { id: 'l-payroll', kodi: '2040', emri: 'Detyrime page', lloji: 'detyrim', prinderId: 'l-1' },
  { id: 'l-loan', kodi: '2500', emri: 'Kredi', lloji: 'detyrim', prinderId: 'l-1' },
  // Kapital
  { id: 'e-1', kodi: '3000', emri: 'Kapital', lloji: 'kapital' },
  { id: 'e-retained', kodi: '3010', emri: 'Fitime të pashpërndara', lloji: 'kapital', prinderId: 'e-1' },
  // Të ardhura
  { id: 'i-1', kodi: '4000', emri: 'Të ardhura', lloji: 'teArdhura' },
  { id: 'i-sales', kodi: '4010', emri: 'Të ardhura nga shitjet', lloji: 'teArdhura', prinderId: 'i-1' },
  { id: 'i-services', kodi: '4020', emri: 'Të ardhura nga shërbimet', lloji: 'teArdhura', prinderId: 'i-1' },
  // Shpenzime
  { id: 'x-1', kodi: '5000', emri: 'Shpenzime', lloji: 'shpenzim' },
  { id: 'x-cogs', kodi: '5010', emri: 'Kosto e mallrave të shitura', lloji: 'shpenzim', prinderId: 'x-1' },
  { id: 'x-rent', kodi: '5020', emri: 'Qira', lloji: 'shpenzim', prinderId: 'x-1' },
  { id: 'x-salary', kodi: '5030', emri: 'Paga', lloji: 'shpenzim', prinderId: 'x-1' },
  { id: 'x-marketing', kodi: '5040', emri: 'Marketing', lloji: 'shpenzim', prinderId: 'x-1' },
  { id: 'x-depr', kodi: '5050', emri: 'Amortizim', lloji: 'shpenzim', prinderId: 'x-1' },
  { id: 'x-other', kodi: '5090', emri: 'Shpenzime të tjera', lloji: 'shpenzim', prinderId: 'x-1' },
]

// ---------------------------------------------------------------------------
// Magazinat
// ---------------------------------------------------------------------------
export const magazinat: Magazina[] = [
  { id: 'wh-alb', kompaniaId: 'alb', emri: 'Magazina Tiranë' },
  { id: 'wh-idn', kompaniaId: 'idn', emri: 'Magazina iDental' },
  { id: 'wh-den', kompaniaId: 'den', emri: 'Magazina Dentis' },
  { id: 'wh-kos', kompaniaId: 'kos', emri: 'Magazina Prishtinë' },
  { id: 'wh-ita', kompaniaId: 'ita', emri: 'Magazzino Milano' },
]

// ---------------------------------------------------------------------------
// Produktet
// ---------------------------------------------------------------------------
export const produktet: Produkti[] = [
  { id: 'p-1', kompaniaId: 'alb', sku: 'ALN-01', emri: 'Aligner Set (Standard)', cmimiNjesi: 1200, kostoja: 480, normaTvsh: 0.2, stoku: 64, magazinaId: 'wh-alb' },
  { id: 'p-2', kompaniaId: 'alb', sku: 'ALN-02', emri: 'Aligner Set (Premium)', cmimiNjesi: 2250, kostoja: 900, normaTvsh: 0.2, stoku: 31, magazinaId: 'wh-alb' },
  { id: 'p-3', kompaniaId: 'alb', sku: 'RET-01', emri: 'Retainer', cmimiNjesi: 250, kostoja: 95, normaTvsh: 0.2, stoku: 120, magazinaId: 'wh-alb' },
  { id: 'p-4', kompaniaId: 'alb', sku: 'RET-02', emri: 'Retainer Pro', cmimiNjesi: 300, kostoja: 120, normaTvsh: 0.2, stoku: 88, magazinaId: 'wh-alb' },
  { id: 'p-5', kompaniaId: 'idn', sku: 'IMP-01', emri: 'Dental Implant', cmimiNjesi: 650, kostoja: 260, normaTvsh: 0.2, stoku: 210, magazinaId: 'wh-idn' },
  { id: 'p-6', kompaniaId: 'idn', sku: 'CRN-01', emri: 'Zirconia Crown', cmimiNjesi: 320, kostoja: 110, normaTvsh: 0.2, stoku: 175, magazinaId: 'wh-idn' },
  { id: 'p-7', kompaniaId: 'den', sku: 'SCN-01', emri: 'Intraoral Scanner Service', cmimiNjesi: 90, kostoja: 20, normaTvsh: 0.2, stoku: 999, magazinaId: 'wh-den' },
  { id: 'p-8', kompaniaId: 'kos', sku: 'ALN-01', emri: 'Aligner Set (Standard)', cmimiNjesi: 1150, kostoja: 470, normaTvsh: 0.18, stoku: 40, magazinaId: 'wh-kos' },
  { id: 'p-9', kompaniaId: 'ita', sku: 'ALN-IT', emri: 'Aligner Set (IT)', cmimiNjesi: 1450, kostoja: 540, normaTvsh: 0.22, stoku: 52, magazinaId: 'wh-ita' },
]

// ---------------------------------------------------------------------------
// Klientët
// ---------------------------------------------------------------------------
export const klientet: Klienti[] = [
  { id: 'c-1', kompaniaId: 'alb', emri: 'Klinika Dentare Bardhi', nipt: 'K81234567L', email: 'info@bardhi.al', telefoni: '+355 69 200 1001', limitiKreditit: 10000, aktiv: true },
  { id: 'c-2', kompaniaId: 'alb', emri: 'Smile Center Tirana', nipt: 'L52345678M', email: 'office@smilecenter.al', telefoni: '+355 69 200 1002', limitiKreditit: 15000, aktiv: true },
  { id: 'c-3', kompaniaId: 'alb', emri: 'Klient Privat - A. Hoxha', email: 'a.hoxha@email.com', telefoni: '+355 69 200 1003', limitiKreditit: 3000, aktiv: true },
  { id: 'c-4', kompaniaId: 'idn', emri: 'Dental Care Durrës', nipt: 'L63456789N', email: 'contact@dentalcare.al', telefoni: '+355 69 200 1004', limitiKreditit: 8000, aktiv: true },
  { id: 'c-5', kompaniaId: 'idn', emri: 'OrthoLab Vlorë', nipt: 'L74567890O', email: 'lab@ortholab.al', telefoni: '+355 69 200 1005', limitiKreditit: 12000, aktiv: true },
  { id: 'c-6', kompaniaId: 'kos', emri: 'Dentokos Prishtinë', nipt: '600123456', email: 'info@dentokos.com', telefoni: '+383 44 100 200', limitiKreditit: 9000, aktiv: true },
  { id: 'c-7', kompaniaId: 'ita', emri: 'Studio Dentistico Rossi', nipt: 'IT01122334455', email: 'rossi@studio.it', telefoni: '+39 02 1234567', limitiKreditit: 20000, aktiv: true },
]

// ---------------------------------------------------------------------------
// Furnitorët
// ---------------------------------------------------------------------------
export const furnitoret: Furnitori[] = [
  { id: 's-1', kompaniaId: 'alb', emri: 'Align Materials GmbH', nipt: 'DE811112223', email: 'sales@alignmat.de', afatiPagesesDite: 30, aktiv: true },
  { id: 's-2', kompaniaId: 'alb', emri: 'MedSupply Albania', nipt: 'L33445566P', email: 'orders@medsupply.al', afatiPagesesDite: 15, aktiv: true },
  { id: 's-3', kompaniaId: 'idn', emri: 'Implant Tech Italia', nipt: 'IT05566778899', email: 'info@implanttech.it', afatiPagesesDite: 45, aktiv: true },
  { id: 's-4', kompaniaId: 'kos', emri: 'Balkan Dental Trade', nipt: '700987654', email: 'sales@bdt.com', afatiPagesesDite: 30, aktiv: true },
  { id: 's-5', kompaniaId: 'ita', emri: 'Milano Lab Supplies', nipt: 'IT099887766', email: 'ordini@milanolab.it', afatiPagesesDite: 30, aktiv: true },
]

// ---------------------------------------------------------------------------
// Arkat & llogaritë bankare
// ---------------------------------------------------------------------------
export const arkat: Arka[] = [
  { id: 'cr-clinic', kompaniaId: 'alb', emri: 'Arkë Klinikë', monedha: 'EUR', balancaFillestare: 1500, pergjegjesi: 'Erjon Meta' },
  { id: 'cr-lab', kompaniaId: 'alb', emri: 'Arkë Laborator', monedha: 'EUR', balancaFillestare: 800, pergjegjesi: 'Ana Leka' },
  { id: 'cr-show', kompaniaId: 'idn', emri: 'Arkë Showroom', monedha: 'EUR', balancaFillestare: 1200, pergjegjesi: 'Klara Bega' },
  { id: 'cr-main', kompaniaId: 'kos', emri: 'Arkë Kryesore', monedha: 'EUR', balancaFillestare: 2000, pergjegjesi: 'Driton Krasniqi' },
]

export const llogariteBankare: LlogariaBankare[] = [
  { id: 'bk-alb-eur', kompaniaId: 'alb', emri: 'BKT — EUR', iban: 'AL47212110090000000235698741', monedha: 'EUR', balancaFillestare: 85000 },
  { id: 'bk-alb-all', kompaniaId: 'alb', emri: 'Raiffeisen — ALL', iban: 'AL35202111090000000001234567', monedha: 'ALL', balancaFillestare: 4200000 },
  { id: 'bk-idn-eur', kompaniaId: 'idn', emri: 'Credins — EUR', iban: 'AL90208110080000000999888777', monedha: 'EUR', balancaFillestare: 42000 },
  { id: 'bk-kos-eur', kompaniaId: 'kos', emri: 'ProCredit — EUR', iban: 'XK051000000000000001', monedha: 'EUR', balancaFillestare: 31000 },
  { id: 'bk-ita-eur', kompaniaId: 'ita', emri: 'Intesa — EUR', iban: 'IT60X0542811101000000123456', monedha: 'EUR', balancaFillestare: 67000 },
]

// ---------------------------------------------------------------------------
// Ndihmës për krijimin e rrjeshtave të faturës
// ---------------------------------------------------------------------------
function rrjesht(
  id: string,
  pershkrimi: string,
  sasia: number,
  cmimiNjesi: number,
  normaTvsh = 0.2,
  zbritja = 0,
  produktiId?: string,
): RrjeshtFature {
  return { id, pershkrimi, sasia, cmimiNjesi, zbritja, normaTvsh, produktiId }
}

// ---------------------------------------------------------------------------
// Faturat e shitjes & blerjes
// ---------------------------------------------------------------------------
export const faturat: Fatura[] = [
  // --- Shitje iClear Albania ---
  {
    id: 'inv-1', kompaniaId: 'alb', lloji: 'shitje', numri: 'SI-2026-0001', palaId: 'c-1',
    dataLeshimit: '2026-01-12', dataAfatit: '2026-02-11', monedha: 'EUR', kursiKembimit: 1,
    statusi: 'paguar', shumaPaguar: 2880,
    rrjeshtat: [rrjesht('l1', 'Aligner Set (Standard)', 2, 1200, 0.2, 0, 'p-1')],
  },
  {
    id: 'inv-2', kompaniaId: 'alb', lloji: 'shitje', numri: 'SI-2026-0002', palaId: 'c-2',
    dataLeshimit: '2026-02-03', dataAfatit: '2026-03-05', monedha: 'EUR', kursiKembimit: 1,
    statusi: 'paguar', shumaPaguar: 2700,
    rrjeshtat: [rrjesht('l1', 'Aligner Set (Premium)', 1, 2250, 0.2, 0, 'p-2')],
  },
  {
    id: 'inv-3', kompaniaId: 'alb', lloji: 'shitje', numri: 'SI-2026-0003', palaId: 'c-3',
    dataLeshimit: '2026-03-18', dataAfatit: '2026-04-17', monedha: 'EUR', kursiKembimit: 1,
    statusi: 'pjeserisht', shumaPaguar: 1000,
    // Kjo është fatura që i referohet shembulli i kthimit/note krediti (set Premium 2250 €)
    rrjeshtat: [rrjesht('l1', 'Aligner Set (Premium)', 1, 2250, 0.2, 0, 'p-2')],
  },
  {
    id: 'inv-4', kompaniaId: 'alb', lloji: 'shitje', numri: 'SI-2026-0004', palaId: 'c-2',
    dataLeshimit: '2026-04-22', dataAfatit: '2026-05-22', monedha: 'EUR', kursiKembimit: 1,
    statusi: 'aprovuar', shumaPaguar: 0,
    rrjeshtat: [
      rrjesht('l1', 'Retainer', 4, 250, 0.2, 0.1, 'p-3'),
      rrjesht('l2', 'Retainer Pro', 2, 300, 0.2, 0, 'p-4'),
    ],
  },
  {
    id: 'inv-5', kompaniaId: 'alb', lloji: 'shitje', numri: 'SI-2026-0005', palaId: 'c-1',
    dataLeshimit: '2026-05-09', dataAfatit: '2026-05-19', monedha: 'EUR', kursiKembimit: 1,
    statusi: 'pjeserisht', shumaPaguar: 1200,
    rrjeshtat: [rrjesht('l1', 'Aligner Set (Standard)', 2, 1200, 0.2, 0, 'p-1')],
  },
  {
    id: 'inv-6', kompaniaId: 'alb', lloji: 'shitje', numri: 'SI-2026-0006', palaId: 'c-3',
    dataLeshimit: '2026-05-28', dataAfatit: '2026-06-27', monedha: 'EUR', kursiKembimit: 1,
    statusi: 'aprovuar', shumaPaguar: 0,
    rrjeshtat: [rrjesht('l1', 'Retainer Pro', 3, 300, 0.2, 0, 'p-4')],
  },
  // --- Shitje iDental ---
  {
    id: 'inv-7', kompaniaId: 'idn', lloji: 'shitje', numri: 'SI-2026-0101', palaId: 'c-4',
    dataLeshimit: '2026-02-14', dataAfatit: '2026-03-16', monedha: 'EUR', kursiKembimit: 1,
    statusi: 'paguar', shumaPaguar: 7800,
    rrjeshtat: [rrjesht('l1', 'Dental Implant', 10, 650, 0.2, 0, 'p-5')],
  },
  {
    id: 'inv-8', kompaniaId: 'idn', lloji: 'shitje', numri: 'SI-2026-0102', palaId: 'c-5',
    dataLeshimit: '2026-04-05', dataAfatit: '2026-05-05', monedha: 'EUR', kursiKembimit: 1,
    statusi: 'pjeserisht', shumaPaguar: 2000,
    rrjeshtat: [rrjesht('l1', 'Zirconia Crown', 15, 320, 0.2, 0.05, 'p-6')],
  },
  {
    id: 'inv-9', kompaniaId: 'idn', lloji: 'shitje', numri: 'SI-2026-0103', palaId: 'c-4',
    dataLeshimit: '2026-06-02', dataAfatit: '2026-07-02', monedha: 'EUR', kursiKembimit: 1,
    statusi: 'aprovuar', shumaPaguar: 0,
    rrjeshtat: [rrjesht('l1', 'Dental Implant', 6, 650, 0.2, 0, 'p-5')],
  },
  // --- Shitje iClear Kosovo (shembull USD) ---
  {
    id: 'inv-10', kompaniaId: 'kos', lloji: 'shitje', numri: 'SI-2026-0201', palaId: 'c-6',
    dataLeshimit: '2026-03-21', dataAfatit: '2026-04-20', monedha: 'USD', kursiKembimit: 0.92,
    statusi: 'paguar', shumaPaguar: 6785,
    rrjeshtat: [rrjesht('l1', 'Aligner Set (Standard)', 5, 1150, 0.18, 0, 'p-8')],
  },
  // --- Shitje iClear Italy ---
  {
    id: 'inv-11', kompaniaId: 'ita', lloji: 'shitje', numri: 'SI-2026-0301', palaId: 'c-7',
    dataLeshimit: '2026-05-15', dataAfatit: '2026-06-14', monedha: 'EUR', kursiKembimit: 1,
    statusi: 'pjeserisht', shumaPaguar: 5000,
    rrjeshtat: [rrjesht('l1', 'Aligner Set (IT)', 8, 1450, 0.22, 0, 'p-9')],
  },

  // --- Fatura blerjeje ---
  {
    id: 'pinv-1', kompaniaId: 'alb', lloji: 'blerje', numri: 'PI-2026-0001', palaId: 's-1',
    dataLeshimit: '2026-01-08', dataAfatit: '2026-02-07', monedha: 'EUR', kursiKembimit: 1,
    statusi: 'paguar', shumaPaguar: 17280,
    rrjeshtat: [rrjesht('l1', 'Aligner blanks (carton)', 30, 480, 0.2, 0, 'p-1')],
    kostoShtese: [
      { etiketa: 'Transport', shuma: 600 },
      { etiketa: 'Doganë', shuma: 850 },
    ],
  },
  {
    id: 'pinv-2', kompaniaId: 'alb', lloji: 'blerje', numri: 'PI-2026-0002', palaId: 's-2',
    dataLeshimit: '2026-03-11', dataAfatit: '2026-03-26', monedha: 'EUR', kursiKembimit: 1,
    statusi: 'pjeserisht', shumaPaguar: 2000,
    rrjeshtat: [rrjesht('l1', 'Retainer material', 100, 95, 0.2, 0, 'p-3')],
  },
  {
    id: 'pinv-3', kompaniaId: 'idn', lloji: 'blerje', numri: 'PI-2026-0101', palaId: 's-3',
    dataLeshimit: '2026-02-19', dataAfatit: '2026-04-04', monedha: 'EUR', kursiKembimit: 1,
    statusi: 'aprovuar', shumaPaguar: 0,
    rrjeshtat: [rrjesht('l1', 'Implant kits', 80, 260, 0.2, 0, 'p-5')],
    kostoShtese: [{ etiketa: 'Transport', shuma: 420 }],
  },
  {
    id: 'pinv-4', kompaniaId: 'kos', lloji: 'blerje', numri: 'PI-2026-0201', palaId: 's-4',
    dataLeshimit: '2026-04-02', dataAfatit: '2026-05-02', monedha: 'EUR', kursiKembimit: 1,
    statusi: 'aprovuar', shumaPaguar: 0,
    rrjeshtat: [rrjesht('l1', 'Aligner blanks', 20, 470, 0.18, 0, 'p-8')],
  },
]

// ---------------------------------------------------------------------------
// Pagesat (të lidhura me faturat)
// ---------------------------------------------------------------------------
export const pagesat: Pagesa[] = [
  { id: 'pay-1', kompaniaId: 'alb', drejtimi: 'hyrje', menyra: 'banke', palaId: 'c-1', faturaId: 'inv-1', shuma: 2880, monedha: 'EUR', kursiKembimit: 1, data: '2026-02-10', llogariaBankareId: 'bk-alb-eur', referenca: 'Pagesë faturë SI-2026-0001' },
  { id: 'pay-2', kompaniaId: 'alb', drejtimi: 'hyrje', menyra: 'banke', palaId: 'c-2', faturaId: 'inv-2', shuma: 2700, monedha: 'EUR', kursiKembimit: 1, data: '2026-03-01', llogariaBankareId: 'bk-alb-eur' },
  { id: 'pay-3', kompaniaId: 'alb', drejtimi: 'hyrje', menyra: 'cash', palaId: 'c-3', faturaId: 'inv-3', shuma: 1000, monedha: 'EUR', kursiKembimit: 1, data: '2026-03-20', arkaId: 'cr-clinic' },
  { id: 'pay-4', kompaniaId: 'alb', drejtimi: 'hyrje', menyra: 'cash', palaId: 'c-1', faturaId: 'inv-5', shuma: 1200, monedha: 'EUR', kursiKembimit: 1, data: '2026-05-12', arkaId: 'cr-clinic' },
  { id: 'pay-5', kompaniaId: 'idn', drejtimi: 'hyrje', menyra: 'banke', palaId: 'c-4', faturaId: 'inv-7', shuma: 7800, monedha: 'EUR', kursiKembimit: 1, data: '2026-03-10', llogariaBankareId: 'bk-idn-eur' },
  { id: 'pay-6', kompaniaId: 'idn', drejtimi: 'hyrje', menyra: 'banke', palaId: 'c-5', faturaId: 'inv-8', shuma: 2000, monedha: 'EUR', kursiKembimit: 1, data: '2026-04-20', llogariaBankareId: 'bk-idn-eur' },
  { id: 'pay-7', kompaniaId: 'kos', drejtimi: 'hyrje', menyra: 'transferte', palaId: 'c-6', faturaId: 'inv-10', shuma: 6785, monedha: 'USD', kursiKembimit: 0.92, data: '2026-04-18', llogariaBankareId: 'bk-kos-eur' },
  { id: 'pay-8', kompaniaId: 'ita', drejtimi: 'hyrje', menyra: 'banke', palaId: 'c-7', faturaId: 'inv-11', shuma: 5000, monedha: 'EUR', kursiKembimit: 1, data: '2026-06-01', llogariaBankareId: 'bk-ita-eur' },
  // pagesa dalëse te furnitorët
  { id: 'pay-9', kompaniaId: 'alb', drejtimi: 'dalje', menyra: 'banke', palaId: 's-1', faturaId: 'pinv-1', shuma: 17280, monedha: 'EUR', kursiKembimit: 1, data: '2026-02-05', llogariaBankareId: 'bk-alb-eur' },
  { id: 'pay-10', kompaniaId: 'alb', drejtimi: 'dalje', menyra: 'banke', palaId: 's-2', faturaId: 'pinv-2', shuma: 2000, monedha: 'EUR', kursiKembimit: 1, data: '2026-03-20', llogariaBankareId: 'bk-alb-eur' },
]

// ---------------------------------------------------------------------------
// Shpenzimet
// ---------------------------------------------------------------------------
export const shpenzimet: Shpenzimi[] = [
  { id: 'ex-1', kompaniaId: 'alb', kategoria: 'qira', data: '2026-01-05', pershkrimi: 'Qira zyra Tiranë (Janar)', shuma: 1800, monedha: 'EUR', kursiKembimit: 1, pergjegjesi: 'Erjon Meta', statusi: 'aprovuar', menyraPageses: 'banke' },
  { id: 'ex-2', kompaniaId: 'alb', kategoria: 'qira', data: '2026-02-05', pershkrimi: 'Qira zyra Tiranë (Shkurt)', shuma: 1800, monedha: 'EUR', kursiKembimit: 1, pergjegjesi: 'Erjon Meta', statusi: 'aprovuar', menyraPageses: 'banke' },
  { id: 'ex-3', kompaniaId: 'alb', kategoria: 'marketing', data: '2026-02-18', pershkrimi: 'Fushatë Google Ads', shuma: 950, monedha: 'EUR', kursiKembimit: 1, pergjegjesi: 'Ana Leka', statusi: 'aprovuar', menyraPageses: 'karte' },
  { id: 'ex-4', kompaniaId: 'alb', kategoria: 'rroga', data: '2026-03-31', pershkrimi: 'Paga Mars (neto)', shuma: 12500, monedha: 'EUR', kursiKembimit: 1, pergjegjesi: 'HR', statusi: 'aprovuar', menyraPageses: 'banke' },
  { id: 'ex-5', kompaniaId: 'alb', kategoria: 'transport', data: '2026-04-09', pershkrimi: 'Transport ndërkombëtar', shuma: 640, monedha: 'EUR', kursiKembimit: 1, pergjegjesi: 'Erjon Meta', statusi: 'pritje', menyraPageses: 'banke' },
  { id: 'ex-6', kompaniaId: 'idn', kategoria: 'qira', data: '2026-03-05', pershkrimi: 'Qira klinikë Durrës', shuma: 1100, monedha: 'EUR', kursiKembimit: 1, pergjegjesi: 'Klara Bega', statusi: 'aprovuar', menyraPageses: 'banke' },
  { id: 'ex-7', kompaniaId: 'idn', kategoria: 'pajisje', data: '2026-05-22', pershkrimi: 'Skaner intraoral i ri', shuma: 8200, monedha: 'EUR', kursiKembimit: 1, pergjegjesi: 'Klara Bega', statusi: 'pritje', menyraPageses: 'banke' },
  { id: 'ex-8', kompaniaId: 'kos', kategoria: 'marketing', data: '2026-04-14', pershkrimi: 'Reklamë Instagram', shuma: 500, monedha: 'EUR', kursiKembimit: 1, pergjegjesi: 'Driton Krasniqi', statusi: 'aprovuar', menyraPageses: 'karte' },
  { id: 'ex-9', kompaniaId: 'ita', kategoria: 'konsulence', data: '2026-05-30', pershkrimi: 'Consulenza fiscale', shuma: 1500, monedha: 'EUR', kursiKembimit: 1, pergjegjesi: 'M. Bianchi', statusi: 'aprovuar', menyraPageses: 'banke' },
  { id: 'ex-10', kompaniaId: 'alb', kategoria: 'tarifaBankare', data: '2026-06-01', pershkrimi: 'Tarifa bankare tremujore', shuma: 120, monedha: 'EUR', kursiKembimit: 1, pergjegjesi: 'Financa', statusi: 'aprovuar', menyraPageses: 'banke' },
]

// ---------------------------------------------------------------------------
// Nota krediti / kthim (përputhet me shembullin te kërkesat)
//   Faturë origjinale: 2250 €  | Kthyer: 250 €  | I ri: 300 €  | Neto për pagesë: 50 €
// ---------------------------------------------------------------------------
export const notatKrediti: NotaKrediti[] = [
  {
    id: 'cn-1', kompaniaId: 'alb', klientiId: 'c-3', faturaOrigjinaleId: 'inv-3',
    data: '2026-06-10', monedha: 'EUR',
    artikujtKthyer: [{ pershkrimi: 'Retainer (i kthyer)', shuma: 250 }],
    artikujtZevendesues: [{ pershkrimi: 'Retainer Pro (zëvendësim)', shuma: 300 }],
    shenime: 'Klienti ktheu Retainer 250 € dhe mori Retainer Pro 300 €. Diferenca për pagesë: 50 €.',
  },
]

// ---------------------------------------------------------------------------
// Regjistri i auditit (vetëm lexim)
// ---------------------------------------------------------------------------
export const regjistriAuditit: ZeriAuditit[] = [
  { id: 'au-1', koha: Date.parse('2026-06-10T09:14:00Z'), perdoruesi: 'erjon.meta', veprimi: 'krijim', entiteti: 'NotaKrediti cn-1', pas: 'neto 50 €', ip: '85.158.12.4', pajisja: 'Chrome / macOS' },
  { id: 'au-2', koha: Date.parse('2026-06-01T11:02:00Z'), perdoruesi: 'financa', veprimi: 'aprovim', entiteti: 'Pagesa pay-8', pas: '5000 €', ip: '95.110.4.21', pajisja: 'Safari / iOS' },
  { id: 'au-3', koha: Date.parse('2026-05-22T15:40:00Z'), perdoruesi: 'klara.bega', veprimi: 'krijim', entiteti: 'Shpenzimi ex-7', para: '—', pas: '8200 € (në pritje)', ip: '188.44.9.2', pajisja: 'Edge / Windows' },
]
