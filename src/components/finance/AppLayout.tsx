import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  FileText,
  Users,
  ShoppingCart,
  Truck,
  Wallet,
  Banknote,
  Landmark,
  Receipt,
  RotateCcw,
  BookOpen,
  BarChart3,
  ShieldCheck,
  Building2,
  Sparkles,
  ChevronDown,
} from 'lucide-react'
import { usePerdorGjendjen, useVeprimetFinanca } from '../../finance'

interface NavItem {
  to: string
  label: string
  icon: ReactNode
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const NAV: NavGroup[] = [
  {
    title: '',
    items: [{ to: '/', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }],
  },
  {
    title: 'Shitje',
    items: [
      { to: '/sales', label: 'Fatura Shitjeje', icon: <FileText className="w-4 h-4" /> },
      { to: '/customers', label: 'Klientët', icon: <Users className="w-4 h-4" /> },
      { to: '/returns', label: 'Kthime & Credit Note', icon: <RotateCcw className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Blerje',
    items: [
      { to: '/purchases', label: 'Fatura Blerjeje', icon: <ShoppingCart className="w-4 h-4" /> },
      { to: '/suppliers', label: 'Furnitorët', icon: <Truck className="w-4 h-4" /> },
      { to: '/expenses', label: 'Shpenzimet', icon: <Receipt className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Arka & Banka',
    items: [
      { to: '/payments', label: 'Pagesat', icon: <Wallet className="w-4 h-4" /> },
      { to: '/cash', label: 'Arka', icon: <Banknote className="w-4 h-4" /> },
      { to: '/bank', label: 'Banka', icon: <Landmark className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Kontabiliteti',
    items: [
      { to: '/accounts', label: 'Plani Kontabël', icon: <BookOpen className="w-4 h-4" /> },
      { to: '/reports', label: 'Raportet', icon: <BarChart3 className="w-4 h-4" /> },
      { to: '/audit', label: 'Audit Log', icon: <ShieldCheck className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Sistemi',
    items: [
      { to: '/companies', label: 'Kompanitë', icon: <Building2 className="w-4 h-4" /> },
      { to: '/assistant', label: 'AI Asistent Financiar', icon: <Sparkles className="w-4 h-4" /> },
    ],
  },
]

function CompanySwitcher() {
  const { kompanite, kompaniaAktualeId } = usePerdorGjendjen()
  const { vendosKompanineAktuale } = useVeprimetFinanca()
  return (
    <div className="relative">
      <select
        value={kompaniaAktualeId}
        onChange={(e) => vendosKompanineAktuale(e.target.value)}
        className="w-full py-2 pl-3 pr-8 text-sm font-medium bg-slate-800 border border-slate-700 rounded-lg appearance-none text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {kompanite.map((k) => (
          <option key={k.id} value={k.id}>
            {k.eshteGrup ? `★ ${k.emri} (Konsoliduar)` : k.emri}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none right-2 top-1/2 text-slate-400" />
    </div>
  )
}

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Sidebar */}
      <aside className="flex flex-col w-64 shrink-0 bg-slate-900">
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">iClear Finance</p>
              <p className="text-xs text-slate-400">Accounting Suite</p>
            </div>
          </div>
        </div>

        <div className="px-3 py-3 border-b border-slate-800">
          <p className="px-2 mb-1.5 text-[10px] font-semibold tracking-widest uppercase text-slate-500">
            Kompania
          </p>
          <CompanySwitcher />
        </div>

        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          {NAV.map((group, i) => (
            <div key={i} className="mb-4">
              {group.title && (
                <p className="px-2 mb-1 text-[10px] font-semibold tracking-widest uppercase text-slate-500">
                  {group.title}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeOptions={{ exact: item.to === '/' }}
                    className="flex items-center gap-3 px-2.5 py-2 text-sm rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors [&.active]:bg-indigo-600 [&.active]:text-white"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-5 py-3 text-xs border-t border-slate-800 text-slate-500">
          edshimaj@gmail.com
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-screen-2xl mx-auto px-6 py-6">{children}</div>
      </main>
    </div>
  )
}
