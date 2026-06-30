"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string; soon?: boolean };
type Group = { title: string; items: Item[] };

const groups: Group[] = [
  {
    title: "Përmbledhje",
    items: [
      { href: "/dashboard", label: "Paneli" },
    ],
  },
  {
    title: "Prodhimi",
    items: [
      { href: "/cases", label: "Rastet (Pranim)" },
      { href: "/production", label: "Linja e Prodhimit" },
      { href: "/qc", label: "Kontroll Cilësie" },
      { href: "/shipping", label: "Dërgesat" },
    ],
  },
  {
    title: "Cilësia",
    items: [
      { href: "/capa", label: "CAPA" },
      { href: "/complaints", label: "Ankesat" },
      { href: "/risk", label: "Menaxhimi i Riskut" },
      { href: "/audits", label: "Auditimet" },
      { href: "/management-review", label: "Rishikimi i Menaxhimit" },
    ],
  },
  {
    title: "Burimet",
    items: [
      { href: "/suppliers", label: "Furnitorët & Lot-et" },
      { href: "/equipment", label: "Pajisjet" },
      { href: "/training", label: "Trajnimet" },
      { href: "/documents", label: "Dokumentet (SOP)" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 shrink-0 border-r border-line bg-surface min-h-screen sticky top-0 hidden md:flex md:flex-col">
      <div className="px-5 h-16 flex items-center border-b border-line">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-clinic-500 text-white font-display font-bold text-sm">iC</span>
          <span className="font-display font-semibold tracking-tight">iClear<span className="text-clinic-500"> QMS</span></span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {groups.map((g) => (
          <div key={g.title}>
            <div className="label px-2 mb-1.5">{g.title}</div>
            <div className="space-y-0.5">
              {g.items.map((it) => {
                const active = pathname === it.href || pathname.startsWith(it.href + "/");
                return (
                  <Link
                    key={it.href}
                    href={it.soon ? "#" : it.href}
                    className={`group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                      active ? "bg-clinic-50 text-clinic-700 font-medium" : "text-muted hover:bg-canvas hover:text-ink"
                    } ${it.soon ? "pointer-events-none opacity-55" : ""}`}
                  >
                    <span>{it.label}</span>
                    {it.soon && <span className="text-[10px] font-mono uppercase tracking-wide text-faint">së shpejti</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="px-4 py-3 border-t border-line text-[11px] text-faint font-mono">
        v0.1 · ISO 13485 ready
      </div>
    </aside>
  );
}
