# iClear QMS

**Medical Device Quality & Compliance Platform**

A premium, production-quality frontend prototype for an MDR / ISO 13485 Quality
Management System, built for the medical-device manufacturer **iClear** (clear
aligners, retainers, night guards).

> Quality is not a department. It is the system behind every smile.

## Stack

- **TanStack Start** (React 19, file-based routing) + Vite / Vinxi
- **TypeScript** (strict)
- **Tailwind CSS v4** — CSS-token design system (light + dark)
- **Recharts** — charts
- **TanStack Table** — advanced data tables
- **Radix UI** primitives + **shadcn-style** components
- **Lucide** icons, **cmdk** command palette, **Framer Motion**–ready animations
- **React Hook Form** + **Zod** available for forms

> Note: the brief specified Next.js; this repository is a TanStack Start
> template. Rather than tear out a working build toolchain, the prototype is
> built on TanStack Start — which provides the same essentials (App-Router-style
> file-based routing, TypeScript, SSR, Tailwind). All requested libraries are
> used. The architecture (typed models, mock services, reusable components)
> cleanly maps onto a future REST or Supabase backend.

Mock data only — no backend.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

The app opens on the **login page** (`/`); sign in (or "Skip to dashboard") to
enter the platform shell.

## Architecture

```
src/
  routes/            # file-based routes
    index.tsx        # login page (outside app shell)
    _app.tsx         # authenticated layout (sidebar + top nav)
    _app/*.tsx       # module pages (dashboard, risk, capa, …)
  components/
    ui/              # design-system primitives (button, card, badge, …)
    qms/             # domain components (MetricCard, RiskHeatmap, Timeline, …)
    charts/          # Recharts wrappers (SSR-safe)
    tables/          # DataTable (TanStack Table)
    layout/          # AppSidebar, TopNavigation, CommandPalette, AppShell
  data/              # typed mock data services
  types/             # domain models
  hooks/             # useTheme, useCountUp
  lib/               # utils, status mapping, navigation config
```

## Modules

Dashboard · Products & Detail · Technical Documentation · Document Control ·
Risk Management · CAPA · Nonconformities · Complaints & Vigilance · PMS & PMCF ·
Suppliers · Training · Audits · Management Review · Production Traceability &
Case Detail · Equipment · Regulatory Calendar · Reports · Administration.

## Design system

Turquoise/cyan brand accents on white / light-grey surfaces with deep-navy ink;
green (compliant), amber (warning), red (critical), violet (regulatory). Light
theme primary with an optional dark mode (toggle in the top bar). Generous
spacing, rounded cards, soft borders, subtle shadows, animated counters,
progress rings, command palette (⌘K), slide-over detail panels.
