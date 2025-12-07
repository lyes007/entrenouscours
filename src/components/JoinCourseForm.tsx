"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type PaymentMethod = "CASH" | "CARD" | "EXCHANGE";

export function JoinCourseForm({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [proposedTime, setProposedTime] = useState("");
  const [proposedLocation, setProposedLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}/requests`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethod,
            proposedTime,
            proposedLocation,
            contactEmail,
            message,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setError(data.error || "Impossible d'envoyer la demande.");
          return;
        }

        setSuccess(
          "Ta demande a bien été envoyée. Tu recevras une réponse de l'enseignant par email.",
        );
        setMessage("");
        router.refresh();
      } catch (err: any) {
        setError(err.message || "Erreur inconnue lors de l'envoi de la demande.");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 sm:p-4 shadow-lg space-y-2"
    >
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[#4A70A9] mb-2">
        Rejoindre ce cours
      </h3>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-medium text-[#000000] mb-0.5">
            Paiement
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className="w-full rounded-lg border border-black/10 bg-white px-2 py-1 text-[11px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
          >
            <option value="CASH">Espèce</option>
            <option value="CARD">Carte</option>
            <option value="EXCHANGE">Échange</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-[#000000] mb-0.5">
            Email *
          </label>
          <input
            type="email"
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-white px-2 py-1 text-[11px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
            placeholder="email@ex.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-medium text-[#000000] mb-0.5">
          Créneau proposé *
        </label>
        <input
          type="text"
          required
          value={proposedTime}
          onChange={(e) => setProposedTime(e.target.value)}
          className="w-full rounded-lg border border-black/10 bg-white px-2 py-1 text-[11px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
          placeholder="Ex: Samedi 15h-17h"
        />
      </div>

      <div>
        <label className="block text-[10px] font-medium text-[#000000] mb-0.5">
          Lieu (si présentiel)
        </label>
        <input
          type="text"
          value={proposedLocation}
          onChange={(e) => setProposedLocation(e.target.value)}
          className="w-full rounded-lg border border-black/10 bg-white px-2 py-1 text-[11px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
          placeholder="Ex: Bibliothèque, café..."
        />
      </div>

      <div>
        <label className="block text-[10px] font-medium text-[#000000] mb-0.5">
          Message (optionnel)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-black/10 bg-white px-2 py-1 text-[11px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20 resize-none"
          placeholder="Présente-toi rapidement..."
        />
      </div>

      {error && <p className="text-[10px] text-red-600">{error}</p>}
      {success && <p className="text-[10px] text-green-700">{success}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-[#4A70A9] px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-[#8FABD4] disabled:opacity-60 transition-colors"
      >
        {isPending ? "Envoi..." : "Envoyer la demande"}
      </button>
    </form>
  );
}


