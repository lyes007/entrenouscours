"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

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
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-lg px-4 py-8 animate-fade-in-up">
          <div className="rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-6 shadow-lg">
            <h1 className="text-xl font-semibold text-[#000000]">
              Proposer une offre de cours
            </h1>
            <p className="mt-3 text-xs text-black/70">
              Tu dois être connecté avec ton compte Google pour publier un cours
              ou une offre d&apos;échange.
            </p>
            <button
              onClick={() => signIn("google")}
              className="mt-4 rounded-lg bg-[#4A70A9] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] hover:bg-[#8FABD4]"
            >
              Se connecter avec Google
            </button>
          </div>
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

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setImagePreview(url || null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Créer une preview locale
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de l'upload");
      }

      const data = await response.json();
      setImageUrl(data.url);
      setImagePreview(data.url);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'upload de l'image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Si on a un fichier uploadé mais pas encore uploadé, l'uploader d'abord
      let finalImageUrl = imageUrl || null;
      if (imageMode === "upload" && uploadedFile && (!imageUrl || !imageUrl.startsWith("/uploads/"))) {
        const formData = new FormData();
        formData.append("file", uploadedFile);
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          finalImageUrl = uploadData.url;
        }
      }

      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          imageUrl: finalImageUrl || null,
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
    <div className="min-h-screen">
      <main className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-5 animate-fade-in-up">
        <div className="mb-4">
          <p className="inline-flex rounded-full bg-white/10 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/90">
            Nouvelle offre
          </p>
          <h1 className="mt-2 text-xl sm:text-2xl font-bold text-white">
            Proposer une nouvelle offre de cours
          </h1>
          <p className="mt-1 text-[11px] text-white/80">
            Crée une annonce claire et attractive pour tes futurs apprenants
          </p>
        </div>

        <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-4 shadow-lg"
        >
        {/* Bloc 1 : Informations générales */}
        <section className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[#4A70A9]">
            1. Informations générales
          </h2>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-medium text-[#000000] mb-0.5">
                Titre de l&apos;offre *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-[11px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                placeholder="Ex : Soutien en Maths Bac"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-[#000000] mb-0.5">
                Matière / sujet *
              </label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-[11px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                placeholder="Ex : Mathématiques"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-[#000000] mb-0.5">
                Niveau ciblé *
              </label>
              <input
                name="level"
                value={form.level}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-[11px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                placeholder="Ex : Bac, Licence 1..."
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#000000] mb-0.5">
              Description du cours *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-[11px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20 resize-none"
              placeholder="Explique ce que tu proposes..."
            />
          </div>

          {/* Image du cours - Compact */}
          <div>
            <label className="block text-[10px] font-medium text-[#000000] mb-0.5">
              Image (optionnel)
            </label>
            <div className="mb-2 flex gap-1 border-b border-black/10">
              <button
                type="button"
                onClick={() => {
                  setImageMode("url");
                  setUploadedFile(null);
                }}
                className={`px-2 py-1 text-[10px] font-medium transition-colors ${
                  imageMode === "url"
                    ? "border-b-2 border-[#4A70A9] text-[#4A70A9]"
                    : "text-black/60 hover:text-[#4A70A9]"
                }`}
              >
                URL
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageMode("upload");
                  setImageUrl("");
                }}
                className={`px-2 py-1 text-[10px] font-medium transition-colors ${
                  imageMode === "upload"
                    ? "border-b-2 border-[#4A70A9] text-[#4A70A9]"
                    : "text-black/60 hover:text-[#4A70A9]"
                }`}
              >
                Upload
              </button>
            </div>

            {imageMode === "url" ? (
              <input
                type="url"
                value={imageUrl}
                onChange={handleImageUrlChange}
                className="w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-[11px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                placeholder="https://exemple.com/image.jpg"
              />
            ) : (
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-[11px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20 file:mr-2 file:rounded file:border-0 file:bg-[#4A70A9] file:px-2 file:py-1 file:text-[10px] file:font-medium file:text-white"
                />
                {uploadedFile && (
                  <button
                    type="button"
                    onClick={handleFileUpload}
                    disabled={uploading}
                    className="rounded-lg bg-[#4A70A9] px-3 py-1 text-[10px] font-medium text-white hover:bg-[#8FABD4] disabled:opacity-60"
                  >
                    {uploading ? "Upload..." : "Uploader"}
                  </button>
                )}
              </div>
            )}

            {/* Preview - Compact */}
            {imagePreview && (
              <div className="mt-2">
                <div className="relative h-24 w-full overflow-hidden rounded-lg border border-black/10 bg-[#EFECE3]">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Bloc 2 : Modalités & tarification - Compact */}
        <section className="space-y-2 border-t border-dashed border-black/10 pt-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[#4A70A9]">
            2. Modalités & tarification
          </h2>

          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-medium text-[#000000] mb-0.5">
                Type d&apos;offre
              </label>
              <select
                name="offerType"
                value={form.offerType}
                onChange={handleChange}
                className="w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-[11px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
              >
                <option value="PAID">Payant</option>
                <option value="FREE">Gratuit</option>
                <option value="EXCHANGE">Échange</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#000000] mb-0.5">
                Modalité
              </label>
              <select
                name="modality"
                value={form.modality}
                onChange={handleChange}
                className="w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-[11px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
              >
                <option value="ONLINE">En ligne</option>
                <option value="IN_PERSON">Présentiel</option>
                <option value="FLEXIBLE">Flexible</option>
              </select>
            </div>
          </div>

          {form.offerType === "PAID" && (
            <div>
              <label className="block text-[10px] font-medium text-[#000000] mb-0.5">
                Prix horaire (TND)
              </label>
              <input
                name="pricePerHour"
                value={form.pricePerHour}
                onChange={handleChange}
                type="number"
                min="0"
                className="w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-[11px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                placeholder="Ex : 15"
              />
            </div>
          )}

          {form.offerType === "EXCHANGE" && (
            <div>
              <label className="block text-[10px] font-medium text-[#000000] mb-0.5">
                Matière souhaitée en échange
              </label>
              <input
                name="exchangeSubject"
                value={form.exchangeSubject}
                onChange={handleChange}
                className="w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-[11px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                placeholder="Ex : aide en Anglais"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-medium text-[#000000] mb-0.5">
              Lien Google Meet *
            </label>
            <input
              name="googleMeetUrl"
              value={form.googleMeetUrl}
              onChange={handleChange}
              required
              type="url"
              className="w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-[11px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
              placeholder="https://meet.google.com/..."
            />
          </div>
        </section>

        {/* Bloc 3 : Créneaux disponibles - Compact */}
        <section className="space-y-2 border-t border-dashed border-black/10 pt-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[#4A70A9]">
            3. Créneaux disponibles
          </h2>

          <div className="space-y-2">
            {slots.map((slot, index) => (
              <div
                key={index}
                className="rounded-lg border border-black/10 bg-[#EFECE3]/40 p-2"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-black/60">
                    Créneau {index + 1}
                  </p>
                  {slots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSlot(index)}
                      className="text-[9px] text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  )}
                </div>

                <div className="grid gap-1.5 sm:grid-cols-3">
                  <div>
                    <label className="block text-[9px] font-medium text-[#000000] mb-0.5">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={slot.date}
                      onChange={(e) => handleSlotChange(index, e)}
                      className="w-full rounded-lg border border-black/10 bg-white px-2 py-1 text-[10px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                      required={index === 0}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-medium text-[#000000] mb-0.5">
                      Début *
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={slot.startTime}
                      onChange={(e) => handleSlotChange(index, e)}
                      className="w-full rounded-lg border border-black/10 bg-white px-2 py-1 text-[10px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                      required={index === 0}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-medium text-[#000000] mb-0.5">
                      Fin (opt.)
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={slot.endTime}
                      onChange={(e) => handleSlotChange(index, e)}
                      className="w-full rounded-lg border border-black/10 bg-white px-2 py-1 text-[10px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                    />
                  </div>
                </div>

                {(form.modality === "IN_PERSON" ||
                  form.modality === "FLEXIBLE") && (
                  <div className="mt-1.5">
                    <label className="block text-[9px] font-medium text-[#000000] mb-0.5">
                      Lieu
                    </label>
                    <input
                      name="location"
                      value={slot.location}
                      onChange={(e) => handleSlotChange(index, e)}
                      className="w-full rounded-lg border border-black/10 bg-white px-2 py-1 text-[10px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                      placeholder="Ex : café, bibliothèque..."
                    />
                  </div>
                )}

                <div className="mt-1.5">
                  <label className="block text-[9px] font-medium text-[#000000] mb-0.5">
                    Détails (opt.)
                  </label>
                  <textarea
                    name="notes"
                    value={slot.notes}
                    onChange={(e) => handleSlotChange(index, e)}
                    rows={1}
                    className="w-full rounded-lg border border-black/10 bg-white px-2 py-1 text-[10px] outline-none focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20 resize-none"
                    placeholder="Ex : groupe de 4 max..."
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addSlot}
            className="text-[10px] font-medium text-[#4A70A9] hover:text-[#8FABD4]"
          >
            + Ajouter un créneau
          </button>
        </section>

        {error && (
          <p className="text-[10px] text-red-600">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 border-t border-black/5 pt-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[#4A70A9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#8FABD4] disabled:opacity-60"
          >
            {loading ? "Publication..." : "Publier l'offre"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/courses")}
            className="text-[10px] text-black/70 hover:text-[#4A70A9]"
          >
            Annuler
          </button>
        </div>
        </form>
      </main>
    </div>
  );
}


