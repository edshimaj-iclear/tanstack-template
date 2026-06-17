import type {
  Account,
  AuditEntry,
  BankAccount,
  CashRegister,
  Company,
  CreditNote,
  Customer,
  ExchangeRates,
  Expense,
  Invoice,
  InvoiceLine,
  Payment,
  Product,
  Supplier,
  Warehouse,
} from './types'

// ---------------------------------------------------------------------------
// Companies (multi-company group)
// ---------------------------------------------------------------------------
export const companies: Company[] = [
  { id: 'grp', name: 'iClear Group Global', nipt: 'L00000000A', baseCurrency: 'EUR', country: 'Global', isGroup: true },
  { id: 'alb', name: 'iClear Albania', nipt: 'L41511008A', baseCurrency: 'EUR', country: 'Albania' },
  { id: 'idn', name: 'iDental', nipt: 'L72318044K', baseCurrency: 'EUR', country: 'Albania' },
  { id: 'den', name: 'Dentis', nipt: 'L91402015M', baseCurrency: 'EUR', country: 'Albania' },
  { id: 'kos', name: 'iClear Kosovo', nipt: '811234567', baseCurrency: 'EUR', country: 'Kosovo' },
  { id: 'ita', name: 'iClear Italy', nipt: 'IT09876543210', baseCurrency: 'EUR', country: 'Italy' },
]

export const operatingCompanyIds = companies.filter((c) => !c.isGroup).map((c) => c.id)

// ---------------------------------------------------------------------------
// Exchange rates (1 unit of currency = X EUR)
// ---------------------------------------------------------------------------
export const exchangeRates: ExchangeRates = {
  base: 'EUR',
  rates: { EUR: 1, ALL: 0.0101, USD: 0.92, GBP: 1.17 },
}

// ---------------------------------------------------------------------------
// Chart of accounts (shared across the group)
// ---------------------------------------------------------------------------
export const accounts: Account[] = [
  // Assets
  { id: 'a-1', code: '1000', name: 'Asete', type: 'asset' },
  { id: 'a-bank', code: '1010', name: 'Banka', type: 'asset', parentId: 'a-1' },
  { id: 'a-cash', code: '1020', name: 'Arka', type: 'asset', parentId: 'a-1' },
  { id: 'a-recv', code: '1030', name: 'Klientë (të arkëtueshme)', type: 'asset', parentId: 'a-1' },
  { id: 'a-inv', code: '1040', name: 'Inventar', type: 'asset', parentId: 'a-1' },
  { id: 'a-vat-in', code: '1050', name: 'TVSH e zbritshme', type: 'asset', parentId: 'a-1' },
  { id: 'a-fixed', code: '1500', name: 'Asete afatgjata', type: 'asset', parentId: 'a-1' },
  // Liabilities
  { id: 'l-1', code: '2000', name: 'Detyrime', type: 'liability' },
  { id: 'l-pay', code: '2010', name: 'Furnitorë (të pagueshme)', type: 'liability', parentId: 'l-1' },
  { id: 'l-vat-out', code: '2020', name: 'TVSH për pagesë', type: 'liability', parentId: 'l-1' },
  { id: 'l-tax', code: '2030', name: 'Detyrime tatimore', type: 'liability', parentId: 'l-1' },
  { id: 'l-payroll', code: '2040', name: 'Detyrime page', type: 'liability', parentId: 'l-1' },
  { id: 'l-loan', code: '2500', name: 'Kredi', type: 'liability', parentId: 'l-1' },
  // Equity
  { id: 'e-1', code: '3000', name: 'Kapital', type: 'equity' },
  { id: 'e-retained', code: '3010', name: 'Fitime të pashpërndara', type: 'equity', parentId: 'e-1' },
  // Income
  { id: 'i-1', code: '4000', name: 'Të ardhura', type: 'income' },
  { id: 'i-sales', code: '4010', name: 'Të ardhura nga shitjet', type: 'income', parentId: 'i-1' },
  { id: 'i-services', code: '4020', name: 'Të ardhura nga shërbimet', type: 'income', parentId: 'i-1' },
  // Expenses
  { id: 'x-1', code: '5000', name: 'Shpenzime', type: 'expense' },
  { id: 'x-cogs', code: '5010', name: 'Kosto e mallrave të shitura', type: 'expense', parentId: 'x-1' },
  { id: 'x-rent', code: '5020', name: 'Qira', type: 'expense', parentId: 'x-1' },
  { id: 'x-salary', code: '5030', name: 'Paga', type: 'expense', parentId: 'x-1' },
  { id: 'x-marketing', code: '5040', name: 'Marketing', type: 'expense', parentId: 'x-1' },
  { id: 'x-depr', code: '5050', name: 'Amortizim', type: 'expense', parentId: 'x-1' },
  { id: 'x-other', code: '5090', name: 'Shpenzime të tjera', type: 'expense', parentId: 'x-1' },
]

