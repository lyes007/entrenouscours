"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Header } from "@/components/Header";

type OfferType = "PAID" | "FREE" | "EXCHANGE";
type Modality = "ONLINE" | "IN_PERSON" | "FLEXIBLE";

export default function NewCoursePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    level: "",
    googleMeetUrl: "",
    offerType: "PAID" as OfferType,
    pricePerHour: "",
    modality: "ONLINE" as Modality,
    exchangeSubject: "",
  });

  const [slots, setSlots] = useState<
    { date: string; startTime: string; endTime: string; location: string; notes: string }[]
  >([
    { date: "", startTime: "", endTime: "", location: "", notes: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#EFECE3]">
        <Header />
        <main className="mx-auto max-w-lg px-6 py-12 animate-fade-in-up">
          <h1 className="text-2xl font-semibold text-[#000000]">
            Proposer une offre de cours
          </h1>
          <p className="mt-4 text-sm text-black/70">
            Tu dois être connecté avec ton compte Google pour publier un cours
            ou une offre d&apos;échange.
          </p>
          <button
            onClick={() => signIn("google")}
            className="mt-6 rounded-full bg-[#4A70A9] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] hover:bg-[#8FABD4]"
          >
            Se connecter avec Google
          </button>
        </main>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlotChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setSlots((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [name]: value };
      return copy;
    });
  };

  const addSlot = () => {
    setSlots((prev) => [...prev, { date: "", startTime: "", endTime: "", location: "", notes: "" }]);
  };

  const removeSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          pricePerHour:
            form.offerType === "PAID" && form.pricePerHour
              ? Number(form.pricePerHour)
              : null,
          exchangeSubject:
            form.offerType === "EXCHANGE" && form.exchangeSubject
              ? form.exchangeSubject
              : null,
          slots: slots
            .filter((s) => s.date && s.startTime)
            .map((s) => ({
              startTime: new Date(`${s.date}T${s.startTime}:00`).toISOString(),
              endTime: s.endTime
                ? new Date(`${s.date}T${s.endTime}:00`).toISOString()
                : null,
              location:
                form.modality === "IN_PERSON" || form.modality === "FLEXIBLE"
                  ? s.location
                  : null,
              notes: s.notes || null,
            })),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data.missingFields && Array.isArray(data.missingFields)) {
          setError(
            `Champs manquants : ${data.missingFields
              .map((f: string) => f)
              .join(", ")}`,
          );
        } else {
          setError(data.error || "Impossible de créer l'offre.");
        }
        return;
      }

      router.push("/courses");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Erreur inconnue lors de la création de l'offre.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFECE3]">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 animate-fade-in-up">
        <div className="mb-8 space-y-3">
        <p className="inline-flex rounded-full bg-[#8FABD4]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#4A70A9]">
          Étape 1 · Définis ton offre
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#000000]">
          Proposer une nouvelle offre de cours
        </h1>
        <p className="max-w-2xl text-sm text-black/70">
          Crée une annonce claire et attractive pour tes futurs apprenants :
          précise la matière, le niveau, le type d&apos;offre et ajoute
          plusieurs créneaux pour que les étudiants puissent s&apos;adapter à
          ton emploi du temps.
        </p>
        </div>

        <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm md:p-8"
        >
        {/* Bloc 1 : Informations générales */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#4A70A9]">
              1. Informations générales
            </h2>
            <p className="text-xs text-black/50">
              Ce que tu enseignes, à qui et comment tu présentes ton cours.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#000000]">
                Titre de l&apos;offre
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-black/10 bg-[#EFECE3]/60 px-3 py-2 text-sm outline-none focus:border-[#4A70A9] focus:bg-white"
                placeholder="Ex : Soutien en Maths Bac - révisions avant contrôle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#000000]">
                Matière / sujet
              </label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-black/10 bg-[#EFECE3]/60 px-3 py-2 text-sm outline-none focus:border-[#4A70A9] focus:bg-white"
                placeholder="Ex : Mathématiques, Anglais, Informatique..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#000000]">
                Niveau ciblé
              </label>
              <input
                name="level"
                value={form.level}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-black/10 bg-[#EFECE3]/60 px-3 py-2 text-sm outline-none focus:border-[#4A70A9] focus:bg-white"
                placeholder="Ex : 3ème, Bac, Licence 1..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#000000]">
              Description du cours
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 w-full rounded-2xl border border-black/10 bg-[#EFECE3]/60 px-3 py-2 text-sm outline-none focus:border-[#4A70A9] focus:bg-white"
              placeholder="Explique ce que tu proposes, ta manière d'enseigner, le format des séances (exercices, corrections, Q&A...)"
            />
          </div>
        </section>

        {/* Bloc 2 : Modalités & tarification */}
        <section className="space-y-4 border-t border-dashed border-black/10 pt-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#4A70A9]">
              2. Modalités & tarification
            </h2>
            <p className="text-xs text-black/50">
              Indique si ton cours est gratuit, payant ou basé sur un échange
              de compétences.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#000000]">
                Type d&apos;offre
              </label>
              <select
                name="offerType"
                value={form.offerType}
                onChange={handleChange}
                className="mt-1 w-full ui-select"
              >
                <option value="PAID">Payant</option>
                <option value="FREE">Gratuit</option>
                <option value="EXCHANGE">Échange de compétences</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#000000]">
                Modalité
              </label>
              <select
                name="modality"
                value={form.modality}
                onChange={handleChange}
                className="mt-1 w-full ui-select"
              >
                <option value="ONLINE">En ligne (Google Meet)</option>
                <option value="IN_PERSON">Présentiel</option>
                <option value="FLEXIBLE">Ouvert (en ligne ou présentiel)</option>
              </select>
            </div>
          </div>

          {form.offerType === "PAID" && (
            <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <label className="block text-sm font-medium text-[#000000]">
                  Prix horaire
                </label>
                <input
                  name="pricePerHour"
                  value={form.pricePerHour}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  className="mt-1 w-full rounded-xl border border-black/10 bg-[#EFECE3]/60 px-3 py-2 text-sm outline-none focus:border-[#4A70A9] focus:bg-white"
                  placeholder="Ex : 15"
                />
              </div>
              <p className="pb-1 text-xs font-medium text-black/60">
                Devise : <span className="font-semibold">TND / heure</span>
              </p>
            </div>
          )}

          {form.offerType === "EXCHANGE" && (
            <div>
              <label className="block text-sm font-medium text-[#000000]">
                Matière souhaitée en échange
              </label>
              <input
                name="exchangeSubject"
                value={form.exchangeSubject}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-black/10 bg-[#EFECE3]/60 px-3 py-2 text-sm outline-none focus:border-[#4A70A9] focus:bg-white"
                placeholder="Ex : aide en Anglais, Physique..."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#000000]">
              Lien principal Google Meet
            </label>
            <input
              name="googleMeetUrl"
              value={form.googleMeetUrl}
              onChange={handleChange}
              required
              type="url"
              className="mt-1 w-full rounded-xl border border-black/10 bg-[#EFECE3]/60 px-3 py-2 text-sm outline-none focus:border-[#4A70A9] focus:bg-white"
              placeholder="https://meet.google.com/..."
            />
            <p className="mt-1 text-xs text-black/60">
              Tu peux utiliser le même lien pour plusieurs créneaux ou le
              modifier plus tard.
            </p>
          </div>
        </section>

        {/* Bloc 3 : Créneaux disponibles */}
        <section className="space-y-4 border-t border-dashed border-black/10 pt-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#4A70A9]">
              3. Créneaux disponibles
            </h2>
            <p className="text-xs text-black/50">
              Ajoute un ou plusieurs créneaux avec date, heure et éventuellement
              un lieu.
            </p>
          </div>

          <div className="mt-1 space-y-4">
            {slots.map((slot, index) => (
              <div
                key={index}
                className="rounded-2xl border border-black/10 bg-[#EFECE3]/40 p-4 text-xs md:text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-black/60">
                    Créneau {index + 1}
                  </p>
                  {slots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSlot(index)}
                      className="text-[11px] text-red-600 hover:underline"
                    >
                      Supprimer ce créneau
                    </button>
                  )}
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="block font-medium text-[#000000]">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={slot.date}
                      onChange={(e) => handleSlotChange(index, e)}
                      className="mt-1 w-full ui-input-chip"
                      required={index === 0}
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#000000]">
                      Heure de début
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={slot.startTime}
                      onChange={(e) => handleSlotChange(index, e)}
                      className="mt-1 w-full ui-input-chip"
                      required={index === 0}
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#000000]">
                      Heure de fin (optionnel)
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={slot.endTime}
                      onChange={(e) => handleSlotChange(index, e)}
                      className="mt-1 w-full ui-input-chip"
                    />
                  </div>
                </div>

                {(form.modality === "IN_PERSON" ||
                  form.modality === "FLEXIBLE") && (
                  <div className="mt-3">
                    <label className="block font-medium text-[#000000]">
                      Lieu (adresse ou indication)
                    </label>
                    <input
                      name="location"
                      value={slot.location}
                      onChange={(e) => handleSlotChange(index, e)}
                      className="mt-1 w-full ui-input-chip"
                      placeholder="Ex : café calme, bibliothèque, salle de cours..."
                    />
                  </div>
                )}

                <div className="mt-3">
                  <label className="block font-medium text-[#000000]">
                    Détails du créneau (optionnel)
                  </label>
                  <textarea
                    name="notes"
                    value={slot.notes}
                    onChange={(e) => handleSlotChange(index, e)}
                    rows={2}
                    className="mt-1 w-full rounded-lg border border-black/10 bg-white px-2 py-1 outline-none focus:border-[#4A70A9]"
                    placeholder="Ex : groupe de 4 max, révision chapitre 1-2..."
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addSlot}
            className="text-xs font-medium text-[#4A70A9] hover:text-[#8FABD4]"
          >
            + Ajouter un autre créneau
          </button>
        </section>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 border-t border-black/5 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#4A70A9] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#8FABD4] disabled:opacity-60"
          >
            {loading ? "Publication en cours..." : "Publier l'offre"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/courses")}
            className="text-sm text-black/70 hover:text-[#4A70A9]"
          >
            Annuler et revenir aux offres
          </button>
        </div>
        </form>
      </main>
    </div>
  );
}


