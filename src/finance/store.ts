import { Store } from '@tanstack/store'
import {
  accounts as seedAccounts,
  auditLog as seedAudit,
  bankAccounts as seedBanks,
  cashRegisters as seedCash,
  companies as seedCompanies,
  creditNotes as seedCreditNotes,
  customers as seedCustomers,
  exchangeRates as seedRates,
  expenses as seedExpenses,
  invoices as seedInvoices,
  payments as seedPayments,
  products as seedProducts,
  suppliers as seedSuppliers,
  warehouses as seedWarehouses,
} from './seed'
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
  Payment,
  Product,
  Supplier,
  Warehouse,
} from './types'

export interface FinanceState {
  companies: Company[]
  accounts: Account[]
  customers: Customer[]
  suppliers: Supplier[]
  warehouses: Warehouse[]
  products: Product[]
  invoices: Invoice[]
  payments: Payment[]
  cashRegisters: CashRegister[]
  bankAccounts: BankAccount[]
  expenses: Expense[]
  creditNotes: CreditNote[]
  auditLog: AuditEntry[]
  exchangeRates: ExchangeRates
  // UI state
  currentCompanyId: string // "grp" = consolidated group view
}

const STORAGE_KEY = 'iclear-finance-state-v1'

function seededState(): FinanceState {
  return {
    companies: seedCompanies,
    accounts: seedAccounts,
    customers: seedCustomers,
    suppliers: seedSuppliers,
    warehouses: seedWarehouses,
    products: seedProducts,
    invoices: seedInvoices,
    payments: seedPayments,
    cashRegisters: seedCash,
    bankAccounts: seedBanks,
    expenses: seedExpenses,
    creditNotes: seedCreditNotes,
    auditLog: seedAudit,
    exchangeRates: seedRates,
    currentCompanyId: 'grp',
  }
}

function loadState(): FinanceState {
  if (typeof window === 'undefined') return seededState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return seededState()
    const parsed = JSON.parse(raw) as Partial<FinanceState>
    // Merge over a fresh seed so newly-added fields are always present.
    // Always start on the consolidated group view so the first client render
    // matches the server-rendered HTML (avoids hydration mismatch).
    return { ...seededState(), ...parsed, currentCompanyId: 'grp' }
  } catch {
    return seededState()
  }
}

export const financeStore = new Store<FinanceState>(loadState())

// Persist to localStorage on every change (client only).
if (typeof window !== 'undefined') {
  financeStore.subscribe(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(financeStore.state))
    } catch {
      /* ignore quota / serialization errors */
    }
  })
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

function logAudit(action: string, entity: string, after?: string) {
  const entry: AuditEntry = {
    id: uid('au'),
    timestamp: Date.now(),
    user: 'edshimaj',
    action,
    entity,
    after,
    ip: '127.0.0.1',
    device: 'Web app',
  }
  financeStore.setState((s) => ({ ...s, auditLog: [entry, ...s.auditLog] }))
}

export const financeActions = {
  setCurrentCompany(companyId: string) {
    financeStore.setState((s) => ({ ...s, currentCompanyId: companyId }))
  },

  resetToSeed() {
    financeStore.setState(() => seededState())
  },

  addCustomer(input: Omit<Customer, 'id'>) {
    const customer: Customer = { ...input, id: uid('c') }
    financeStore.setState((s) => ({ ...s, customers: [...s.customers, customer] }))
    logAudit('create', `Customer ${customer.name}`)
    return customer.id
  },

  addSupplier(input: Omit<Supplier, 'id'>) {
    const supplier: Supplier = { ...input, id: uid('s') }
    financeStore.setState((s) => ({ ...s, suppliers: [...s.suppliers, supplier] }))
    logAudit('create', `Supplier ${supplier.name}`)
    return supplier.id
  },

  addAccount(input: Omit<Account, 'id'>) {
    const account: Account = { ...input, id: uid('acc') }
    financeStore.setState((s) => ({ ...s, accounts: [...s.accounts, account] }))
    logAudit('create', `Account ${account.code} ${account.name}`)
    return account.id
  },

  addInvoice(input: Omit<Invoice, 'id'>) {
    const invoice: Invoice = { ...input, id: uid('inv') }
    financeStore.setState((s) => ({ ...s, invoices: [...s.invoices, invoice] }))
    logAudit('create', `Invoice ${invoice.number}`)
    return invoice.id
  },

  updateInvoiceStatus(id: string, status: Invoice['status']) {
    financeStore.setState((s) => ({
      ...s,
      invoices: s.invoices.map((i) => (i.id === id ? { ...i, status } : i)),
    }))
    logAudit('update', `Invoice ${id}`, `status=${status}`)
  },

  addPayment(input: Omit<Payment, 'id'>) {
    const payment: Payment = { ...input, id: uid('pay') }
    financeStore.setState((s) => {
      let invoices = s.invoices
      if (payment.invoiceId) {
        invoices = s.invoices.map((inv) => {
          if (inv.id !== payment.invoiceId) return inv
          const paidAmount = inv.paidAmount + payment.amount
          return { ...inv, paidAmount }
        })
      }
      return { ...s, payments: [...s.payments, payment], invoices }
    })
    logAudit('create', `Payment ${payment.amount} ${payment.currency}`)
    return payment.id
  },

  addExpense(input: Omit<Expense, 'id'>) {
    const expense: Expense = { ...input, id: uid('ex') }
    financeStore.setState((s) => ({ ...s, expenses: [...s.expenses, expense] }))
    logAudit('create', `Expense ${expense.description}`)
    return expense.id
  },

  setExpenseStatus(id: string, status: Expense['status']) {
    financeStore.setState((s) => ({
      ...s,
      expenses: s.expenses.map((e) => (e.id === id ? { ...e, status } : e)),
    }))
    logAudit(status === 'approved' ? 'approve' : 'reject', `Expense ${id}`)
  },

  addCreditNote(input: Omit<CreditNote, 'id'>) {
    const note: CreditNote = { ...input, id: uid('cn') }
    financeStore.setState((s) => ({ ...s, creditNotes: [...s.creditNotes, note] }))
    logAudit('create', `CreditNote ${note.id}`)
    return note.id
  },
}