// ---------------------------------------------------------------------------
// Warehouses
// ---------------------------------------------------------------------------
export const warehouses: Warehouse[] = [
  { id: 'wh-alb', companyId: 'alb', name: 'Magazina Tiranë' },
  { id: 'wh-idn', companyId: 'idn', name: 'Magazina iDental' },
  { id: 'wh-den', companyId: 'den', name: 'Magazina Dentis' },
  { id: 'wh-kos', companyId: 'kos', name: 'Magazina Prishtinë' },
  { id: 'wh-ita', companyId: 'ita', name: 'Magazzino Milano' },
]

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export const products: Product[] = [
  { id: 'p-1', companyId: 'alb', sku: 'ALN-01', name: 'Aligner Set (Standard)', unitPrice: 1200, cost: 480, vatRate: 0.2, stock: 64, warehouseId: 'wh-alb' },
  { id: 'p-2', companyId: 'alb', sku: 'ALN-02', name: 'Aligner Set (Premium)', unitPrice: 2250, cost: 900, vatRate: 0.2, stock: 31, warehouseId: 'wh-alb' },
  { id: 'p-3', companyId: 'alb', sku: 'RET-01', name: 'Retainer', unitPrice: 250, cost: 95, vatRate: 0.2, stock: 120, warehouseId: 'wh-alb' },
  { id: 'p-4', companyId: 'alb', sku: 'RET-02', name: 'Retainer Pro', unitPrice: 300, cost: 120, vatRate: 0.2, stock: 88, warehouseId: 'wh-alb' },
  { id: 'p-5', companyId: 'idn', sku: 'IMP-01', name: 'Dental Implant', unitPrice: 650, cost: 260, vatRate: 0.2, stock: 210, warehouseId: 'wh-idn' },
  { id: 'p-6', companyId: 'idn', sku: 'CRN-01', name: 'Zirconia Crown', unitPrice: 320, cost: 110, vatRate: 0.2, stock: 175, warehouseId: 'wh-idn' },
  { id: 'p-7', companyId: 'den', sku: 'SCN-01', name: 'Intraoral Scanner Service', unitPrice: 90, cost: 20, vatRate: 0.2, stock: 999, warehouseId: 'wh-den' },
  { id: 'p-8', companyId: 'kos', sku: 'ALN-01', name: 'Aligner Set (Standard)', unitPrice: 1150, cost: 470, vatRate: 0.18, stock: 40, warehouseId: 'wh-kos' },
  { id: 'p-9', companyId: 'ita', sku: 'ALN-IT', name: 'Aligner Set (IT)', unitPrice: 1450, cost: 540, vatRate: 0.22, stock: 52, warehouseId: 'wh-ita' },
]

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------
export const customers: Customer[] = [
  { id: 'c-1', companyId: 'alb', name: 'Klinika Dentare Bardhi', nipt: 'K81234567L', email: 'info@bardhi.al', phone: '+355 69 200 1001', creditLimit: 10000, active: true },
  { id: 'c-2', companyId: 'alb', name: 'Smile Center Tirana', nipt: 'L52345678M', email: 'office@smilecenter.al', phone: '+355 69 200 1002', creditLimit: 15000, active: true },
  { id: 'c-3', companyId: 'alb', name: 'Klient Privat - A. Hoxha', email: 'a.hoxha@email.com', phone: '+355 69 200 1003', creditLimit: 3000, active: true },
  { id: 'c-4', companyId: 'idn', name: 'Dental Care Durrës', nipt: 'L63456789N', email: 'contact@dentalcare.al', phone: '+355 69 200 1004', creditLimit: 8000, active: true },
  { id: 'c-5', companyId: 'idn', name: 'OrthoLab Vlorë', nipt: 'L74567890O', email: 'lab@ortholab.al', phone: '+355 69 200 1005', creditLimit: 12000, active: true },
  { id: 'c-6', companyId: 'kos', name: 'Dentokos Prishtinë', nipt: '600123456', email: 'info@dentokos.com', phone: '+383 44 100 200', creditLimit: 9000, active: true },
  { id: 'c-7', companyId: 'ita', name: 'Studio Dentistico Rossi', nipt: 'IT01122334455', email: 'rossi@studio.it', phone: '+39 02 1234567', creditLimit: 20000, active: true },
]

