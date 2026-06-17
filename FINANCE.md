# iClear Finance & Accounting Management System

A professional, multi-company finance & accounting platform built on top of the
TanStack Start + Convex + Claude template. It manages finances, accounting,
invoicing, payments, cash, bank, customers, suppliers, inventory value, taxes,
financial reporting and a real-time balance — in the spirit of Odoo Finance,
adapted to the iClear group structure.

> The app boots with a rich, deterministic seed dataset for the iClear group
> (FY 2026), so every screen and report is populated and demonstrable
> immediately with `npm run dev` — no database setup required.

## Running

```bash
npm install
npm run dev        # http://localhost:3000
```

The AI Finance Assistant additionally needs `ANTHROPIC_API_KEY` (see the main
README). All other modules work fully offline.

## Architecture

The platform is a client-first SPA with SSR via TanStack Start. State lives in a
single, well-typed TanStack Store with `localStorage` persistence, so the
financial model is a clean single source of truth that can later be backed by
Convex without touching the UI.

```
src/finance/
  types.ts       # Domain model (companies, accounts, invoices, payments, ...)
  seed.ts        # Realistic multi-company seed data (FY 2026)
  store.ts       # TanStack Store + actions + audit logging + persistence
  selectors.ts   # Financial engine: P&L, balance sheet, cashflow, statements
  format.ts      # Currency / number / date formatting
  hooks.ts       # React bindings

src/components/finance/
  AppLayout.tsx          # Sidebar + multi-company switcher shell
  ui.tsx, forms.tsx      # Design system primitives
  InvoiceFormModal.tsx   # Shared sales/purchase invoice editor

src/routes/              # One file-based route per module
```

The **financial engine** (`selectors.ts`) computes every figure on the fly from
the underlying documents — invoices, payments, expenses — in the base currency
(EUR), converting foreign-currency transactions via stored exchange rates. There
are no denormalized totals to drift out of sync.

## Modules implemented

| Module | Route | Highlights |
|---|---|---|
| Financial Dashboard | `/` | Revenue, gross/net profit, cashflow, bank/cash, receivables/payables, VAT, unpaid & overdue, monthly chart, top debtors |
| Multi-company | `/companies` | 6 entities + consolidated group view; per-company KPIs; company switcher |
| Chart of Accounts | `/accounts` | Asset/liability/equity/income/expense, sub-accounts, create new |
| Customers | `/customers` | Full statement: invoiced / paid / balance, credit limit usage |
| Suppliers | `/suppliers` | Payables, payment terms, statement |
| Sales Invoices | `/sales` | Multi-line, VAT, discounts, multi-currency, partial payments, statuses |
| Purchase Invoices | `/purchases` | Landed cost with extra costs (transport, customs) |
| Payments | `/payments` | Cash/bank/card/transfer, in/out, linked to invoices, multi-currency |
| Cash registers | `/cash` | Per-register balances, movements, responsible person |
| Bank | `/bank` | Multiple accounts, balances, transactions, reconciliation |
| Expenses | `/expenses` | 14 categories, approval workflow (> €100 requires approval) |
| Returns & Credit Notes | `/returns` | Return + replacement with **net difference** logic |
| Reports | `/reports` | P&L (incl. EBITDA), Balance Sheet, Cashflow with forecast |
| Audit Log | `/audit` | Immutable trail: who/when/what/value/IP/device |
| AI Finance Assistant | `/assistant` | Natural-language Q&A grounded in live group data |

### Returns & net-difference example

The Returns module implements the spec example exactly: a customer returns a
€250 product and takes a €300 replacement, so only the **€50 difference** is
recorded as payable — the credit note makes clear the original item was returned
and a new one received, rather than the customer holding both.

### Multi-currency

Transactions store their original currency, exchange rate and the derived
base-currency (EUR) value. EUR / ALL / USD / GBP are supported.

## Scope note

This is a working foundation covering the core of the 29-section requirements
document end to end. The remaining areas described in the spec — payroll
integration, budgeting & forecasting, granular RBAC, 2FA/security, e-invoice /
fiscalization integrations and PDF/Excel export pipelines — are designed for but
not yet wired, and are the natural next iteration. The data model and financial
engine were built to accommodate them.
