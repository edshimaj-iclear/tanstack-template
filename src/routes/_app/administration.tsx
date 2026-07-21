import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  ShieldCheck,
  Building2,
  Workflow,
  ScrollText,
  Settings as SettingsIcon,
  Search,
  UserPlus,
  Crown,
  Lock,
  CheckCircle2,
  FileSignature,
  Bell,
  KeyRound,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { PageHeader, SectionHeading } from "../../components/qms/PageHeader";
import { Timeline } from "../../components/qms/Timeline";
import type { TimelineItem } from "../../components/qms/Timeline";
import { LabeledValue, MetaGrid } from "../../components/qms/LabeledValue";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Avatar, Switch, Separator } from "../../components/ui/misc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { TEAM, DEPARTMENTS } from "../../data/team";
import { formatDate, cn } from "../../lib/utils";

export const Route = createFileRoute("/_app/administration")({
  component: AdministrationPage,
});

/* ---------- Mock admin data (local to this module) ---------- */

const ROLE_TONE: Record<string, "brand" | "regulatory" | "info" | "warning" | "success" | "neutral"> = {
  CEO: "brand",
  "Quality Manager": "brand",
  "Regulatory Affairs": "regulatory",
  PRRC: "regulatory",
  "Clinical Manager": "info",
  "Production Manager": "info",
  "Quality Control": "info",
  "Design Team": "info",
  Warehouse: "neutral",
  HR: "neutral",
  "Internal Auditor": "warning",
  "External Auditor": "warning",
  "Notified Body Read-Only": "success",
};

const PERMISSIONS = ["View", "Edit", "Approve", "Sign"] as const;

interface RoleDef {
  name: string;
  description: string;
  members: number;
  perms: Record<(typeof PERMISSIONS)[number], boolean>;
}

const ROLES: RoleDef[] = [
  { name: "CEO", description: "Full oversight of the quality system, management review and strategic decisions.", members: 1, perms: { View: true, Edit: true, Approve: true, Sign: true } },
  { name: "Quality Manager", description: "Owns the QMS, approves SOPs, CAPAs and non-conformities.", members: 1, perms: { View: true, Edit: true, Approve: true, Sign: true } },
  { name: "Regulatory Affairs", description: "Manages technical documentation, MDR submissions and vigilance.", members: 2, perms: { View: true, Edit: true, Approve: true, Sign: false } },
  { name: "PRRC", description: "Person Responsible for Regulatory Compliance per MDR Article 15.", members: 1, perms: { View: true, Edit: true, Approve: true, Sign: true } },
  { name: "Clinical Manager", description: "Reviews treatment plans, clinical evaluation and PMCF.", members: 1, perms: { View: true, Edit: true, Approve: true, Sign: false } },
  { name: "Production Manager", description: "Oversees printing, thermoforming and device release.", members: 1, perms: { View: true, Edit: true, Approve: false, Sign: false } },
  { name: "Quality Control", description: "Executes inspections, records QC results and holds non-conforming product.", members: 1, perms: { View: true, Edit: true, Approve: false, Sign: false } },
  { name: "Design Team", description: "Prepares aligner designs and treatment setups for approval.", members: 1, perms: { View: true, Edit: true, Approve: false, Sign: false } },
  { name: "Warehouse", description: "Manages material lots, storage conditions and dispatch.", members: 1, perms: { View: true, Edit: true, Approve: false, Sign: false } },
  { name: "HR", description: "Maintains training records, competency and personnel files.", members: 1, perms: { View: true, Edit: true, Approve: false, Sign: false } },
  { name: "Internal Auditor", description: "Plans and executes internal audits of the quality system.", members: 1, perms: { View: true, Edit: true, Approve: false, Sign: false } },
  { name: "External Auditor", description: "Time-boxed access for external audit activities and evidence review.", members: 0, perms: { View: true, Edit: false, Approve: false, Sign: false } },
  { name: "Notified Body Read-Only", description: "Read-only access granted to the notified body for surveillance.", members: 0, perms: { View: true, Edit: false, Approve: false, Sign: false } },
];