// ---------------------------------------------------------------------------
// Suppliers
// ---------------------------------------------------------------------------
export const suppliers: Supplier[] = [
  { id: 's-1', companyId: 'alb', name: 'Align Materials GmbH', nipt: 'DE811112223', email: 'sales@alignmat.de', paymentTermsDays: 30, active: true },
  { id: 's-2', companyId: 'alb', name: 'MedSupply Albania', nipt: 'L33445566P', email: 'orders@medsupply.al', paymentTermsDays: 15, active: true },
  { id: 's-3', companyId: 'idn', name: 'Implant Tech Italia', nipt: 'IT05566778899', email: 'info@implanttech.it', paymentTermsDays: 45, active: true },
  { id: 's-4', companyId: 'kos', name: 'Balkan Dental Trade', nipt: '700987654', email: 'sales@bdt.com', paymentTermsDays: 30, active: true },
  { id: 's-5', companyId: 'ita', name: 'Milano Lab Supplies', nipt: 'IT099887766', email: 'ordini@milanolab.it', paymentTermsDays: 30, active: true },
]

// ---------------------------------------------------------------------------
// Cash registers & bank accounts
// ---------------------------------------------------------------------------
export const cashRegisters: CashRegister[] = [
  { id: 'cr-clinic', companyId: 'alb', name: 'Arkë Klinikë', currency: 'EUR', openingBalance: 1500, responsible: 'Erjon Meta' },
  { id: 'cr-lab', companyId: 'alb', name: 'Arkë Laborator', currency: 'EUR', openingBalance: 800, responsible: 'Ana Leka' },
  { id: 'cr-show', companyId: 'idn', name: 'Arkë Showroom', currency: 'EUR', openingBalance: 1200, responsible: 'Klara Bega' },
  { id: 'cr-main', companyId: 'kos', name: 'Arkë Kryesore', currency: 'EUR', openingBalance: 2000, responsible: 'Driton Krasniqi' },
]

export const bankAccounts: BankAccount[] = [
  { id: 'bk-alb-eur', companyId: 'alb', name: 'BKT — EUR', iban: 'AL47212110090000000235698741', currency: 'EUR', openingBalance: 85000 },
  { id: 'bk-alb-all', companyId: 'alb', name: 'Raiffeisen — ALL', iban: 'AL35202111090000000001234567', currency: 'ALL', openingBalance: 4200000 },
  { id: 'bk-idn-eur', companyId: 'idn', name: 'Credins — EUR', iban: 'AL90208110080000000999888777', currency: 'EUR', openingBalance: 42000 },
  { id: 'bk-kos-eur', companyId: 'kos', name: 'ProCredit — EUR', iban: 'XK051000000000000001', currency: 'EUR', openingBalance: 31000 },
  { id: 'bk-ita-eur', companyId: 'ita', name: 'Intesa — EUR', iban: 'IT60X0542811101000000123456', currency: 'EUR', openingBalance: 67000 },
]

