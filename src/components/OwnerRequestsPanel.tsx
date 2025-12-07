"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

type RequestStatus = "PENDING" | "ACCEPTED" | "DECLINED";

interface Request {
  id: string;
  studentName: string | null;
  studentEmail: string;
  paymentMethod: string;
  proposedTime: string;
  proposedLocation: string | null;
  message: string | null;
  status: RequestStatus;
}

export function OwnerRequestsPanel({ requests }: { requests: Request[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const updateStatus = (id: string, status: RequestStatus) => {
    startTransition(async () => {
      const res = await fetch(`/api/course-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Impossible de mettre à jour la demande.");
        return;
      }

      router.refresh();
    });
  };

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 text-[11px] text-black/60">
        Aucune demande pour le moment.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 sm:p-4 shadow-lg">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#4A70A9] mb-2">
        Demandes ({requests.length})
      </p>
      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {requests.map((r) => (
          <div
            key={r.id}
            className="rounded-lg bg-[#EFECE3]/50 p-2 space-y-1"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[11px] text-[#000000] truncate">
                  {r.studentName ?? r.studentEmail}
                </p>
                <p className="text-[10px] text-black/60 truncate">{r.studentEmail}</p>
              </div>
              <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide whitespace-nowrap">
                {r.status === "PENDING" && "En attente"}
                {r.status === "ACCEPTED" && "Acceptée"}
                {r.status === "DECLINED" && "Refusée"}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px]">
              <div>
                <span className="font-semibold text-[#000000]">Paiement: </span>
                <span className="text-black/70">
                  {r.paymentMethod === "CASH" && "Espèce"}
                  {r.paymentMethod === "CARD" && "Carte"}
                  {r.paymentMethod === "EXCHANGE" && "Échange"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-[#000000]">Créneau: </span>
                <span className="text-black/70 truncate block">{r.proposedTime}</span>
              </div>
              {r.proposedLocation && (
                <div className="col-span-2">
                  <span className="font-semibold text-[#000000]">Lieu: </span>
                  <span className="text-black/70">{r.proposedLocation}</span>
                </div>
              )}
              {r.message && (
                <div className="col-span-2">
                  <span className="font-semibold text-[#000000]">Message: </span>
                  <span className="text-black/70 line-clamp-1">{r.message}</span>
                </div>
              )}
            </div>
            
            {r.status === "PENDING" && (
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => updateStatus(r.id, "ACCEPTED")}
                  className="flex-1 rounded-lg bg-[#4A70A9] px-2 py-1 text-[10px] font-semibold text-white hover:bg-[#8FABD4] disabled:opacity-60 transition-colors"
                >
                  Accepter
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => updateStatus(r.id, "DECLINED")}
                  className="flex-1 rounded-lg bg-red-100 px-2 py-1 text-[10px] font-semibold text-red-700 hover:bg-red-200 disabled:opacity-60 transition-colors"
                >
                  Refuser
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


