import type { FinanceState } from './store'
import { monthKey } from './format'
import type {
  Currency,
  Invoice,
  InvoiceLine,
} from './types'

// ---------------------------------------------------------------------------
// Currency conversion
// ---------------------------------------------------------------------------
export function toBase(
  state: FinanceState,
  amount: number,
  currency: Currency,
  rate?: number,
): number {
  if (rate && rate > 0) return amount * rate
  const r = state.exchangeRates.rates[currency] ?? 1
  return amount * r
}

// ---------------------------------------------------------------------------
// Company scoping. "grp" means the consolidated group (all operating companies)
// ---------------------------------------------------------------------------
export function isGroupView(companyId: string): boolean {
  return companyId === 'grp'
}

function inScope<T extends { companyId: string }>(
  rows: T[],
  companyId: string,
): T[] {
  if (isGroupView(companyId)) return rows.filter((r) => r.companyId !== 'grp')
  return rows.filter((r) => r.companyId === companyId)
}

// ---------------------------------------------------------------------------
// Invoice math
// ---------------------------------------------------------------------------
export function lineNet(l: InvoiceLine): number {
  return l.quantity * l.unitPrice * (1 - l.discount)
}
export function lineVat(l: InvoiceLine): number {
  return lineNet(l) * l.vatRate
}

export interface InvoiceTotals {
  net: number
  vat: number
  total: number
  baseTotal: number
  baseNet: number
  baseVat: number
  outstanding: number // in invoice currency
  baseOutstanding: number
}

export function invoiceTotals(
  _state: FinanceState,
  inv: Invoice,
): InvoiceTotals {
  const net = inv.lines.reduce((sum, l) => sum + lineNet(l), 0)
  const vat = inv.lines.reduce((sum, l) => sum + lineVat(l), 0)
  const total = net + vat
  const outstanding = Math.max(0, total - inv.paidAmount)
  const r = inv.exchangeRate || 1
  return {
    net,
    vat,
    total,
    baseNet: net * r,
    baseVat: vat * r,
    baseTotal: total * r,
    outstanding,
    baseOutstanding: outstanding * r,
  }
}

// COGS for a sales invoice, using product cost where available.
export function invoiceCogs(state: FinanceState, inv: Invoice): number {
  if (inv.kind !== 'sale') return 0
  const r = inv.exchangeRate || 1
  return inv.lines.reduce((sum, l) => {
    const product = l.productId
      ? state.products.find((p) => p.id === l.productId)
      : undefined
    const unitCost = product ? product.cost : l.unitPrice * 0.4
    return sum + unitCost * l.quantity * r
  }, 0)
}

// ---------------------------------------------------------------------------
// Aggregate financial metrics (all in base currency = EUR)
// ---------------------------------------------------------------------------
export interface FinancialSummary {
  revenue: number
  cogs: number
  grossProfit: number
  operatingExpenses: number
  ebitda: number
  depreciation: number
  netProfit: number
  receivables: number
  payables: number
  cashBalance: number
  bankBalance: number
  vatOutput: number
  vatInput: number
  vatPayable: number
  inventoryValue: number
  unpaidInvoiceCount: number
  overdueInvoiceCount: number
}

const today = '2026-06-17'