// ---------------------------------------------------------------------------
// Helpers for generating invoices
// ---------------------------------------------------------------------------
function line(
  id: string,
  description: string,
  quantity: number,
  unitPrice: number,
  vatRate = 0.2,
  discount = 0,
  productId?: string,
): InvoiceLine {
  return { id, description, quantity, unitPrice, discount, vatRate, productId }
}

// ---------------------------------------------------------------------------
// Sales & purchase invoices
// ---------------------------------------------------------------------------
export const invoices: Invoice[] = [
  // --- iClear Albania sales ---
  {
    id: 'inv-1', companyId: 'alb', kind: 'sale', number: 'SI-2026-0001', partyId: 'c-1',
    issueDate: '2026-01-12', dueDate: '2026-02-11', currency: 'EUR', exchangeRate: 1,
    status: 'paid', paidAmount: 2880,
    lines: [line('l1', 'Aligner Set (Standard)', 2, 1200, 0.2, 0, 'p-1')],
  },
  {
    id: 'inv-2', companyId: 'alb', kind: 'sale', number: 'SI-2026-0002', partyId: 'c-2',
    issueDate: '2026-02-03', dueDate: '2026-03-05', currency: 'EUR', exchangeRate: 1,
    status: 'paid', paidAmount: 2700,
    lines: [line('l1', 'Aligner Set (Premium)', 1, 2250, 0.2, 0, 'p-2')],
  },
  {
    id: 'inv-3', companyId: 'alb', kind: 'sale', number: 'SI-2026-0003', partyId: 'c-3',
    issueDate: '2026-03-18', dueDate: '2026-04-17', currency: 'EUR', exchangeRate: 1,
    status: 'partially_paid', paidAmount: 1000,
    // This is the invoice referenced by the return/credit-note example (2250 € premium set)
    lines: [line('l1', 'Aligner Set (Premium)', 1, 2250, 0.2, 0, 'p-2')],
  },
  {
    id: 'inv-4', companyId: 'alb', kind: 'sale', number: 'SI-2026-0004', partyId: 'c-2',
    issueDate: '2026-04-22', dueDate: '2026-05-22', currency: 'EUR', exchangeRate: 1,
    status: 'approved', paidAmount: 0,
    lines: [
      line('l1', 'Retainer', 4, 250, 0.2, 0.1, 'p-3'),
      line('l2', 'Retainer Pro', 2, 300, 0.2, 0, 'p-4'),
    ],
  },
  {
    id: 'inv-5', companyId: 'alb', kind: 'sale', number: 'SI-2026-0005', partyId: 'c-1',
    issueDate: '2026-05-09', dueDate: '2026-05-19', currency: 'EUR', exchangeRate: 1,
    status: 'partially_paid', paidAmount: 1200,
    lines: [line('l1', 'Aligner Set (Standard)', 2, 1200, 0.2, 0, 'p-1')],
  },
  {
    id: 'inv-6', companyId: 'alb', kind: 'sale', number: 'SI-2026-0006', partyId: 'c-3',
    issueDate: '2026-05-28', dueDate: '2026-06-27', currency: 'EUR', exchangeRate: 1,
    status: 'approved', paidAmount: 0,
    lines: [line('l1', 'Retainer Pro', 3, 300, 0.2, 0, 'p-4')],
  },
  // --- iDental sales ---
  {
    id: 'inv-7', companyId: 'idn', kind: 'sale', number: 'SI-2026-0101', partyId: 'c-4',
    issueDate: '2026-02-14', dueDate: '2026-03-16', currency: 'EUR', exchangeRate: 1,
    status: 'paid', paidAmount: 7800,
    lines: [line('l1', 'Dental Implant', 10, 650, 0.2, 0, 'p-5')],
  },
  {
    id: 'inv-8', companyId: 'idn', kind: 'sale', number: 'SI-2026-0102', partyId: 'c-5',
    issueDate: '2026-04-05', dueDate: '2026-05-05', currency: 'EUR', exchangeRate: 1,
    status: 'partially_paid', paidAmount: 2000,
    lines: [line('l1', 'Zirconia Crown', 15, 320, 0.2, 0.05, 'p-6')],
  },
  {
    id: 'inv-9', companyId: 'idn', kind: 'sale', number: 'SI-2026-0103', partyId: 'c-4',
    issueDate: '2026-06-02', dueDate: '2026-07-02', currency: 'EUR', exchangeRate: 1,
    status: 'approved', paidAmount: 0,
    lines: [line('l1', 'Dental Implant', 6, 650, 0.2, 0, 'p-5')],
  },
  // --- iClear Kosovo sales (USD example) ---
  {
    id: 'inv-10', companyId: 'kos', kind: 'sale', number: 'SI-2026-0201', partyId: 'c-6',
    issueDate: '2026-03-21', dueDate: '2026-04-20', currency: 'USD', exchangeRate: 0.92,
    status: 'paid', paidAmount: 6785,
    lines: [line('l1', 'Aligner Set (Standard)', 5, 1150, 0.18, 0, 'p-8')],
  },
  // --- iClear Italy sales ---
  {
    id: 'inv-11', companyId: 'ita', kind: 'sale', number: 'SI-2026-0301', partyId: 'c-7',
    issueDate: '2026-05-15', dueDate: '2026-06-14', currency: 'EUR', exchangeRate: 1,
    status: 'partially_paid', paidAmount: 5000,
    lines: [line('l1', 'Aligner Set (IT)', 8, 1450, 0.22, 0, 'p-9')],
  },

  // --- Purchase invoices ---
  {
    id: 'pinv-1', companyId: 'alb', kind: 'purchase', number: 'PI-2026-0001', partyId: 's-1',
    issueDate: '2026-01-08', dueDate: '2026-02-07', currency: 'EUR', exchangeRate: 1,
    status: 'paid', paidAmount: 17280,
    lines: [line('l1', 'Aligner blanks (carton)', 30, 480, 0.2, 0, 'p-1')],
    extraCosts: [
      { label: 'Transport', amount: 600 },
      { label: 'Doganë', amount: 850 },
    ],
  },
  {
    id: 'pinv-2', companyId: 'alb', kind: 'purchase', number: 'PI-2026-0002', partyId: 's-2',
    issueDate: '2026-03-11', dueDate: '2026-03-26', currency: 'EUR', exchangeRate: 1,
    status: 'partially_paid', paidAmount: 2000,
    lines: [line('l1', 'Retainer material', 100, 95, 0.2, 0, 'p-3')],
  },
  {
    id: 'pinv-3', companyId: 'idn', kind: 'purchase', number: 'PI-2026-0101', partyId: 's-3',
    issueDate: '2026-02-19', dueDate: '2026-04-04', currency: 'EUR', exchangeRate: 1,
    status: 'approved', paidAmount: 0,
    lines: [line('l1', 'Implant kits', 80, 260, 0.2, 0, 'p-5')],
    extraCosts: [{ label: 'Transport', amount: 420 }],
  },
  {
    id: 'pinv-4', companyId: 'kos', kind: 'purchase', number: 'PI-2026-0201', partyId: 's-4',
    issueDate: '2026-04-02', dueDate: '2026-05-02', currency: 'EUR', exchangeRate: 1,
    status: 'approved', paidAmount: 0,
    lines: [line('l1', 'Aligner blanks', 20, 470, 0.18, 0, 'p-8')],
  },
]