const DEPT_HEADS: Record<string, string> = {
  "Regulatory Affairs": "Genti Hoxha",
  Quality: "Anila Berisha",
  Design: "Fatjon Rama",
  Printing: "Fatjon Rama",
  Thermoforming: "Ilir Prifti",
  Cutting: "Erisa Kola",
  Polishing: "Ilir Prifti",
  "Quality Control": "Erisa Kola",
  Packaging: "Xheni Vata",
  Warehouse: "Xheni Vata",
  Logistics: "Xheni Vata",
  "Human Resources": "Anila Berisha",
};

const DEPT_MEMBERS: Record<string, number> = {
  "Regulatory Affairs": 2,
  Quality: 3,
  Design: 4,
  Printing: 5,
  Thermoforming: 6,
  Cutting: 4,
  Polishing: 3,
  "Quality Control": 4,
  Packaging: 3,
  Warehouse: 3,
  Logistics: 2,
  "Human Resources": 2,
};

const USER_ROLE: Record<string, string> = {
  "U-001": "CEO",
  "U-002": "Quality Manager",
  "U-003": "PRRC",
  "U-004": "Regulatory Affairs",
  "U-005": "Production Manager",
  "U-006": "Quality Control",
  "U-007": "Clinical Manager",
  "U-008": "Internal Auditor",
  "U-009": "Design Team",
  "U-010": "Warehouse",
};

const LAST_LOGIN: Record<string, string> = {
  "U-001": "2026-07-21T08:12:00Z",
  "U-002": "2026-07-21T07:45:00Z",
  "U-003": "2026-07-20T16:30:00Z",
  "U-004": "2026-07-21T09:02:00Z",
  "U-005": "2026-07-21T06:58:00Z",
  "U-006": "2026-07-20T15:10:00Z",
  "U-007": "2026-07-19T11:20:00Z",
  "U-008": "2026-07-18T14:05:00Z",
  "U-009": "2026-07-21T08:40:00Z",
  "U-010": "2026-07-20T17:22:00Z",
};

const WORKFLOWS = [
  { name: "Document approval", trigger: "New SOP / WI version", steps: ["Author", "Review", "QA Approval", "Effective"], sla: "5 business days", status: "Active" },
  { name: "CAPA lifecycle", trigger: "CAPA raised", steps: ["Investigation", "Action Plan", "Implementation", "Effectiveness Check", "Closure"], sla: "30 days", status: "Active" },
  { name: "Non-conformity disposition", trigger: "NCR created", steps: ["Segregation", "Disposition", "QC Verify", "Release"], sla: "3 days", status: "Active" },
  { name: "Device release", trigger: "QC pass", steps: ["QC Review", "Release Authorisation", "Dispatch"], sla: "1 day", status: "Active" },
  { name: "Change control", trigger: "Change request", steps: ["Impact Assessment", "Approval", "Implementation", "Verification"], sla: "14 days", status: "Draft" },
];

const AUDIT_EVENTS: TimelineItem[] = [
  { title: "Role permissions updated — External Auditor granted read access", time: "Today · 09:14", description: "Scoped to audit AUD-2026-006, expires 2026-08-15.", actor: "Anila Berisha", tone: "warning", icon: <ShieldCheck /> },
  { title: "New user provisioned — Marsela Doda", time: "Today · 09:02", description: "Assigned Regulatory Affairs role.", actor: "Anila Berisha", tone: "success", icon: <UserPlus /> },
  { title: "SOP-QMS-005 approved and set effective", time: "Yesterday · 16:30", description: "Electronic signature applied (21 CFR Part 11).", actor: "Genti Hoxha", tone: "brand", icon: <FileSignature /> },
  { title: "Two-factor authentication enforced org-wide", time: "20 Jul · 10:05", description: "System setting changed by administrator.", actor: "Edison Shimaj", tone: "regulatory", icon: <KeyRound /> },
  { title: "Failed login attempt blocked", time: "19 Jul · 22:41", description: "3 attempts from unrecognised device — account locked.", actor: "System", tone: "danger", icon: <Lock /> },
  { title: "Workflow updated — CAPA effectiveness check SLA changed", time: "18 Jul · 13:20", description: "SLA adjusted to 30 days.", actor: "Anila Berisha", tone: "info", icon: <Workflow /> },
];

function AdministrationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="System"
        title="Administration"
        subtitle="Manage users, roles, permissions, departments and system-wide configuration for the iClear QMS."
        actions={
          <Button>
            <UserPlus className="size-4" /> Invite user
          </Button>
        }
      />

      <Tabs defaultValue="users">
        <TabsList className="flex-wrap">
          <TabsTrigger value="users"><Users /> Users & Roles</TabsTrigger>
          <TabsTrigger value="roles"><ShieldCheck /> Roles & Permissions</TabsTrigger>
          <TabsTrigger value="departments"><Building2 /> Departments</TabsTrigger>
          <TabsTrigger value="workflows"><Workflow /> Workflows</TabsTrigger>
          <TabsTrigger value="audit"><ScrollText /> Audit Trail</TabsTrigger>
          <TabsTrigger value="settings"><SettingsIcon /> System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        <TabsContent value="roles">
          <RolesTab />
        </TabsContent>
        <TabsContent value="departments">
          <DepartmentsTab />
        </TabsContent>
        <TabsContent value="workflows">
          <WorkflowsTab />
        </TabsContent>
        <TabsContent value="audit">
          <AuditTab />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <Badge tone={ROLE_TONE[role] ?? "neutral"}>
      {role === "CEO" && <Crown className="size-3" />}
      {role}
    </Badge>
  );
}

