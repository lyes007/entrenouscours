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
      className="space-y-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
    >
      <h3 className="text-sm font-semibold uppercase tracking-wide text-[#4A70A9]">
        Demander à rejoindre ce cours
      </h3>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-[#000000]">
            Mode de paiement souhaité
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className="mt-1 w-full ui-select"
          >
            <option value="CASH">Espèce</option>
            <option value="CARD">Carte</option>
            <option value="EXCHANGE">Échange de services</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#000000]">
            Email de contact
          </label>
          <input
            type="email"
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-black/10 bg-[#EFECE3]/60 px-3 py-1.5 text-xs outline-none focus:border-[#4A70A9] focus:bg-white"
            placeholder="ton.email@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#000000]">
          Proposition de créneau / horaire
        </label>
        <input
          type="text"
          required
          value={proposedTime}
          onChange={(e) => setProposedTime(e.target.value)}
          className="mt-1 w-full rounded-xl border border-black/10 bg-[#EFECE3]/60 px-3 py-1.5 text-xs outline-none focus:border-[#4A70A9] focus:bg-white"
          placeholder="Ex : Samedi 15h-17h, ou soir en semaine après 19h"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#000000]">
          Lieu proposé (si présentiel ou flexible)
        </label>
        <input
          type="text"
          value={proposedLocation}
          onChange={(e) => setProposedLocation(e.target.value)}
          className="mt-1 w-full rounded-xl border border-black/10 bg-[#EFECE3]/60 px-3 py-1.5 text-xs outline-none focus:border-[#4A70A9] focus:bg-white"
          placeholder="Ex : bibliothèque de la fac, café calme au centre-ville..."
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#000000]">
          Message pour l&apos;enseignant (optionnel)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-xl border border-black/10 bg-[#EFECE3]/60 px-3 py-1.5 text-xs outline-none focus:border-[#4A70A9] focus:bg-white"
          placeholder="Présente-toi rapidement, précise ton niveau et tes attentes..."
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {success && <p className="text-xs text-green-700">{success}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-[#4A70A9] px-5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#8FABD4] disabled:opacity-60"
      >
        {isPending ? "Envoi en cours..." : "Envoyer la demande"}
      </button>
    </form>
  );
}


