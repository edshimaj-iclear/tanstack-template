import { Store } from '@tanstack/store'
import {
  llogarite as fareLlogarite,
  regjistriAuditit as fareAudit,
  llogariteBankare as fareBanka,
  arkat as fareArka,
  kompanite as fareKompani,
  notatKrediti as fareNotaKrediti,
  klientet as fareKlientet,
  kursetKembimit as fareKurset,
  shpenzimet as fareShpenzime,
  faturat as fareFatura,
  pagesat as farePagesa,
  produktet as fareProdukte,
  furnitoret as fareFurnitore,
  magazinat as fareMagazina,
} from './seed'
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
  Pagesa,
  Produkti,
  Furnitori,
  Magazina,
} from './types'

export interface GjendjaFinanca {
  kompanite: Kompania[]
  llogarite: Llogaria[]
  klientet: Klienti[]
  furnitoret: Furnitori[]
  magazinat: Magazina[]
  produktet: Produkti[]
  faturat: Fatura[]
  pagesat: Pagesa[]
  arkat: Arka[]
  llogariteBankare: LlogariaBankare[]
  shpenzimet: Shpenzimi[]
  notatKrediti: NotaKrediti[]
  regjistriAuditit: ZeriAuditit[]
  kursetKembimit: KursetKembimit
  // Gjendja e UI-së
  kompaniaAktualeId: string // "grp" = pamja e konsoliduar e grupit
}

const CELESI_RUAJTJES = 'iclear-finance-state-v1'

function gjendjaFillestare(): GjendjaFinanca {
  return {
    kompanite: fareKompani,
    llogarite: fareLlogarite,
    klientet: fareKlientet,
    furnitoret: fareFurnitore,
    magazinat: fareMagazina,
    produktet: fareProdukte,
    faturat: fareFatura,
    pagesat: farePagesa,
    arkat: fareArka,
    llogariteBankare: fareBanka,
    shpenzimet: fareShpenzime,
    notatKrediti: fareNotaKrediti,
    regjistriAuditit: fareAudit,
    kursetKembimit: fareKurset,
    kompaniaAktualeId: 'grp',
  }
}

function ngarkoGjendjen(): GjendjaFinanca {
  if (typeof window === 'undefined') return gjendjaFillestare()
  try {
    const teDhenat = window.localStorage.getItem(CELESI_RUAJTJES)
    if (!teDhenat) return gjendjaFillestare()
    const analizuar = JSON.parse(teDhenat) as Partial<GjendjaFinanca>
    // Bashkojmë mbi një gjendje të freskët fillestare që fushat e reja të jenë gjithmonë prezente.
    // Fillojmë gjithmonë në pamjen e grupit që render-i i parë i klientit të
    // përputhet me HTML-në e render-uar nga serveri (shmang mospërputhjen e hidratimit).
    return { ...gjendjaFillestare(), ...analizuar, kompaniaAktualeId: 'grp' }
  } catch {
    return gjendjaFillestare()
  }
}

export const financaStore = new Store<GjendjaFinanca>(ngarkoGjendjen())

// Ruajtje në localStorage në çdo ndryshim (vetëm në klient).
if (typeof window !== 'undefined') {
  financaStore.subscribe(() => {
    try {
      window.localStorage.setItem(CELESI_RUAJTJES, JSON.stringify(financaStore.state))
    } catch {
      /* injoro gabimet e kuotës / serializimit */
    }
  })
}

