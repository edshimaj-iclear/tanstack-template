import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { CrmShell, ConvexNotice } from "../components/crm/CrmShell";
import { PrimaryButton } from "../components/crm/ui";
import { DealFormModal } from "../components/crm/DealFormModal";
import {
  isConvexAvailable,
  PIPELINE_COLUMNS,
  dealStageLabel,
  formatCurrency,
  type DealStage,
} from "../crm/constants";

function Pipeline() {
  const deals = isConvexAvailable ? useQuery(api.deals.list, {}) : undefined;
  const accounts = isConvexAvailable ? useQuery(api.accounts.list, {}) : undefined;
  const setStage = useMutation(api.deals.setStage);

  const [modalOpen, setModalOpen] = useState(false);
  const [dragId, setDragId] = useState<Id<"deals"> | null>(null);
  const [overCol, setOverCol] = useState<DealStage | null>(null);

  const accountName = (id?: string) =>
    accounts?.find((a) => a._id === id)?.name;

  const dealsByStage = (stage: DealStage) =>
    (deals ?? []).filter((d) => d.stage === stage);

  const columnTotal = (stage: DealStage) =>
    dealsByStage(stage).reduce((s, d) => s + (d.value || 0), 0);

  const handleDrop = async (stage: DealStage) => {
    if (dragId) {
      await setStage({ id: dragId, stage });
    }
    setDragId(null);
    setOverCol(null);
  };

  return (
    <CrmShell
      title="Pipeline"
      subtitle="Cikli i shitjeve — tërhiq kartat për të ndryshuar fazën"
      actions={
        isConvexAvailable && (
          <PrimaryButton onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" /> Marrëveshje e re
          </PrimaryButton>
        )
      }
    >
      <ConvexNotice />

      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_COLUMNS.map((stage) => {
          const items = dealsByStage(stage);
          return (
            <div
              key={stage}
              onDragOver={(e) => {
                e.preventDefault();
                setOverCol(stage);
              }}
              onDrop={() => handleDrop(stage)}
              className={`flex w-72 flex-shrink-0 flex-col rounded-xl border ${
                overCol === stage
                  ? "border-indigo-400 bg-indigo-50/50"
                  : "border-gray-200 bg-gray-100/60"
              }`}
            >
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-sm font-semibold text-gray-700">
                  {dealStageLabel(stage)}
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-500">
                  {items.length}
                </span>
              </div>
              <div className="px-3 pb-1 text-xs text-gray-400">
                {formatCurrency(columnTotal(stage))}
              </div>

              <div className="flex-1 space-y-2 p-2">
                {items.map((d) => (
                  <div
                    key={d._id}
                    draggable
                    onDragStart={() => setDragId(d._id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverCol(null);
                    }}
                    className="cursor-grab rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow active:cursor-grabbing"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {d.title}
                    </p>
                    {d.accountId && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {accountName(d.accountId)}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        {formatCurrency(d.value)}
                      </span>
                      {d.probability != null && (
                        <span className="text-xs text-gray-400">
                          {d.probability}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="rounded-lg border border-dashed border-gray-300 py-6 text-center text-xs text-gray-400">
                    Bosh
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isConvexAvailable && (
        <DealFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
      )}
    </CrmShell>
  );
}

export const Route = createFileRoute("/pipeline")({
  component: Pipeline,
});