// ---------------------------------------------------------------------------
// Payments (linked to invoices)
// ---------------------------------------------------------------------------
export const payments: Payment[] = [
  { id: 'pay-1', companyId: 'alb', direction: 'in', method: 'bank', partyId: 'c-1', invoiceId: 'inv-1', amount: 2880, currency: 'EUR', exchangeRate: 1, date: '2026-02-10', bankAccountId: 'bk-alb-eur', reference: 'Pagesë faturë SI-2026-0001' },
  { id: 'pay-2', companyId: 'alb', direction: 'in', method: 'bank', partyId: 'c-2', invoiceId: 'inv-2', amount: 2700, currency: 'EUR', exchangeRate: 1, date: '2026-03-01', bankAccountId: 'bk-alb-eur' },
  { id: 'pay-3', companyId: 'alb', direction: 'in', method: 'cash', partyId: 'c-3', invoiceId: 'inv-3', amount: 1000, currency: 'EUR', exchangeRate: 1, date: '2026-03-20', cashRegisterId: 'cr-clinic' },
  { id: 'pay-4', companyId: 'alb', direction: 'in', method: 'cash', partyId: 'c-1', invoiceId: 'inv-5', amount: 1200, currency: 'EUR', exchangeRate: 1, date: '2026-05-12', cashRegisterId: 'cr-clinic' },
  { id: 'pay-5', companyId: 'idn', direction: 'in', method: 'bank', partyId: 'c-4', invoiceId: 'inv-7', amount: 7800, currency: 'EUR', exchangeRate: 1, date: '2026-03-10', bankAccountId: 'bk-idn-eur' },
  { id: 'pay-6', companyId: 'idn', direction: 'in', method: 'bank', partyId: 'c-5', invoiceId: 'inv-8', amount: 2000, currency: 'EUR', exchangeRate: 1, date: '2026-04-20', bankAccountId: 'bk-idn-eur' },
  { id: 'pay-7', companyId: 'kos', direction: 'in', method: 'transfer', partyId: 'c-6', invoiceId: 'inv-10', amount: 6785, currency: 'USD', exchangeRate: 0.92, date: '2026-04-18', bankAccountId: 'bk-kos-eur' },
  { id: 'pay-8', companyId: 'ita', direction: 'in', method: 'bank', partyId: 'c-7', invoiceId: 'inv-11', amount: 5000, currency: 'EUR', exchangeRate: 1, date: '2026-06-01', bankAccountId: 'bk-ita-eur' },
  // outgoing payments to suppliers
  { id: 'pay-9', companyId: 'alb', direction: 'out', method: 'bank', partyId: 's-1', invoiceId: 'pinv-1', amount: 17280, currency: 'EUR', exchangeRate: 1, date: '2026-02-05', bankAccountId: 'bk-alb-eur' },
  { id: 'pay-10', companyId: 'alb', direction: 'out', method: 'bank', partyId: 's-2', invoiceId: 'pinv-2', amount: 2000, currency: 'EUR', exchangeRate: 1, date: '2026-03-20', bankAccountId: 'bk-alb-eur' },
]