function idRe(prefiks: string): string {
  return `${prefiks}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

function regjistroAudit(veprimi: string, entiteti: string, pas?: string) {
  const zeri: ZeriAuditit = {
    id: idRe('au'),
    koha: Date.now(),
    perdoruesi: 'edshimaj',
    veprimi,
    entiteti,
    pas,
    ip: '127.0.0.1',
    pajisja: 'Aplikacioni web',
  }
  financaStore.setState((g) => ({ ...g, regjistriAuditit: [zeri, ...g.regjistriAuditit] }))
}

export const veprimetFinanca = {
  vendosKompanineAktuale(kompaniaId: string) {
    financaStore.setState((g) => ({ ...g, kompaniaAktualeId: kompaniaId }))
  },

  rivendosTeDhenat() {
    financaStore.setState(() => gjendjaFillestare())
  },

  shtoKlient(hyrje: Omit<Klienti, 'id'>) {
    const klienti: Klienti = { ...hyrje, id: idRe('c') }
    financaStore.setState((g) => ({ ...g, klientet: [...g.klientet, klienti] }))
    regjistroAudit('krijim', `Klienti ${klienti.emri}`)
    return klienti.id
  },

  shtoFurnitor(hyrje: Omit<Furnitori, 'id'>) {
    const furnitori: Furnitori = { ...hyrje, id: idRe('s') }
    financaStore.setState((g) => ({ ...g, furnitoret: [...g.furnitoret, furnitori] }))
    regjistroAudit('krijim', `Furnitori ${furnitori.emri}`)
    return furnitori.id
  },

  shtoLlogari(hyrje: Omit<Llogaria, 'id'>) {
    const llogaria: Llogaria = { ...hyrje, id: idRe('acc') }
    financaStore.setState((g) => ({ ...g, llogarite: [...g.llogarite, llogaria] }))
    regjistroAudit('krijim', `Llogaria ${llogaria.kodi} ${llogaria.emri}`)
    return llogaria.id
  },

  shtoFature(hyrje: Omit<Fatura, 'id'>) {
    const fatura: Fatura = { ...hyrje, id: idRe('inv') }
    financaStore.setState((g) => ({ ...g, faturat: [...g.faturat, fatura] }))
    regjistroAudit('krijim', `Fatura ${fatura.numri}`)
    return fatura.id
  },

  ndryshoStatusinFatures(id: string, statusi: Fatura['statusi']) {
    financaStore.setState((g) => ({
      ...g,
      faturat: g.faturat.map((f) => (f.id === id ? { ...f, statusi } : f)),
    }))
    regjistroAudit('ndryshim', `Fatura ${id}`, `statusi=${statusi}`)
  },

  shtoPagese(hyrje: Omit<Pagesa, 'id'>) {
    const pagesa: Pagesa = { ...hyrje, id: idRe('pay') }
    financaStore.setState((g) => {
      let faturat = g.faturat
      if (pagesa.faturaId) {
        faturat = g.faturat.map((fatura) => {
          if (fatura.id !== pagesa.faturaId) return fatura
          const shumaPaguar = fatura.shumaPaguar + pagesa.shuma
          return { ...fatura, shumaPaguar }
        })
      }
      return { ...g, pagesat: [...g.pagesat, pagesa], faturat }
    })
    regjistroAudit('krijim', `Pagesa ${pagesa.shuma} ${pagesa.monedha}`)
    return pagesa.id
  },

  shtoShpenzim(hyrje: Omit<Shpenzimi, 'id'>) {
    const shpenzimi: Shpenzimi = { ...hyrje, id: idRe('ex') }
    financaStore.setState((g) => ({ ...g, shpenzimet: [...g.shpenzimet, shpenzimi] }))
    regjistroAudit('krijim', `Shpenzimi ${shpenzimi.pershkrimi}`)
    return shpenzimi.id
  },

  vendosStatusinShpenzimit(id: string, statusi: Shpenzimi['statusi']) {
    financaStore.setState((g) => ({
      ...g,
      shpenzimet: g.shpenzimet.map((sh) => (sh.id === id ? { ...sh, statusi } : sh)),
    }))
    regjistroAudit(statusi === 'aprovuar' ? 'aprovim' : 'refuzim', `Shpenzimi ${id}`)
  },

  shtoNoteKrediti(hyrje: Omit<NotaKrediti, 'id'>) {
    const nota: NotaKrediti = { ...hyrje, id: idRe('cn') }
    financaStore.setState((g) => ({ ...g, notatKrediti: [...g.notatKrediti, nota] }))
    regjistroAudit('krijim', `NotaKrediti ${nota.id}`)
    return nota.id
  },
}
