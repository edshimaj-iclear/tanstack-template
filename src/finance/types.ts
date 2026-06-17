// Core domain types for the Finance & Accounting Management System.
// All monetary values are stored as numbers in the entity's own currency;
// the base-currency value is derived using the stored exchange rate.

export type Currency = 'EUR' | 'ALL' | 'USD' | 'GBP'

export type AccountType =
  | 'asset'
  | 'liability'
  | 'equity'
  | 'income'
  | 'expense'

export type InvoiceKind = 'sale' | 'purchase'

export type InvoiceStatus =
  | 'draft'
  | 'approved'
  | 'paid'
  | 'partially_paid'
  | 'cancelled'

export type PaymentDirection = 'in' | 'out'

export type PaymentMethod = 'cash' | 'bank' | 'card' | 'transfer'

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export type Role =
  | 'ceo'
  | 'cfo'
  | 'accountant'
  | 'sales_manager'
  | 'warehouse_manager'
  | 'hr_manager'
  | 'branch_manager'
  | 'employee'
  | 'auditor'

export interface Company {
  id: string
  name: string
  nipt: string // NIPT / VAT number
  baseCurrency: Currency
  country: string
  isGroup?: boolean // the consolidated group entity
}

export interface Account {
  id: string
  code: string // accounting code, e.g. "1010"
  name: string
  type: AccountType
  parentId?: string // for sub-accounts
}

export interface Customer {
  id: string
  companyId: string
  name: string
  nipt?: string
  email?: string
  phone?: string
  address?: string
  creditLimit: number // in base currency
  active: boolean
  notes?: string
}

export interface Supplier {
  id: string
  companyId: string
  name: string
  nipt?: string
  email?: string
  phone?: string
  paymentTermsDays: number
  active: boolean
}

export interface Warehouse {
  id: string
  companyId: string
  name: string
}

export interface Product {
  id: string
  companyId: string
  sku: string
  name: string
  unitPrice: number // sales price in company base currency
  cost: number // landed cost in company base currency
  vatRate: number // e.g. 0.2 for 20%
  stock: number
  warehouseId: string
}

export interface InvoiceLine {
  id: string
  productId?: string
  description: string
  quantity: number
  unitPrice: number
  discount: number // fractional, e.g. 0.1 = 10%
  vatRate: number
}

export interface Invoice {
  id: string
  companyId: string
  kind: InvoiceKind
  number: string
  partyId: string // customerId for sale, supplierId for purchase
  issueDate: string // ISO date
  dueDate: string
  currency: Currency
  exchangeRate: number // multiply to get base currency
  status: InvoiceStatus
  lines: InvoiceLine[]
  paidAmount: number // in invoice currency
  notes?: string
  // Extra landed costs for purchases (transport, customs, bank fees...)
  extraCosts?: { label: string; amount: number }[]
}

export interface Payment {
  id: string
  companyId: string
  direction: PaymentDirection
  method: PaymentMethod
  partyId: string
  invoiceId?: string
  amount: number
  currency: Currency
  exchangeRate: number
  date: string
  reference?: string
  // where the money landed/left
  cashRegisterId?: string
  bankAccountId?: string
}

export interface CashRegister {
  id: string
  companyId: string
  name: string
  currency: Currency
  openingBalance: number
  responsible: string
}

export interface BankAccount {
  id: string
  companyId: string
  name: string
  iban: string
  currency: Currency
  openingBalance: number
}

export type ExpenseCategory =
  | 'rent'
  | 'salary'
  | 'marketing'
  | 'transport'
  | 'customs'
  | 'materials'
  | 'equipment'
  | 'maintenance'
  | 'training'
  | 'commission'
  | 'travel'
  | 'bank_fees'
  | 'consulting'
  | 'other'

export interface Expense {
  id: string
  companyId: string
  category: ExpenseCategory
  date: string
  description: string
  amount: number
  currency: Currency
  exchangeRate: number
  responsible: string
  status: ApprovalStatus
  paymentMethod: PaymentMethod
}

export interface CreditNoteItem {
  description: string
  amount: number
}

// Models a customer return that may be exchanged for a different product,
// recording only the net difference to pay (per the spec example).
export interface CreditNote {
  id: string
  companyId: string
  customerId: string
  originalInvoiceId: string
  date: string
  returnedItems: CreditNoteItem[]
  replacementItems: CreditNoteItem[]
  currency: Currency
  notes?: string
}

export interface AuditEntry {
  id: string
  timestamp: number
  user: string
  action: string
  entity: string
  before?: string
  after?: string
  ip: string
  device: string
}

export interface ExchangeRates {
  // value of 1 unit of currency in the system base currency (EUR)
  base: Currency
  rates: Record<Currency, number>
}
