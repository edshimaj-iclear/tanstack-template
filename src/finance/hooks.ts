import { useStore } from '@tanstack/react-store'
import { financeStore, financeActions, type FinanceState } from './store'

export function useFinanceState(): FinanceState {
  return useStore(financeStore, (s) => s)
}

export function useFinanceSlice<T>(selector: (s: FinanceState) => T): T {
  return useStore(financeStore, selector)
}

export function useCurrentCompanyId(): string {
  return useStore(financeStore, (s) => s.currentCompanyId)
}

export function useFinanceActions() {
  return financeActions
}
