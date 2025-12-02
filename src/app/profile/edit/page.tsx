"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";

interface ProjectLink {
  name: string;
  url: string;
  description?: string;
}

interface Certificate {
  name: string;
  issuer: string;
  date?: string;
  url?: string;
}

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    bio: "",
    phone: "",
    location: "",
    resumeUrl: "",
  });

  const [videos, setVideos] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [projectLinks, setProjectLinks] = useState<ProjectLink[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setFormData({
            bio: data.profile.bio || "",
            phone: data.profile.phone || "",
            location: data.profile.location || "",
            resumeUrl: data.profile.resumeUrl || "",
          });
          setVideos(data.profile.videos || []);
          setImages(data.profile.images || []);
          setProjectLinks(
            data.profile.projectLinks
              ? typeof data.profile.projectLinks === "string"
                ? JSON.parse(data.profile.projectLinks)
                : data.profile.projectLinks
              : []
          );
          setCertificates(
            data.profile.certificates
              ? typeof data.profile.certificates === "string"
                ? JSON.parse(data.profile.certificates)
                : data.profile.certificates
              : []
          );
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          videos,
          images,
          projectLinks,
          certificates,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const addVideo = () => {
    setVideos([...videos, ""]);
  };

  const removeVideo = (idx: number) => {
    setVideos(videos.filter((_, i) => i !== idx));
  };

  const updateVideo = (idx: number, value: string) => {
    const newVideos = [...videos];
    newVideos[idx] = value;
    setVideos(newVideos);
  };

  const addImage = () => {
    setImages([...images, ""]);
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const updateImage = (idx: number, value: string) => {
    const newImages = [...images];
    newImages[idx] = value;
    setImages(newImages);
  };

  const addProjectLink = () => {
    setProjectLinks([...projectLinks, { name: "", url: "", description: "" }]);
  };

  const removeProjectLink = (idx: number) => {
    setProjectLinks(projectLinks.filter((_, i) => i !== idx));
  };

  const updateProjectLink = (idx: number, field: keyof ProjectLink, value: string) => {
    const newLinks = [...projectLinks];
    newLinks[idx] = { ...newLinks[idx], [field]: value };
    setProjectLinks(newLinks);
  };

  const addCertificate = () => {
    setCertificates([...certificates, { name: "", issuer: "", date: "", url: "" }]);
  };

  const removeCertificate = (idx: number) => {
    setCertificates(certificates.filter((_, i) => i !== idx));
  };

  const updateCertificate = (idx: number, field: keyof Certificate, value: string) => {
    const newCerts = [...certificates];
    newCerts[idx] = { ...newCerts[idx], [field]: value };
    setCertificates(newCerts);
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EFECE3]">
        <p className="text-black/60">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFECE3]">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#000000]">Modifier mon profil</h1>
          <p className="mt-2 text-black/60">
            Complétez votre profil pour aider les étudiants à mieux vous connaître
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#000000]">
              Informations générales
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#000000]">
                  Bio / Description
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[#4A70A9] focus:ring-2 focus:ring-[#8FABD4]/50"
                  placeholder="Parlez-nous de vous, de votre expérience, de vos compétences..."
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#000000]">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[#4A70A9] focus:ring-2 focus:ring-[#8FABD4]/50"
                    placeholder="+216 XX XXX XXX"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#000000]">
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[#4A70A9] focus:ring-2 focus:ring-[#8FABD4]/50"
                    placeholder="Tunis, Sfax, etc."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vidéos */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#000000]">Vidéos</h2>
              <button
                type="button"
                onClick={addVideo}
                className="rounded-lg bg-[#4A70A9] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#8FABD4]"
              >
                + Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {videos.map((video, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="url"
                    value={video}
                    onChange={(e) => updateVideo(idx, e.target.value)}
                    className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[#4A70A9] focus:ring-2 focus:ring-[#8FABD4]/50"
                    placeholder="URL YouTube, Vimeo, ou lien direct"
                  />
                  <button
                    type="button"
                    onClick={() => removeVideo(idx)}
                    className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#000000]">Images</h2>
              <button
                type="button"
                onClick={addImage}
                className="rounded-lg bg-[#4A70A9] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#8FABD4]"
              >
                + Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {images.map((image, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => updateImage(idx, e.target.value)}
                    className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[#4A70A9] focus:ring-2 focus:ring-[#8FABD4]/50"
                    placeholder="URL de l'image"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Projets */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#000000]">Projets</h2>
              <button
                type="button"
                onClick={addProjectLink}
                className="rounded-lg bg-[#4A70A9] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#8FABD4]"
              >
                + Ajouter
              </button>
            </div>
            <div className="space-y-4">
              {projectLinks.map((project, idx) => (
                <div key={idx} className="space-y-3 rounded-xl border border-black/10 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-[#000000]">Projet {idx + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeProjectLink(idx)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProjectLink(idx, "name", e.target.value)}
                    className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[#4A70A9] focus:ring-2 focus:ring-[#8FABD4]/50"
                    placeholder="Nom du projet"
                  />
                  <input
                    type="url"
                    value={project.url}
                    onChange={(e) => updateProjectLink(idx, "url", e.target.value)}
                    className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[#4A70A9] focus:ring-2 focus:ring-[#8FABD4]/50"
                    placeholder="URL du projet"
                  />
                  <textarea
                    value={project.description || ""}
                    onChange={(e) => updateProjectLink(idx, "description", e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[#4A70A9] focus:ring-2 focus:ring-[#8FABD4]/50"
                    placeholder="Description (optionnel)"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CV */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#000000]">CV / Résumé</h2>
            <input
              type="url"
              value={formData.resumeUrl}
              onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[#4A70A9] focus:ring-2 focus:ring-[#8FABD4]/50"
              placeholder="URL de votre CV (Google Drive, Dropbox, etc.)"
            />
            <p className="mt-2 text-xs text-black/60">
              💡 Astuce : Uploadez votre CV sur Google Drive, partagez-le publiquement, puis
              collez le lien ici
            </p>
          </div>

          {/* Certificats */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#000000]">Certificats</h2>
              <button
                type="button"
                onClick={addCertificate}
                className="rounded-lg bg-[#4A70A9] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#8FABD4]"
              >
                + Ajouter
              </button>
            </div>
            <div className="space-y-4">
              {certificates.map((cert, idx) => (
                <div key={idx} className="space-y-3 rounded-xl border border-black/10 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-[#000000]">Certificat {idx + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeCertificate(idx)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCertificate(idx, "name", e.target.value)}
                    className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[#4A70A9] focus:ring-2 focus:ring-[#8FABD4]/50"
                    placeholder="Nom du certificat"
                  />
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCertificate(idx, "issuer", e.target.value)}
                    className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[#4A70A9] focus:ring-2 focus:ring-[#8FABD4]/50"
                    placeholder="Organisme émetteur"
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      value={cert.date || ""}
                      onChange={(e) => updateCertificate(idx, "date", e.target.value)}
                      className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[#4A70A9] focus:ring-2 focus:ring-[#8FABD4]/50"
                      placeholder="Date (ex: Janvier 2024)"
                    />
                    <input
                      type="url"
                      value={cert.url || ""}
                      onChange={(e) => updateCertificate(idx, "url", e.target.value)}
                      className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[#4A70A9] focus:ring-2 focus:ring-[#8FABD4]/50"
                      placeholder="URL du certificat (optionnel)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-green-300 bg-green-50 p-4 text-sm text-green-600">
              Profil mis à jour avec succès ! Redirection...
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="flex-1 rounded-xl border border-black/10 bg-white px-6 py-3 font-medium text-[#000000] transition-colors hover:bg-black/5"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-[#4A70A9] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#8FABD4] disabled:opacity-50"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

