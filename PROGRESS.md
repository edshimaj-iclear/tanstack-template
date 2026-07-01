# HCIP — Healthcare CRM · Progresi i ndërtimit

Ky skedar është "kujtesa" e lakut autonom. Çdo iteracion: lexo këtu → zgjidh detyrën e radhës `[ ]` → implemento → `npx convex codegen` + `npx tsc --noEmit` (duhet 0 gabime) → commit + push në degën `claude/healthcare-crm-architecture-bydatk` (përditëson PR #1) → shëno `[x]` këtu me një rresht përmbledhës.

## Rregulla pune
- Gjuha e UI-së: **shqip**. Stack: TanStack Start + Convex + Anthropic SDK + Tailwind v4.
- Mos hap PR të ri — përdor degën/PR-in #1 ekzistues.
- Çdo commit duhet të kalojë typecheck. Nëse një ndryshim s'rregullohet dot brenda iteracionit, ktheje mbrapsht (`git checkout`) dhe shëno bllokimin te "Log".
- Ndiq modelet ekzistuese: `convex/*.ts` për funksione, `src/routes/*` për faqe, `src/components/crm/*` për UI, etiketat te `src/crm/constants.ts`.
- Pas çdo moduli të ri: shto lidhjen në sidebar (`CrmShell.tsx`) dhe te `convex/seed.ts` ca të dhëna demo.

## Statusi i moduleve

### Faza 1 — Bërthama ✅
- [x] Accounts (CRUD, filtra, detaj, scoring)
- [x] Contacts (CRUD, fuqia vendimmarrëse)
- [x] Deals / Pipeline (kanban drag & drop, forecast)
- [x] Asistenti AI te `/assistant`

### Faza 2 — Rregullatore & Produkte
- [ ] **Modul 4 — Product Registry**: tabela `products` (emër, kategori, prodhues, UDI, lot, skadenca, klasa MDR, CE, IFU, risk class). Faqe `/products` listë + formular + filtra.
- [ ] **Modul 5 — MDR Compliance**: tabela `complaints`/`capa` me cikël (Complaint → Adverse Event → Corrective Action → Recall → FSCA → CAPA → Vigilance → Closure). Faqe `/compliance` me board statusesh. Lidh me `products` (lot traceability).

### Faza 3 — Operacione në terren
- [ ] **Modul 8 — Field Sales**: tabela `visits` (account, check-in/out, data, shënime, produkte të prezantuara, konkurrent i gjetur, mostër, vizita e radhës). Faqe `/visits`.
- [ ] **Modul 7 — Education**: tabela `courses` + `enrollments` (kurs, pjesëmarrës=contact, status, certifikatë, skadenca). Faqe `/education`.

### Faza 4 — Inteligjenca (AI)
- [ ] **Llogaritje automatike e scores**: action/mutation që përditëson `accounts.scores` (relationshipHealth, risk, growth) nga porositë/edukimi/komunikimi.
- [ ] **AI Opportunity Discovery**: action me Anthropic SDK që analizon një account (produkte të blera vs jo) → mundësi + score. Buton në detajin e account-it.
- [ ] **AI Churn Risk**: action që vlerëson rrezikun e largimit + arsyet. Tregues në dashboard.
- [ ] **AI Sales Coach**: briefing para takimit nga historiku i account-it.

### Faza 5 — Analitika
- [ ] **CEO Dashboard**: grafikë (revenue, pipeline sipas fazës, win rate, aktiviteti), Territory heatmap.

## Log i vendimeve / bllokimeve
- 2026-06-30: Faza 1 e mbyllur dhe PR #1 hapur. CI (Netlify preview) success. Nisi laku autonom i natës.