export function summary(
  state: FinanceState,
  companyId: string,
  opts: { from?: string; to?: string } = {},
): FinancialSummary {
  const invoices = inScope(state.invoices, companyId).filter((i) => {
    if (i.status === 'cancelled') return false
    if (opts.from && i.issueDate < opts.from) return false
    if (opts.to && i.issueDate > opts.to) return false
    return true
  })
  const sales = invoices.filter((i) => i.kind === 'sale')
  const purchases = invoices.filter((i) => i.kind === 'purchase')

  let revenue = 0
  let cogs = 0
  let vatOutput = 0
  let receivables = 0
  let unpaidInvoiceCount = 0
  let overdueInvoiceCount = 0
  for (const inv of sales) {
    const t = invoiceTotals(state, inv)
    revenue += t.baseNet
    vatOutput += t.baseVat
    cogs += invoiceCogs(state, inv)
    receivables += t.baseOutstanding
    if (t.outstanding > 0) {
      unpaidInvoiceCount++
      if (inv.dueDate < today) overdueInvoiceCount++
    }
  }

  let vatInput = 0
  let payables = 0
  for (const inv of purchases) {
    const t = invoiceTotals(state, inv)
    vatInput += t.baseVat
    payables += t.baseOutstanding
  }

  // Operating expenses (approved only) within range
  const expenses = inScope(state.expenses, companyId).filter((e) => {
    if (e.status !== 'approved') return false
    if (opts.from && e.date < opts.from) return false
    if (opts.to && e.date > opts.to) return false
    return true
  })
  let operatingExpenses = 0
  let depreciation = 0
  for (const e of expenses) {
    const base = toBase(state, e.amount, e.currency, e.exchangeRate)
    operatingExpenses += base
  }
  // Treat a portion of equipment as depreciation for the P&L demo
  depreciation = inScope(state.expenses, companyId)
    .filter((e) => e.category === 'equipment' && e.status === 'approved')
    .reduce((s, e) => s + toBase(state, e.amount, e.currency, e.exchangeRate) * 0.2, 0)

  const grossProfit = revenue - cogs
  const ebitda = grossProfit - operatingExpenses
  const netProfit = ebitda - depreciation

  // Cash & bank balances (opening + net movements)
  const cashBalance = cashBalanceTotal(state, companyId)
  const bankBalance = bankBalanceTotal(state, companyId)

  const inventoryValue = inScope(state.products, companyId).reduce(
    (s, p) => s + p.stock * p.cost,
    0,
  )

  return {
    revenue,
    cogs,
    grossProfit,
    operatingExpenses,
    ebitda,
    depreciation,
    netProfit,
    receivables,
    payables,
    cashBalance,
    bankBalance,
    vatOutput,
    vatInput,
    vatPayable: vatOutput - vatInput,
    inventoryValue,
    unpaidInvoiceCount,
    overdueInvoiceCount,
  }
}

// ---------------------------------------------------------------------------
// Cash / bank balances
// ---------------------------------------------------------------------------
export function cashBalanceTotal(state: FinanceState, companyId: string): number {
  const registers = inScope(state.cashRegisters, companyId)
  return registers.reduce((sum, reg) => sum + cashRegisterBalance(state, reg.id), 0)
}

export function cashRegisterBalance(state: FinanceState, registerId: string): number {
  const reg = state.cashRegisters.find((r) => r.id === registerId)
  if (!reg) return 0
  let balance = toBase(state, reg.openingBalance, reg.currency)
  for (const p of state.payments) {
    if (p.cashRegisterId !== registerId) continue
    const base = toBase(state, p.amount, p.currency, p.exchangeRate)
    balance += p.direction === 'in' ? base : -base
  }
  // cash expenses reduce the register's company cash (approx: apply to main register)
  return balance
}

export function bankBalanceTotal(state: FinanceState, companyId: string): number {
  const banks = inScope(state.bankAccounts, companyId)
  return banks.reduce((sum, b) => sum + bankAccountBalance(state, b.id), 0)
}

export function bankAccountBalance(state: FinanceState, bankId: string): number {
  const bank = state.bankAccounts.find((b) => b.id === bankId)
  if (!bank) return 0
  let balance = toBase(state, bank.openingBalance, bank.currency)
  for (const p of state.payments) {
    if (p.bankAccountId !== bankId) continue
    const base = toBase(state, p.amount, p.currency, p.exchangeRate)
    balance += p.direction === 'in' ? base : -base
  }
  return balance
}

// ---------------------------------------------------------------------------
// Monthly revenue / expense series (for charts)
// ---------------------------------------------------------------------------
export interface MonthlyPoint {
  month: string
  revenue: number
  expenses: number
  profit: number
}

export function monthlySeries(
  state: FinanceState,
  companyId: string,
  year = '2026',
): MonthlyPoint[] {
  const months = Array.from({ length: 12 }, (_, i) =>
    `${year}-${String(i + 1).padStart(2, '0')}`,
  )
  const map = new Map<string, MonthlyPoint>(
    months.map((m) => [m, { month: m, revenue: 0, expenses: 0, profit: 0 }]),
  )

  for (const inv of inScope(state.invoices, companyId)) {
    if (inv.kind !== 'sale' || inv.status === 'cancelled') continue
    const key = monthKey(inv.issueDate)
    const point = map.get(key)
    if (!point) continue
    point.revenue += invoiceTotals(state, inv).baseNet
  }
  for (const e of inScope(state.expenses, companyId)) {
    if (e.status !== 'approved') continue
    const key = monthKey(e.date)
    const point = map.get(key)
    if (!point) continue
    point.expenses += toBase(state, e.amount, e.currency, e.exchangeRate)
  }
  // Add COGS into expenses for the profit line
  for (const inv of inScope(state.invoices, companyId)) {
    if (inv.kind !== 'sale' || inv.status === 'cancelled') continue
    const key = monthKey(inv.issueDate)
    const point = map.get(key)
    if (!point) continue
    point.expenses += invoiceCogs(state, inv)
  }
  for (const p of map.values()) p.profit = p.revenue - p.expenses
  return months.map((m) => map.get(m)!)
}

