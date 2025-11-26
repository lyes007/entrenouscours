import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Header } from "@/components/Header";
import { JoinCourseForm } from "@/components/JoinCourseForm";
import { OwnerRequestsPanel } from "@/components/OwnerRequestsPanel";

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
      <div className="min-h-screen bg-[#EFECE3]">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-10">
          <p className="rounded-2xl bg-white p-6 text-sm text-black/70 shadow-sm">
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
    <div className="min-h-screen bg-[#EFECE3]">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <div className="grid gap-8 md:grid-cols-[2fr,1.4fr]">
          <section className="space-y-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4A70A9]">
              Cours
            </p>
            <h1 className="text-2xl font-semibold text-[#000000]">
              {course.title}
            </h1>
            <p className="text-xs font-medium uppercase tracking-wide text-[#4A70A9]">
              {course.subject} · {course.level}
            </p>
            <p className="mt-3 text-sm text-black/80">{course.description}</p>

            <div className="mt-4 grid gap-3 text-xs text-black/70 md:grid-cols-2">
              <div>
                <p className="font-semibold text-[#000000]">Modalité</p>
                <p className="mt-1">
                  {course.modality === "ONLINE" && "En ligne (Google Meet)"}
                  {course.modality === "IN_PERSON" && "En présentiel"}
                  {course.modality === "FLEXIBLE" &&
                    "En ligne ou présentiel, à définir avec l'enseignant"}
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#000000]">Type d&apos;offre</p>
                <p className="mt-1">
                  {course.offerType === "FREE" && "Gratuit"}
                  {course.offerType === "PAID" &&
                    (course.pricePerHour
                      ? `${course.pricePerHour} ${course.currency}/h`
                      : "Payant (prix à discuter)")}
                  {course.offerType === "EXCHANGE" &&
                    (course.exchangeSubject
                      ? `Échange contre aide en ${course.exchangeSubject}`
                      : "Échange de compétences, matière à définir")}
                </p>
              </div>
              {course.teacher && (
                <div>
                  <p className="font-semibold text-[#000000]">Enseignant</p>
                  <p className="mt-1">
                    {course.teacher.name ?? course.teacher.email}
                  </p>
                </div>
              )}
              {course.capacity && (
                <div>
                  <p className="font-semibold text-[#000000]">Capacité</p>
                  <p className="mt-1">
                    Jusqu&apos;à {course.capacity} participants par session.
                  </p>
                </div>
              )}
            </div>

            {course.slots.length > 0 && (
              <div className="mt-4 space-y-2 text-xs text-black/70">
                <p className="font-semibold text-[#000000]">
                  Créneaux proposés
                </p>
                <ul className="space-y-1">
                  {course.slots.map((slot) => (
                    <li key={slot.id}>
                      {new Date(slot.startTime).toLocaleDateString("fr-FR", {
                        weekday: "short",
                        day: "2-digit",
                        month: "2-digit",
                      })}{" "}
                      à{" "}
                      {new Date(slot.startTime).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {slot.location && ` · ${slot.location}`}
                      {slot.notes && ` — ${slot.notes}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <a
              href="/courses"
              className="mt-4 inline-flex text-xs font-medium text-[#4A70A9] hover:text-[#8FABD4]"
            >
              ← Retour à la liste des cours
            </a>
          </section>

          <section className="space-y-4">
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


