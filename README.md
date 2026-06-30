# iClear QMS

Sistemi i Menaxhimit të Cilësisë për prodhimin e aligner-ve — full-stack (Next.js + Prisma).
Çdo rast ndjek rrjedhën **Pranim → Dizajn → Printim → Termoformim → QC → Dërgesë** me një histori të plotë dixhitale (DHR) dhe gjurmueshmëri të plotë.

## Tech stack
- **Next.js 14** (App Router, Server Actions, TypeScript)
- **Prisma ORM** — SQLite në dev, Postgres në prodhim (ndryshim me 1 rresht)
- **Tailwind CSS** — sistem dizajni klinik
- Autentikim me sesion (cookie httpOnly, role-based)

## Si ta nisësh lokalisht

```bash
npm install
cp .env.example .env          # ose përdor .env ekzistues
npx prisma db push            # krijon bazën SQLite + tabelat
npm run db:seed               # mbush me të dhëna demo
npm run dev                   # http://localhost:3000
```

> Shënim: `prisma generate` shkarkon engine-t e Prisma-s nga `binaries.prisma.sh`.
> Sigurohu që makina/serveri ka akses në internet (firewall i hapur për këtë host).

**Hyrja demo:** `admin@iclear.al` / `iclear123`
(përdorues të tjerë: `tech@`, `op1@`, `op2@`, `qc@`, `sales@iclear.al` — i njëjti fjalëkalim)

## Kalimi në prodhim (Postgres)
Në `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"   // ishte "sqlite"
  url      = env("DATABASE_URL")
}
```
Vendos `DATABASE_URL` te një Postgres i menaxhuar (Neon / Supabase / Railway), pastaj:
```bash
npx prisma db push && npm run db:seed
```

## Deploy (host + domain)
- **Vercel + Neon (Postgres):** push në GitHub → import në Vercel → shto `DATABASE_URL` dhe `SESSION_SECRET` → lidh domain-in. (Përdor Postgres, jo SQLite, në serverless.)
- **VPS (Docker/Node):** `npm run build && npm start` pas konfigurimit të `.env`. SQLite ose Postgres të dyja punojnë.
- Gjenero një `SESSION_SECRET` të fortë: `openssl rand -base64 32`

## Struktura
```
src/
  app/
    login/                 # hyrja
    (app)/                 # zona e autentikuar (sidebar + header)
      dashboard/           # Moduli 6 — KPI
      cases/               # Moduli 1 — Pranim + DHR + gjurmueshmëri
      production/          # Moduli 2 — Linja e prodhimit (parametra për fazë)
      qc/                  # Modulet 13–14 — QC Final + lëshim me firmë
      shipping/            # Dërgesat + tracking
      capa/                # Moduli 7 — CAPA (me detaj/rrjedhë)
      complaints/          # Moduli 15 — Ankesat (→ CAPA)
      risk/                # Moduli 8 — Regjistri i riskut + matricë 5×5
      audits/              # Moduli 16 — Auditimet
      management-review/   # Moduli 17 — Rishikimi i menaxhimit
      suppliers/           # Modulet 11–12 — Furnitorë, materiale, lot-e
      equipment/           # Moduli 10 — Pajisjet (IQ/OQ/PQ, kalibrim)
      training/            # Moduli 9 — Matrica e trajnimeve
      documents/           # Moduli 4 — Dokumentet (SOP) me versionim
  components/              # UI të përbashkëta + sidebar
  lib/                     # db, auth, constants, utils
prisma/
  schema.prisma           # modeli i plotë i të dhënave (të 18 modulet)
  seed.ts                 # të dhëna demo
```

## Rrjedha e ndërtimit (modul pas moduli)

| # | Moduli | Statusi |
|---|--------|---------|
| 1 | Pranim / Rastet + DHR + Gjurmueshmëri | ✅ Gati |
| 2 | Linja e prodhimit (parametra: printim, termoformim, lazer) | ✅ Gati |
| 4 | Dokumentet (QM/SOP/WI/FRM) me versionim | ✅ Gati |
| 6 | Paneli / KPI | ✅ Gati |
| 7 | CAPA | ✅ Gati |
| 8 | Menaxhimi i riskut + matricë 5×5 | ✅ Gati |
| 9 | Matrica e trajnimeve | ✅ Gati |
| 10 | Pajisjet (IQ/OQ/PQ, kalibrim, mirëmbajtje) | ✅ Gati |
| 11/12 | Furnitorët, materialet & lot-et + inspektim hyrës | ✅ Gati |
| 13/14 | QC në proces + QC Final me nënshkrim elektronik (role-gated) | ✅ Gati |
| 15 | Ankesat (→ përshkallëzim në CAPA) | ✅ Gati |
| 16 | Auditimet e brendshme | ✅ Gati |
| 17 | Management Review (fotografim KPI) | ✅ Gati |
| — | Dërgesat + tracking (role-gated) | ✅ Gati |
| — | Autentikim & role | ✅ Gati |
| 5 | Gjurmueshmëri e plotë (zinxhir në çdo rast) | ✅ Gati |
| 18 | DHR dixhital + audit trail (21 CFR Part 11) | ✅ Gati |

Të 18 modulet janë funksionale mbi një model të vetëm të dhënash.
Rrjedha end-to-end: **Rast → Linjë prodhimi → QC Final (firmë) → Paketim → Dërgesë**,
me CAPA, ankesa, risk, auditim dhe rishikim menaxhimi që mbështesin cilësinë.
