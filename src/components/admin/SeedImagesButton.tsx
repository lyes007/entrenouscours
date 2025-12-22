"use client";

import { useState } from "react";

export function SeedImagesButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSeedImages = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/seed-images", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`Erreur: ${data.error}`);
        return;
      }

      setMessage(data.message || "Images ajoutées avec succès !");
      
      // Reload page after 2 seconds to see updated courses
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error seeding images:", error);
      setMessage("Erreur lors de l'ajout des images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {message && (
        <span className={`text-sm ${message.includes("Erreur") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </span>
      )}
      <button
        onClick={handleSeedImages}
        disabled={loading}
        className="rounded-md bg-[#4A70A9] px-4 py-2 text-sm font-medium text-white hover:bg-[#8FABD4] disabled:opacity-50"
      >
        {loading ? "Ajout en cours..." : "Ajouter images aux cours"}
      </button>
    </div>
  );
}

