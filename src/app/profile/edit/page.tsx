"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-white/80">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-5">
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Modifier mon profil</h1>
          <p className="mt-1 text-[11px] text-white/80">
            Complétez votre profil pour aider les étudiants à mieux vous connaître
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Informations générales - Compact */}
          <div className="rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 sm:p-4 shadow-lg">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#4A70A9]">
              Informations générales
            </h2>
            <div className="space-y-2">
              <div>
                <label className="mb-0.5 block text-[10px] font-medium text-[#000000]">
                  Bio / Description
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-[11px] outline-none transition-all focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20 resize-none"
                  placeholder="Parlez-nous de vous..."
                />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="mb-0.5 block text-[10px] font-medium text-[#000000]">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-[11px] outline-none transition-all focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                    placeholder="+216 XX XXX XXX"
                  />
                </div>
                <div>
                  <label className="mb-0.5 block text-[10px] font-medium text-[#000000]">
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-[11px] outline-none transition-all focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                    placeholder="Tunis, Sfax, etc."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vidéos - Compact */}
          <div className="rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 sm:p-4 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[#4A70A9]">Vidéos</h2>
              <button
                type="button"
                onClick={addVideo}
                className="rounded-lg bg-[#4A70A9] px-2 py-1 text-[10px] font-medium text-white transition-colors hover:bg-[#8FABD4]"
              >
                + Ajouter
              </button>
            </div>
            <div className="space-y-2">
              {videos.map((video, idx) => (
                <div key={idx} className="flex gap-1.5">
                  <input
                    type="url"
                    value={video}
                    onChange={(e) => updateVideo(idx, e.target.value)}
                    className="flex-1 rounded-lg border border-black/10 bg-white px-2 py-1 text-[11px] outline-none transition-all focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                    placeholder="URL YouTube, Vimeo..."
                  />
                  <button
                    type="button"
                    onClick={() => removeVideo(idx)}
                    className="rounded-lg border border-red-300 px-2 py-1 text-[10px] text-red-600 transition-colors hover:bg-red-50"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Images - Compact */}
          <div className="rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 sm:p-4 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[#4A70A9]">Images</h2>
              <button
                type="button"
                onClick={addImage}
                className="rounded-lg bg-[#4A70A9] px-2 py-1 text-[10px] font-medium text-white transition-colors hover:bg-[#8FABD4]"
              >
                + Ajouter
              </button>
            </div>
            <div className="space-y-2">
              {images.map((image, idx) => (
                <div key={idx} className="flex gap-1.5">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => updateImage(idx, e.target.value)}
                    className="flex-1 rounded-lg border border-black/10 bg-white px-2 py-1 text-[11px] outline-none transition-all focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                    placeholder="URL de l'image"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="rounded-lg border border-red-300 px-2 py-1 text-[10px] text-red-600 transition-colors hover:bg-red-50"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Projets - Compact */}
          <div className="rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 sm:p-4 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[#4A70A9]">Projets</h2>
              <button
                type="button"
                onClick={addProjectLink}
                className="rounded-lg bg-[#4A70A9] px-2 py-1 text-[10px] font-medium text-white transition-colors hover:bg-[#8FABD4]"
              >
                + Ajouter
              </button>
            </div>
            <div className="space-y-2">
              {projectLinks.map((project, idx) => (
                <div key={idx} className="space-y-1.5 rounded-lg border border-black/10 p-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-medium text-[#000000]">Projet {idx + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeProjectLink(idx)}
                      className="text-[9px] text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProjectLink(idx, "name", e.target.value)}
                    className="w-full rounded-lg border border-black/10 bg-white px-2 py-1 text-[11px] outline-none transition-all focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                    placeholder="Nom du projet"
                  />
                  <input
                    type="url"
                    value={project.url}
                    onChange={(e) => updateProjectLink(idx, "url", e.target.value)}
                    className="w-full rounded-lg border border-black/10 bg-white px-2 py-1 text-[11px] outline-none transition-all focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                    placeholder="URL du projet"
                  />
                  <textarea
                    value={project.description || ""}
                    onChange={(e) => updateProjectLink(idx, "description", e.target.value)}
                    rows={1}
                    className="w-full rounded-lg border border-black/10 bg-white px-2 py-1 text-[11px] outline-none transition-all focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20 resize-none"
                    placeholder="Description (optionnel)"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CV - Compact */}
          <div className="rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 sm:p-4 shadow-lg">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#4A70A9]">CV / Résumé</h2>
            <input
              type="url"
              value={formData.resumeUrl}
              onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
              className="w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-[11px] outline-none transition-all focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
              placeholder="URL de votre CV (Google Drive, Dropbox...)"
            />
            <p className="mt-1.5 text-[9px] text-black/60">
              💡 Uploadez votre CV sur Google Drive, partagez-le publiquement, puis collez le lien
            </p>
          </div>

          {/* Certificats - Compact */}
          <div className="rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 sm:p-4 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[#4A70A9]">Certificats</h2>
              <button
                type="button"
                onClick={addCertificate}
                className="rounded-lg bg-[#4A70A9] px-2 py-1 text-[10px] font-medium text-white transition-colors hover:bg-[#8FABD4]"
              >
                + Ajouter
              </button>
            </div>
            <div className="space-y-2">
              {certificates.map((cert, idx) => (
                <div key={idx} className="space-y-1.5 rounded-lg border border-black/10 p-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-medium text-[#000000]">Certificat {idx + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeCertificate(idx)}
                      className="text-[9px] text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCertificate(idx, "name", e.target.value)}
                    className="w-full rounded-lg border border-black/10 bg-white px-2 py-1 text-[11px] outline-none transition-all focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                    placeholder="Nom du certificat"
                  />
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCertificate(idx, "issuer", e.target.value)}
                    className="w-full rounded-lg border border-black/10 bg-white px-2 py-1 text-[11px] outline-none transition-all focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                    placeholder="Organisme émetteur"
                  />
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    <input
                      type="text"
                      value={cert.date || ""}
                      onChange={(e) => updateCertificate(idx, "date", e.target.value)}
                      className="rounded-lg border border-black/10 bg-white px-2 py-1 text-[11px] outline-none transition-all focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                      placeholder="Date (ex: Janvier 2024)"
                    />
                    <input
                      type="url"
                      value={cert.url || ""}
                      onChange={(e) => updateCertificate(idx, "url", e.target.value)}
                      className="rounded-lg border border-black/10 bg-white px-2 py-1 text-[11px] outline-none transition-all focus:border-[#4A70A9] focus:ring-1 focus:ring-[#4A70A9]/20"
                      placeholder="URL (optionnel)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error & Success Messages - Compact */}
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-2 text-[10px] text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-green-300 bg-green-50 p-2 text-[10px] text-green-600">
              Profil mis à jour avec succès ! Redirection...
            </div>
          )}

          {/* Submit Button - Compact */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="flex-1 rounded-lg border border-black/10 bg-white px-4 py-2 text-xs font-medium text-[#000000] transition-colors hover:bg-black/5"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-[#4A70A9] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#8FABD4] disabled:opacity-50"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

