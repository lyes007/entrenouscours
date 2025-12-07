import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ProfileEditButton } from "@/components/ProfileEditButton";
import { CourseImage } from "@/components/CourseImage";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
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
    redirect("/");
  }

  const profile = user.profile;
  const projectLinks = profile?.projectLinks
    ? (typeof profile.projectLinks === "string"
        ? JSON.parse(profile.projectLinks)
        : profile.projectLinks)
    : [];
  const certificates = profile?.certificates
    ? (typeof profile.certificates === "string"
        ? JSON.parse(profile.certificates)
        : profile.certificates)
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
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-5">
        {/* Header - Compact */}
        <div className="mb-4 flex items-center gap-3">
          {user.image && (
            <Image
              src={user.image}
              alt={user.name ?? "Profil"}
              width={48}
              height={48}
              className="rounded-full border-2 border-white shadow-lg"
            />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-white truncate">
              {user.name ?? "Utilisateur"}
            </h1>
            <p className="text-[11px] text-white/80 truncate">{user.email}</p>
            {profile?.location && (
              <p className="text-[10px] text-white/70">📍 {profile.location}</p>
            )}
          </div>
          <ProfileEditButton />
        </div>

        {/* Validation Badge - Compact */}
        <div className="mb-3 rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-semibold text-[#000000]">Profil vérifié</h2>
              <p className="text-[10px] text-black/60">
                {validationScore}/6 complétés
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-16 rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-[#4A70A9] transition-all"
                  style={{ width: `${(validationScore / 6) * 100}%` }}
                />
              </div>
              {validationScore >= 4 ? (
                <span className="text-[10px] font-semibold text-green-600">✓</span>
              ) : (
                <span className="text-[10px] font-semibold text-orange-600">...</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[10px]">
            <div className={`flex items-center gap-2 ${profile?.bio ? "text-green-600" : "text-black/40"}`}>
              {profile?.bio ? "✓" : "○"} Bio complétée
            </div>
            <div className={`flex items-center gap-2 ${profile?.videos && profile.videos.length > 0 ? "text-green-600" : "text-black/40"}`}>
              {profile?.videos && profile.videos.length > 0 ? "✓" : "○"} Vidéos ajoutées
            </div>
            <div className={`flex items-center gap-2 ${profile?.images && profile.images.length > 0 ? "text-green-600" : "text-black/40"}`}>
              {profile?.images && profile.images.length > 0 ? "✓" : "○"} Images ajoutées
            </div>
            <div className={`flex items-center gap-2 ${projectLinks.length > 0 ? "text-green-600" : "text-black/40"}`}>
              {projectLinks.length > 0 ? "✓" : "○"} Projets partagés
            </div>
            <div className={`flex items-center gap-2 ${profile?.resumeUrl ? "text-green-600" : "text-black/40"}`}>
              {profile?.resumeUrl ? "✓" : "○"} CV partagé
            </div>
            <div className={`flex items-center gap-2 ${certificates.length > 0 ? "text-green-600" : "text-black/40"}`}>
              {certificates.length > 0 ? "✓" : "○"} Certificats ajoutés
            </div>
          </div>
        </div>

        {/* Bio - Compact */}
        {profile?.bio && (
          <div className="mb-3 rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 shadow-lg">
            <h2 className="mb-2 text-sm font-semibold text-[#000000]">À propos</h2>
            <p className="text-[11px] text-black/80 line-clamp-3 leading-snug">{profile.bio}</p>
          </div>
        )}

        {/* Videos - Compact */}
        {profile?.videos && profile.videos.length > 0 && (
          <div className="mb-3 rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 shadow-lg">
            <h2 className="mb-2 text-sm font-semibold text-[#000000]">Vidéos</h2>
            <div className="grid grid-cols-2 gap-2">
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

        {/* Images - Compact */}
        {profile?.images && profile.images.length > 0 && (
          <div className="mb-3 rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 shadow-lg">
            <h2 className="mb-2 text-sm font-semibold text-[#000000]">Galerie</h2>
            <div className="grid grid-cols-3 gap-2">
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

        {/* Project Links - Compact */}
        {projectLinks.length > 0 && (
          <div className="mb-3 rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 shadow-lg">
            <h2 className="mb-2 text-sm font-semibold text-[#000000]">Projets</h2>
            <div className="space-y-2">
              {projectLinks.map((project: any, idx: number) => (
                <a
                  key={idx}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 rounded-lg border border-black/10 p-2 transition-colors hover:border-[#4A70A9] hover:bg-[#4A70A9]/5"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#4A70A9]"
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
                    <p className="text-xs font-medium text-[#000000] truncate">{project.name}</p>
                    {project.description && (
                      <p className="text-[10px] text-black/60 line-clamp-1">{project.description}</p>
                    )}
                    <p className="text-[9px] text-[#4A70A9] truncate">{project.url}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Resume - Compact */}
        {profile?.resumeUrl && (
          <div className="mb-3 rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 shadow-lg">
            <h2 className="mb-2 text-sm font-semibold text-[#000000]">CV / Résumé</h2>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#4A70A9] px-3 py-1.5 text-xs text-white transition-colors hover:bg-[#8FABD4]"
            >
              <svg
                className="h-4 w-4"
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
              Télécharger
            </a>
          </div>
        )}

        {/* Certificates - Compact */}
        {certificates.length > 0 && (
          <div className="mb-3 rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 shadow-lg">
            <h2 className="mb-2 text-sm font-semibold text-[#000000]">Certificats</h2>
            <div className="space-y-2">
              {certificates.map((cert: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 rounded-lg border border-black/10 p-2"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#4A70A9]/10">
                    <svg
                      className="h-4 w-4 text-[#4A70A9]"
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
                    <p className="text-xs font-medium text-[#000000] truncate">{cert.name}</p>
                    <p className="text-[10px] text-black/60 truncate">{cert.issuer}</p>
                    {cert.date && (
                      <p className="text-[9px] text-black/50">Obtenu le {cert.date}</p>
                    )}
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] text-[#4A70A9] hover:underline"
                      >
                        Voir →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses - Compact Grid */}
        {user.courses.length > 0 && (
          <div className="mb-3 rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 shadow-lg">
            <h2 className="mb-2 text-sm font-semibold text-[#000000]">Mes cours</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {user.courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="block overflow-hidden rounded-lg border border-black/10 transition-colors hover:border-[#4A70A9] hover:bg-[#4A70A9]/5"
                >
                  <div className="relative h-16">
                    <CourseImage
                      imageUrl={course.imageUrl}
                      alt={course.title}
                      width={200}
                      height={64}
                      className="w-full h-full object-cover"
                      fill
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-[11px] font-semibold text-[#000000] line-clamp-1">{course.title}</h3>
                    <p className="text-[9px] text-black/60">{course.subject} • {course.level}</p>
                    <p className="text-[9px] text-black/50">
                      {course.slots.length} créneau{course.slots.length > 1 ? "x" : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!profile && (
          <div className="rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-4 text-center shadow-lg">
            <p className="mb-3 text-xs text-black/60">
              Votre profil est vide. Complétez-le pour aider les étudiants à vous connaître mieux.
            </p>
            <ProfileEditButton />
          </div>
        )}
      </div>
    </div>
  );
}