// ---------------------------------------------------------------------------
// Expenses
// ---------------------------------------------------------------------------
export const expenses: Expense[] = [
  { id: 'ex-1', companyId: 'alb', category: 'rent', date: '2026-01-05', description: 'Qira zyra Tiranë (Janar)', amount: 1800, currency: 'EUR', exchangeRate: 1, responsible: 'Erjon Meta', status: 'approved', paymentMethod: 'bank' },
  { id: 'ex-2', companyId: 'alb', category: 'rent', date: '2026-02-05', description: 'Qira zyra Tiranë (Shkurt)', amount: 1800, currency: 'EUR', exchangeRate: 1, responsible: 'Erjon Meta', status: 'approved', paymentMethod: 'bank' },
  { id: 'ex-3', companyId: 'alb', category: 'marketing', date: '2026-02-18', description: 'Fushatë Google Ads', amount: 950, currency: 'EUR', exchangeRate: 1, responsible: 'Ana Leka', status: 'approved', paymentMethod: 'card' },
  { id: 'ex-4', companyId: 'alb', category: 'salary', date: '2026-03-31', description: 'Paga Mars (neto)', amount: 12500, currency: 'EUR', exchangeRate: 1, responsible: 'HR', status: 'approved', paymentMethod: 'bank' },
  { id: 'ex-5', companyId: 'alb', category: 'transport', date: '2026-04-09', description: 'Transport ndërkombëtar', amount: 640, currency: 'EUR', exchangeRate: 1, responsible: 'Erjon Meta', status: 'pending', paymentMethod: 'bank' },
  { id: 'ex-6', companyId: 'idn', category: 'rent', date: '2026-03-05', description: 'Qira klinikë Durrës', amount: 1100, currency: 'EUR', exchangeRate: 1, responsible: 'Klara Bega', status: 'approved', paymentMethod: 'bank' },
  { id: 'ex-7', companyId: 'idn', category: 'equipment', date: '2026-05-22', description: 'Skaner intraoral i ri', amount: 8200, currency: 'EUR', exchangeRate: 1, responsible: 'Klara Bega', status: 'pending', paymentMethod: 'bank' },
  { id: 'ex-8', companyId: 'kos', category: 'marketing', date: '2026-04-14', description: 'Reklamë Instagram', amount: 500, currency: 'EUR', exchangeRate: 1, responsible: 'Driton Krasniqi', status: 'approved', paymentMethod: 'card' },
  { id: 'ex-9', companyId: 'ita', category: 'consulting', date: '2026-05-30', description: 'Consulenza fiscale', amount: 1500, currency: 'EUR', exchangeRate: 1, responsible: 'M. Bianchi', status: 'approved', paymentMethod: 'bank' },
  { id: 'ex-10', companyId: 'alb', category: 'bank_fees', date: '2026-06-01', description: 'Tarifa bankare tremujore', amount: 120, currency: 'EUR', exchangeRate: 1, responsible: 'Financa', status: 'approved', paymentMethod: 'bank' },
]

