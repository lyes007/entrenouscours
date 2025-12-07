import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { JoinCourseForm } from "@/components/JoinCourseForm";
import { OwnerRequestsPanel } from "@/components/OwnerRequestsPanel";
import { CourseImage } from "@/components/CourseImage";

interface PageParams {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: PageParams) {
  const { id } = await params;

  const [session, course] = await Promise.all([
    getServerSession(authOptions),
    prisma.course.findUnique({
      where: { id },
      include: {
        teacher: true,
        slots: { orderBy: { startTime: "asc" } },
        requests: { orderBy: { createdAt: "desc" } },
      },
    }),
  ]);

  if (!course) {
    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-3xl px-4 py-10">
          <p className="rounded-2xl bg-white/90 backdrop-blur-sm p-6 text-sm text-black/70 shadow-lg">
            Ce cours n&apos;existe pas ou a été supprimé.
          </p>
        </main>
      </div>
    );
  }

  const isOwner =
    course.teacherId && session?.user
      ? course.teacherId === (session.user as any).id
      : false;

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-5">
        <div className="grid gap-3 lg:grid-cols-[1.2fr,1fr]">
          {/* Left: Course Info - Compact */}
          <section className="rounded-2xl border border-white/20 bg-white/95 backdrop-blur-sm overflow-hidden shadow-lg">
            <div className="grid grid-cols-[120px,1fr] gap-3 p-3 sm:p-4">
              {/* Compact Image */}
              <div className="relative h-24 sm:h-28 rounded-lg overflow-hidden">
                <CourseImage
                  imageUrl={course.imageUrl}
                  alt={course.title}
                  width={120}
                  height={112}
                  className="w-full h-full object-cover"
                  fill
                />
              </div>
              
              {/* Compact Info */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4A70A9] truncate">
                      {course.subject} · {course.level}
                    </p>
                    <h1 className="text-base sm:text-lg font-bold text-[#000000] leading-tight line-clamp-2">
                      {course.title}
                    </h1>
                  </div>
                  <a
                    href="/courses"
                    className="flex-shrink-0 text-[10px] font-medium text-[#4A70A9] hover:text-[#8FABD4] whitespace-nowrap"
                  >
                    ← Retour
                  </a>
                </div>
                
                <p className="text-[11px] text-black/70 line-clamp-2 leading-snug">
                  {course.description}
                </p>
                
                {/* Compact Details Grid */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
                  <div>
                    <span className="font-semibold text-[#000000]">Modalité: </span>
                    <span className="text-black/70">
                      {course.modality === "ONLINE" && "En ligne"}
                      {course.modality === "IN_PERSON" && "Présentiel"}
                      {course.modality === "FLEXIBLE" && "Flexible"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#000000]">Prix: </span>
                    <span className="text-black/70">
                      {course.offerType === "FREE" && "Gratuit"}
                      {course.offerType === "PAID" &&
                        (course.pricePerHour
                          ? `${course.pricePerHour} ${course.currency}/h`
                          : "Payant")}
                      {course.offerType === "EXCHANGE" && "Échange"}
                    </span>
                  </div>
                  {course.teacher && (
                    <div className="col-span-2">
                      <span className="font-semibold text-[#000000]">Enseignant: </span>
                      <a
                        href={`/profile/${course.teacher.id}`}
                        className="text-[#4A70A9] hover:text-[#8FABD4] hover:underline"
                      >
                        {course.teacher.name ?? course.teacher.email}
                      </a>
                    </div>
                  )}
                  {course.capacity && (
                    <div className="col-span-2">
                      <span className="font-semibold text-[#000000]">Capacité: </span>
                      <span className="text-black/70">Jusqu&apos;à {course.capacity} participants</span>
                    </div>
                  )}
                </div>

                {/* Compact Slots */}
                {course.slots.length > 0 && (
                  <div className="pt-1">
                    <p className="text-[10px] font-semibold text-[#000000] mb-0.5">
                      Créneaux:
                    </p>
                    <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                      {course.slots.slice(0, 3).map((slot) => (
                        <span key={slot.id} className="text-[10px] text-black/70">
                          {new Date(slot.startTime).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                          })}{" "}
                          {new Date(slot.startTime).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      ))}
                      {course.slots.length > 3 && (
                        <span className="text-[10px] text-black/50">
                          +{course.slots.length - 3} autres
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right: Form/Requests - Compact */}
          <section>
            {!isOwner && (
              <JoinCourseForm courseId={course.id} />
            )}
            {isOwner && (
              <OwnerRequestsPanel
                requests={course.requests.map((r) => ({
                  id: r.id,
                  studentName: r.studentName,
                  studentEmail: r.studentEmail,
                  paymentMethod: r.paymentMethod,
                  proposedTime: r.proposedTime,
                  proposedLocation: r.proposedLocation,
                  message: r.message,
                  status: r.status,
                }))}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}