function UsersTab() {
  const [q, setQ] = useState("");
  const filtered = TEAM.filter((u) =>
    `${u.name} ${u.email} ${USER_ROLE[u.id] ?? u.role} ${u.department}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Users & roles</CardTitle>
          <p className="text-sm text-fg-muted">{TEAM.length} active users</p>
        </div>
        <div className="relative w-full max-w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users…" className="pl-9" />
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-[var(--border-base)] bg-subtle text-[11px] uppercase tracking-wider text-fg-muted">
              <tr>
                <th className="px-5 py-2.5 text-left font-semibold">User</th>
                <th className="px-3 py-2.5 text-left font-semibold">Role</th>
                <th className="px-3 py-2.5 text-left font-semibold">Department</th>
                <th className="px-3 py-2.5 text-left font-semibold">Status</th>
                <th className="px-3 py-2.5 text-left font-semibold">Last login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-base)]">
              {filtered.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-subtle/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} size="sm" />
                      <div className="min-w-0">
                        <p className="font-medium text-fg">{u.name}</p>
                        <p className="text-xs text-fg-muted">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3"><RoleBadge role={USER_ROLE[u.id] ?? u.role} /></td>
                  <td className="px-3 py-3 text-fg-secondary">{u.department}</td>
                  <td className="px-3 py-3">
                    <Badge tone="success" dot>Active</Badge>
                  </td>
                  <td className="px-3 py-3 text-fg-secondary tabular-nums">
                    {formatDate(LAST_LOGIN[u.id], { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function RolesTab() {
  return (
    <div className="space-y-4">
      <SectionHeading
        title="Roles & permissions"
        description="13 QMS roles with a mock permission matrix. Toggle to preview access scopes."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {ROLES.map((role) => (
          <Card key={role.name} className="flex flex-col p-5">
            <div className="flex items-start justify-between gap-2">
              <RoleBadge role={role.name} />
              <span className="text-xs text-fg-muted">
                {role.members} {role.members === 1 ? "user" : "users"}
              </span>
            </div>
            <p className="mt-3 min-h-[40px] text-sm text-fg-secondary">{role.description}</p>
            <Separator className="my-4" />
            <div className="space-y-2.5">
              {PERMISSIONS.map((p) => (
                <div key={p} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-fg-secondary">
                    <Lock className="size-3.5 text-fg-muted" /> {p}
                  </span>
                  <Switch defaultChecked={role.perms[p]} disabled={role.name === "Notified Body Read-Only" && p !== "View"} />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DepartmentsTab() {
  return (
    <div className="space-y-4">
      <SectionHeading title="Departments" description={`${DEPARTMENTS.length} departments across the organisation`} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEPARTMENTS.map((dept) => (
          <Card key={dept} className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Building2 className="size-5" />
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-fg">{dept}</h3>
                <p className="text-xs text-fg-muted">{DEPT_MEMBERS[dept] ?? 2} members</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar name={DEPT_HEADS[dept] ?? "Anila Berisha"} size="xs" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-fg-muted">Head</p>
                  <p className="text-sm font-medium text-fg">{DEPT_HEADS[dept] ?? "Anila Berisha"}</p>
                </div>
              </div>
              <Badge tone="neutral">{DEPT_MEMBERS[dept] ?? 2}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WorkflowsTab() {
  return (
    <div className="space-y-4">
      <SectionHeading title="Workflows" description="Configured approval and lifecycle workflows across the QMS." />
      <div className="space-y-3">
        {WORKFLOWS.map((wf) => (
          <Card key={wf.name} className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Workflow className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-fg">{wf.name}</h3>
                    <Badge tone={wf.status === "Active" ? "success" : "neutral"} dot>{wf.status}</Badge>
                  </div>
                  <p className="text-xs text-fg-muted">Trigger: {wf.trigger} · SLA {wf.sla}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {wf.steps.map((step, i) => (
                  <span key={step} className="flex items-center gap-1.5">
                    <span className="rounded-lg bg-subtle px-2.5 py-1 text-xs font-medium text-fg-secondary">{step}</span>
                    {i < wf.steps.length - 1 && <ArrowRight className="size-3 text-fg-muted" />}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AuditTab() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Audit trail</CardTitle>
          <p className="text-sm text-fg-muted">Immutable log of system and security events</p>
        </div>
        <Badge tone="neutral"><ClipboardList className="size-3" /> 21 CFR Part 11</Badge>
      </CardHeader>
      <CardContent>
        <Timeline items={AUDIT_EVENTS} />
      </CardContent>
    </Card>
  );
}

interface SettingDef {
  key: string;
  label: string;
  description: string;
  icon: typeof Bell;
  on: boolean;
}

const SETTINGS: SettingDef[] = [
  { key: "email", label: "Email notifications", description: "Send email alerts for approvals, overdue tasks and escalations.", icon: Bell, on: true },
  { key: "2fa", label: "Two-factor authentication required", description: "Enforce 2FA for all users on every login.", icon: KeyRound, on: true },
  { key: "audit", label: "Audit logging", description: "Record all create, update and delete actions to the audit trail.", icon: ScrollText, on: true },
  { key: "esign", label: "Electronic signatures (21 CFR Part 11)", description: "Require e-signature with meaning for approvals and releases.", icon: FileSignature, on: true },
];

function SettingsTab() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>System settings</CardTitle>
          <p className="text-sm text-fg-muted">Compliance and security configuration</p>
        </CardHeader>
        <CardContent className="space-y-1">
          {SETTINGS.map((s, i) => (
            <div key={s.key}>
              <div className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-subtle text-fg-secondary">
                    <s.icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-fg">{s.label}</p>
                    <p className="text-xs text-fg-muted">{s.description}</p>
                  </div>
                </div>
                <Switch defaultChecked={s.on} />
              </div>
              {i < SETTINGS.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <MetaGrid cols={2}>
            <LabeledValue label="Organisation" value="iClear sh.p.k." />
            <LabeledValue label="QMS standard" value="ISO 13485:2016" />
            <LabeledValue label="Regulation" value="EU MDR 2017/745" />
            <LabeledValue label="SRN" value="AL-MF-000012345" mono />
            <LabeledValue label="Notified Body" value="TÜV SÜD (0123)" />
            <LabeledValue label="Plan" value="Enterprise" />
          </MetaGrid>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-sm text-emerald-800">
            <CheckCircle2 className="size-4 shrink-0" />
            All compliance controls are active and enforced.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
