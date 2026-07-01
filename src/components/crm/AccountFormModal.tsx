import { useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import {
  ACCOUNT_TYPES,
  ACCOUNT_STATUSES,
  type AccountType,
  type AccountStatus,
} from "../../crm/constants";
import { PrimaryButton } from "./ui";

export type AccountInitial = {
  _id: Id<"accounts">;
  name: string;
  type: AccountType;
  status: AccountStatus;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  ownerName?: string;
  assignedRep?: string;
  annualPotential?: number;
  notes?: string;
};

const splitList = (s: string) =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

export function AccountFormModal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial?: AccountInitial;
}) {
  const create = useMutation(api.accounts.create);
  const update = useMutation(api.accounts.update);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    type: (initial?.type ?? "clinic") as AccountType,
    status: (initial?.status ?? "prospect") as AccountStatus,
    city: initial?.city ?? "",
    country: initial?.country ?? "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
    ownerName: initial?.ownerName ?? "",
    assignedRep: initial?.assignedRep ?? "",
    annualPotential: initial?.annualPotential?.toString() ?? "",
    specialties: "",
    equipment: "",
    notes: initial?.notes ?? "",
  });

  if (!open) return null;

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        type: form.type,
        status: form.status,
        city: form.city || undefined,
        country: form.country || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
        ownerName: form.ownerName || undefined,
        assignedRep: form.assignedRep || undefined,
        annualPotential: form.annualPotential
          ? Number(form.annualPotential)
          : undefined,
        specialties: form.specialties ? splitList(form.specialties) : undefined,
        equipment: form.equipment ? splitList(form.equipment) : undefined,
        notes: form.notes || undefined,
      };
      if (initial) {
        await update({ id: initial._id, ...payload });
      } else {
        await create(payload);
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const field =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const label = "mb-1 block text-xs font-medium text-gray-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {initial ? "Redakto llogarinë" : "Llogari e re"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label className={label}>Emri *</label>
            <input
              className={field}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="p.sh. Klinika Dentare Smile"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Lloji</label>
              <select
                className={field}
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
              >
                {ACCOUNT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Statusi</label>
              <select
                className={field}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {ACCOUNT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Qyteti</label>
              <input
                className={field}
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </div>
            <div>
              <label className={label}>Shteti</label>
              <input
                className={field}
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Telefon</label>
              <input
                className={field}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
            <div>
              <label className={label}>Email</label>
              <input
                className={field}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Pronari</label>
              <input
                className={field}
                value={form.ownerName}
                onChange={(e) => set("ownerName", e.target.value)}
              />
            </div>
            <div>
              <label className={label}>Përgjegjësi i shitjeve</label>
              <input
                className={field}
                value={form.assignedRep}
                onChange={(e) => set("assignedRep", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={label}>Potenciali vjetor (€)</label>
            <input
              type="number"
              className={field}
              value={form.annualPotential}
              onChange={(e) => set("annualPotential", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Specialitetet (ndaj me presje)</label>
              <input
                className={field}
                value={form.specialties}
                onChange={(e) => set("specialties", e.target.value)}
                placeholder="Ortodonci, Implantologji"
              />
            </div>
            <div>
              <label className={label}>Pajisjet (ndaj me presje)</label>
              <input
                className={field}
                value={form.equipment}
                onChange={(e) => set("equipment", e.target.value)}
                placeholder="Scanner, CBCT, Printer 3D"
              />
            </div>
          </div>

          <div>
            <label className={label}>Shënime</label>
            <textarea
              className={field}
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Anulo
            </button>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "Duke ruajtur…" : initial ? "Ruaj" : "Krijo"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
