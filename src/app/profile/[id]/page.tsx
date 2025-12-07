import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

interface PageParams {
  params: Promise<{ id: string }>;
}

export default async function PublicProfilePage({ params }: PageParams) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      courses: {
        include: {
          slots: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const profile = user.profile;
  const projectLinks = profile?.projectLinks
    ? typeof profile.projectLinks === "string"
      ? JSON.parse(profile.projectLinks)
      : profile.projectLinks
    : [];
  const certificates = profile?.certificates
    ? typeof profile.certificates === "string"
      ? JSON.parse(profile.certificates)
      : profile.certificates
    : [];

  // Calculate validation score
  const validationScore = [
    profile?.bio ? 1 : 0,
    profile?.videos && profile.videos.length > 0 ? 1 : 0,
    profile?.images && profile.images.length > 0 ? 1 : 0,
    projectLinks.length > 0 ? 1 : 0,
    profile?.resumeUrl ? 1 : 0,
    certificates.length > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-[#EFECE3]">
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 flex items-start gap-4">
          {user.image && (
            <Image
              src={user.image}
              alt={user.name ?? "Profil"}
              width={80}
              height={80}
              className="rounded-full border-4 border-white shadow-lg"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-[#000000]">
              {user.name ?? "Utilisateur"}
            </h1>
              {validationScore >= 4 && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                  ✓ Vérifié
                </span>
              )}
            </div>
            <p className="text-black/60">{user.email}</p>
            {profile?.location && (
              <p className="mt-1 text-sm text-black/60">📍 {profile.location}</p>
            )}
          </div>
        </div>

        {/* Validation Badge */}
        {validationScore > 0 && (
          <div className="mb-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-[#000000]">Validation du profil</h2>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-3 flex-1 rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-[#4A70A9] transition-all"
                  style={{ width: `${(validationScore / 6) * 100}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-black/60">
                {validationScore}/6
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-3">
              <div className={`flex items-center gap-2 ${profile?.bio ? "text-green-600" : "text-black/40"}`}>
                {profile?.bio ? "✓" : "○"} Bio
              </div>
              <div className={`flex items-center gap-2 ${profile?.videos && profile.videos.length > 0 ? "text-green-600" : "text-black/40"}`}>
                {profile?.videos && profile.videos.length > 0 ? "✓" : "○"} Vidéos
              </div>
              <div className={`flex items-center gap-2 ${profile?.images && profile.images.length > 0 ? "text-green-600" : "text-black/40"}`}>
                {profile?.images && profile.images.length > 0 ? "✓" : "○"} Images
              </div>
              <div className={`flex items-center gap-2 ${projectLinks.length > 0 ? "text-green-600" : "text-black/40"}`}>
                {projectLinks.length > 0 ? "✓" : "○"} Projets
              </div>
              <div className={`flex items-center gap-2 ${profile?.resumeUrl ? "text-green-600" : "text-black/40"}`}>
                {profile?.resumeUrl ? "✓" : "○"} CV
              </div>
              <div className={`flex items-center gap-2 ${certificates.length > 0 ? "text-green-600" : "text-black/40"}`}>
                {certificates.length > 0 ? "✓" : "○"} Certificats
              </div>
            </div>
          </div>
        )}

        {/* Bio */}
        {profile?.bio && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold text-[#000000]">À propos</h2>
            <p className="text-black/80 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Videos */}
        {profile?.videos && profile.videos.length > 0 && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#000000]">Vidéos</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {profile.videos.map((videoUrl, idx) => (
                <div key={idx} className="aspect-video rounded-xl overflow-hidden bg-black/5">
                  {videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be") ? (
                    <iframe
                      src={videoUrl.replace(
                        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
                        "https://www.youtube.com/embed/$1"
                      )}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={videoUrl} controls className="h-full w-full" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Images */}
        {profile?.images && profile.images.length > 0 && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#000000]">Galerie</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {profile.images.map((imageUrl, idx) => (
                <div key={idx} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={imageUrl}
                    alt={`Image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Links */}
        {projectLinks.length > 0 && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#000000]">Projets</h2>
            <div className="space-y-3">
              {projectLinks.map((project: any, idx: number) => (
                <a
                  key={idx}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 rounded-xl border border-black/10 p-4 transition-colors hover:border-[#4A70A9] hover:bg-[#4A70A9]/5"
                >
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#4A70A9]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#000000]">{project.name}</p>
                    {project.description && (
                      <p className="mt-1 text-sm text-black/60">{project.description}</p>
                    )}
                    <p className="mt-1 text-xs text-[#4A70A9]">{project.url}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Resume */}
        {profile?.resumeUrl && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#000000]">CV / Résumé</h2>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#4A70A9] px-6 py-3 text-white transition-colors hover:bg-[#8FABD4]"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Télécharger le CV
            </a>
          </div>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#000000]">Certificats</h2>
            <div className="space-y-3">
              {certificates.map((cert: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 rounded-xl border border-black/10 p-4"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#4A70A9]/10">
                    <svg
                      className="h-6 w-6 text-[#4A70A9]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#000000]">{cert.name}</p>
                    <p className="text-sm text-black/60">{cert.issuer}</p>
                    {cert.date && (
                      <p className="mt-1 text-xs text-black/50">Obtenu le {cert.date}</p>
                    )}
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs text-[#4A70A9] hover:underline"
                      >
                        Voir le certificat →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses */}
        {user.courses.length > 0 && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#000000]">Cours proposés</h2>
            <div className="space-y-3">
              {user.courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="block rounded-xl border border-black/10 p-4 transition-colors hover:border-[#4A70A9] hover:bg-[#4A70A9]/5"
                >
                  <h3 className="font-semibold text-[#000000]">{course.title}</h3>
                  <p className="mt-1 text-sm text-black/60">
                    {course.subject} • {course.level}
                  </p>
                  <p className="mt-2 text-xs text-black/50">
                    {course.slots.length} créneau{course.slots.length > 1 ? "x" : ""} disponible
                    {course.slots.length > 1 ? "s" : ""}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!profile && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-black/60">Ce profil n'a pas encore été complété.</p>
          </div>
        )}
      </div>
    </div>
  );
}

