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
      <div className="rounded-2xl border border-black/5 bg-white p-4 text-xs text-black/60">
        Aucune demande pour le moment.
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-black/5 bg-white p-4 text-xs text-black/80">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#4A70A9]">
        Demandes reçues
      </p>
      <div className="space-y-3">
        {requests.map((r) => (
          <div
            key={r.id}
            className="rounded-xl bg-[#EFECE3]/50 p-3"
          >
            <p className="font-semibold text-[#000000]">
              {r.studentName ?? r.studentEmail}
            </p>
            <p className="text-[11px] text-black/60">{r.studentEmail}</p>
            <p className="mt-1">
              <span className="font-semibold">Paiement :</span>{" "}
              {r.paymentMethod === "CASH" && "Espèce"}
              {r.paymentMethod === "CARD" && "Carte"}
              {r.paymentMethod === "EXCHANGE" && "Échange de services"}
            </p>
            <p className="mt-1">
              <span className="font-semibold">Créneau proposé :</span>{" "}
              {r.proposedTime}
            </p>
            {r.proposedLocation && (
              <p className="mt-1">
                <span className="font-semibold">Lieu proposé :</span>{" "}
                {r.proposedLocation}
              </p>
            )}
            {r.message && (
              <p className="mt-1">
                <span className="font-semibold">Message :</span> {r.message}
              </p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                {r.status === "PENDING" && "En attente"}
                {r.status === "ACCEPTED" && "Acceptée"}
                {r.status === "DECLINED" && "Refusée"}
              </span>
              {r.status === "PENDING" && (
                <>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => updateStatus(r.id, "ACCEPTED")}
                    className="rounded-full bg-[#4A70A9] px-2.5 py-0.5 text-[10px] font-semibold text-white hover:bg-[#8FABD4] disabled:opacity-60"
                  >
                    Accepter
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => updateStatus(r.id, "DECLINED")}
                    className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-semibold text-red-700 hover:bg-red-200 disabled:opacity-60"
                  >
                    Refuser
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


