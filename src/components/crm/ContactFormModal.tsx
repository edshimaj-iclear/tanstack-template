import { useState } from "react";
import { X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { PrimaryButton } from "./ui";

const splitList = (s: string) =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

export function ContactFormModal({
  open,
  onClose,
  accountId,
}: {
  open: boolean;
  onClose: () => void;
  accountId?: Id<"accounts">;
}) {
  const create = useMutation(api.contacts.create);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    title: "",
    decisionPower: "",
    email: "",
    phone: "",
    whatsapp: "",
    linkedin: "",
    disc: "",
    interests: "",
    notes: "",
  });

  if (!open) return null;
  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim()) return;
    setSaving(true);
    try {
      await create({
        accountId,
        firstName: form.firstName.trim(),
        lastName: form.lastName || undefined,
        title: form.title || undefined,
        decisionPower: form.decisionPower
          ? Number(form.decisionPower)
          : undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        whatsapp: form.whatsapp || undefined,
        linkedin: form.linkedin || undefined,
        disc: form.disc || undefined,
        interests: form.interests ? splitList(form.interests) : undefined,
        notes: form.notes || undefined,
      });
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
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Kontakt i ri</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Emri *</label>
              <input
                className={field}
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className={label}>Mbiemri</label>
              <input
                className={field}
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Roli / Titulli</label>
              <input
                className={field}
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Pronar, Dentist…"
              />
            </div>
            <div>
              <label className={label}>Fuqia vendimmarrëse (0-100)</label>
              <input
                type="number"
                className={field}
                value={form.decisionPower}
                onChange={(e) => set("decisionPower", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Email</label>
              <input
                className={field}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
            <div>
              <label className={label}>Telefon</label>
              <input
                className={field}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>WhatsApp</label>
              <input
                className={field}
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value)}
              />
            </div>
            <div>
              <label className={label}>DISC</label>
              <input
                className={field}
                value={form.disc}
                onChange={(e) => set("disc", e.target.value)}
                placeholder="D / I / S / C"
              />
            </div>
          </div>
          <div>
            <label className={label}>Interesat (ndaj me presje)</label>
            <input
              className={field}
              value={form.interests}
              onChange={(e) => set("interests", e.target.value)}
              placeholder="Digital workflow, AI, Kirurgji"
            />
          </div>
          <div>
            <label className={label}>Shënime</label>
            <textarea
              className={field}
              rows={2}
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
              {saving ? "Duke ruajtur…" : "Krijo"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
