import { useStore } from '@tanstack/react-store'
import { financaStore, veprimetFinanca, type GjendjaFinanca } from './store'

export function usePerdorGjendjen(): GjendjaFinanca {
  return useStore(financaStore, (g) => g)
}

export function usePjesaGjendjes<T>(perzgjedhes: (g: GjendjaFinanca) => T): T {
  return useStore(financaStore, perzgjedhes)
}

export function useKompaniaAktualeId(): string {
  return useStore(financaStore, (g) => g.kompaniaAktualeId)
}

export function useVeprimetFinanca() {
  return veprimetFinanca
}
