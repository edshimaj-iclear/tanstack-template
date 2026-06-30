import { useState } from "react";
import { X } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { DEAL_STAGES, type DealStage } from "../../crm/constants";
import { PrimaryButton } from "./ui";

const splitList = (s: string) =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

export function DealFormModal({
  open,
  onClose,
  accountId,
  defaultStage,
}: {
  open: boolean;
  onClose: () => void;
  accountId?: Id<"accounts">;
  defaultStage?: DealStage;
}) {
  const create = useMutation(api.deals.create);
  const accounts = useQuery(api.accounts.list, {});
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    accountId: (accountId ?? "") as string,
    stage: (defaultStage ?? "lead") as DealStage,
    value: "",
    probability: "",
    expectedClose: "",
    products: "",
    competitor: "",
  });

  if (!open) return null;
  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await create({
        title: form.title.trim(),
        accountId: form.accountId
          ? (form.accountId as Id<"accounts">)
          : undefined,
        stage: form.stage,
        value: form.value ? Number(form.value) : undefined,
        probability: form.probability ? Number(form.probability) : undefined,
        expectedClose: form.expectedClose || undefined,
        products: form.products ? splitList(form.products) : undefined,
        competitor: form.competitor || undefined,
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
          <h2 className="text-lg font-semibold text-gray-900">
            Marrëveshje e re
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label className={label}>Titulli *</label>
            <input
              className={field}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="p.sh. Scanner intraoral + trajnim"
              autoFocus
            />
          </div>

          {!accountId && (
            <div>
              <label className={label}>Llogaria</label>
              <select
                className={field}
                value={form.accountId}
                onChange={(e) => set("accountId", e.target.value)}
              >
                <option value="">— Pa llogari —</option>
                {(accounts ?? []).map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Faza</label>
              <select
                className={field}
                value={form.stage}
                onChange={(e) => set("stage", e.target.value)}
              >
                {DEAL_STAGES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Vlera (€)</label>
              <input
                type="number"
                className={field}
                value={form.value}
                onChange={(e) => set("value", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Probabiliteti (0-100)</label>
              <input
                type="number"
                className={field}
                value={form.probability}
                onChange={(e) => set("probability", e.target.value)}
              />
            </div>
            <div>
              <label className={label}>Mbyllje e pritshme</label>
              <input
                type="date"
                className={field}
                value={form.expectedClose}
                onChange={(e) => set("expectedClose", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Produktet (ndaj me presje)</label>
              <input
                className={field}
                value={form.products}
                onChange={(e) => set("products", e.target.value)}
                placeholder="Scanner, Aligners"
              />
            </div>
            <div>
              <label className={label}>Konkurrenti</label>
              <input
                className={field}
                value={form.competitor}
                onChange={(e) => set("competitor", e.target.value)}
              />
            </div>
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