// ---------------------------------------------------------------------------
// Customer & supplier statements
// ---------------------------------------------------------------------------
export interface PartyStatement {
  invoiced: number
  paid: number
  balance: number
  invoiceCount: number
}

export function customerStatement(
  state: FinanceState,
  customerId: string,
): PartyStatement {
  const invs = state.invoices.filter(
    (i) => i.kind === 'sale' && i.partyId === customerId && i.status !== 'cancelled',
  )
  let invoiced = 0
  let paid = 0
  for (const inv of invs) {
    const t = invoiceTotals(state, inv)
    invoiced += t.baseTotal
    paid += inv.paidAmount * (inv.exchangeRate || 1)
  }
  return { invoiced, paid, balance: invoiced - paid, invoiceCount: invs.length }
}

export function supplierStatement(
  state: FinanceState,
  supplierId: string,
): PartyStatement {
  const invs = state.invoices.filter(
    (i) => i.kind === 'purchase' && i.partyId === supplierId && i.status !== 'cancelled',
  )
  let invoiced = 0
  let paid = 0
  for (const inv of invs) {
    const t = invoiceTotals(state, inv)
    invoiced += t.baseTotal
    paid += inv.paidAmount * (inv.exchangeRate || 1)
  }
  return { invoiced, paid, balance: invoiced - paid, invoiceCount: invs.length }
}

// ---------------------------------------------------------------------------
// Reports: P&L, Balance Sheet, Cashflow
// ---------------------------------------------------------------------------
export interface BalanceSheet {
  // assets
  bank: number
  cash: number
  receivables: number
  inventory: number
  totalAssets: number
  // liabilities
  payables: number
  vatPayable: number
  totalLiabilities: number
  // equity
  equity: number
}

export function balanceSheet(state: FinanceState, companyId: string): BalanceSheet {
  const s = summary(state, companyId)
  const bank = s.bankBalance
  const cash = s.cashBalance
  const receivables = s.receivables
  const inventory = s.inventoryValue
  const totalAssets = bank + cash + receivables + inventory
  const payables = s.payables
  const vatPayable = Math.max(0, s.vatPayable)
  const totalLiabilities = payables + vatPayable
  const equity = totalAssets - totalLiabilities
  return {
    bank,
    cash,
    receivables,
    inventory,
    totalAssets,
    payables,
    vatPayable,
    totalLiabilities,
    equity,
  }
}

export interface Cashflow {
  inflow: number
  outflow: number
  operating: number
  upcomingReceivables: number
  upcomingPayables: number
}

export function cashflow(state: FinanceState, companyId: string): Cashflow {
  const payments = inScope(state.payments, companyId)
  let inflow = 0
  let outflow = 0
  for (const p of payments) {
    const base = toBase(state, p.amount, p.currency, p.exchangeRate)
    if (p.direction === 'in') inflow += base
    else outflow += base
  }
  const s = summary(state, companyId)
  return {
    inflow,
    outflow,
    operating: inflow - outflow,
    upcomingReceivables: s.receivables,
    upcomingPayables: s.payables,
  }
}

// ---------------------------------------------------------------------------
// Helpers used by UI lists
// ---------------------------------------------------------------------------
export function companyName(state: FinanceState, companyId: string): string {
  return state.companies.find((c) => c.id === companyId)?.name ?? companyId
}

export function partyName(state: FinanceState, partyId: string): string {
  const c = state.customers.find((x) => x.id === partyId)
  if (c) return c.name
  const s = state.suppliers.find((x) => x.id === partyId)
  if (s) return s.name
  return partyId
}

export function scoped<T extends { companyId: string }>(
  rows: T[],
  companyId: string,
): T[] {
  return inScope(rows, companyId)
}