// ---------------------------------------------------------------------------
// Credit note / return (matches the spec example)
//   Original invoice: 2250 €  | Returned: 250 €  | New: 300 €  | Net to pay: 50 €
// ---------------------------------------------------------------------------
export const creditNotes: CreditNote[] = [
  {
    id: 'cn-1', companyId: 'alb', customerId: 'c-3', originalInvoiceId: 'inv-3',
    date: '2026-06-10', currency: 'EUR',
    returnedItems: [{ description: 'Retainer (i kthyer)', amount: 250 }],
    replacementItems: [{ description: 'Retainer Pro (zëvendësim)', amount: 300 }],
    notes: 'Klienti ktheu Retainer 250 € dhe mori Retainer Pro 300 €. Diferenca për pagesë: 50 €.',
  },
]

// ---------------------------------------------------------------------------
// Audit log (read-only)
// ---------------------------------------------------------------------------
export const auditLog: AuditEntry[] = [
  { id: 'au-1', timestamp: Date.parse('2026-06-10T09:14:00Z'), user: 'erjon.meta', action: 'create', entity: 'CreditNote cn-1', after: 'net 50 €', ip: '85.158.12.4', device: 'Chrome / macOS' },
  { id: 'au-2', timestamp: Date.parse('2026-06-01T11:02:00Z'), user: 'financa', action: 'approve', entity: 'Payment pay-8', after: '5000 €', ip: '95.110.4.21', device: 'Safari / iOS' },
  { id: 'au-3', timestamp: Date.parse('2026-05-22T15:40:00Z'), user: 'klara.bega', action: 'create', entity: 'Expense ex-7', before: '—', after: '8200 € (pending)', ip: '188.44.9.2', device: 'Edge / Windows' },
]
