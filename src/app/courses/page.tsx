import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DeleteCourseButton } from "@/components/DeleteCourseButton";

export default async function CoursesPage() {
  const [session, courses] = await Promise.all([
    getServerSession(authOptions),
    prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        teacher: true,
        slots: {
          orderBy: { startTime: "asc" },
        },
      },
    }),
  ]);

  const now = new Date();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#000000]">
            Offres de cours & échanges
          </h1>
          <p className="mt-2 text-sm text-black/70">
            Cours en ligne ou en présentiel, échanges de matières et offres gratuites proposées par la communauté.
          </p>
        </div>
        <a
          href="/courses/new"
          className="rounded-full bg-[#4A70A9] px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-[#8FABD4]"
        >
          Proposer une offre
        </a>
      </header>

      {courses.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-sm text-black/70 shadow-sm">
          Aucune offre n&apos;est encore publiée. Connecte-toi avec Google et
          sois le premier à proposer un cours ou un échange !
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => {
            const activeSlot = course.slots.find(
              (slot) =>
                new Date(slot.startTime) <= now &&
                (!slot.endTime || new Date(slot.endTime) >= now),
            );
            const nextSlot =
              activeSlot == null
                ? course.slots.find((slot) => new Date(slot.startTime) > now)
                : null;
            const canJoin = Boolean(activeSlot);
            const isOwner =
              course.teacherId && session?.user
                ? course.teacherId === (session.user as any).id
                : false;

            return (
              <article
                key={course.id}
                className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm"
              >
                <div>
                  <h2 className="text-xl font-semibold text-[#000000]">
                    {course.title}
                  </h2>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[#4A70A9]">
                    {course.subject} · {course.level}
                  </p>
                  <p className="mt-1 text-xs text-black/60">
                    {course.modality === "ONLINE" && "En ligne (Google Meet)"}
                    {course.modality === "IN_PERSON" && "En présentiel"}
                    {course.modality === "FLEXIBLE" &&
                      "En ligne ou présentiel, à définir avec l'enseignant"}
                  </p>
                  <p className="mt-3 text-sm text-black/75">
                    {course.description}
                  </p>
                  {course.slots.length > 0 && (
                    <div className="mt-3 text-xs text-black/70">
                      <p className="mb-1 font-semibold">
                        Créneaux disponibles :
                      </p>
                      <ul className="space-y-1">
                        {course.slots.slice(0, 3).map((slot) => (
                          <li key={slot.id}>
                            {new Date(slot.startTime).toLocaleDateString(
                              "fr-FR",
                              {
                                weekday: "short",
                                day: "2-digit",
                                month: "2-digit",
                              },
                            )}{" "}
                            à{" "}
                            {new Date(slot.startTime).toLocaleTimeString(
                              "fr-FR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                            {slot.location && ` · ${slot.location}`}
                          </li>
                        ))}
                        {course.slots.length > 3 && (
                          <li>+ {course.slots.length - 3} autres créneaux</li>
                        )}
                      </ul>
                    </div>
                  )}
                  <p className="mt-2 text-sm font-medium text-[#000000]">
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
                  {course.teacher && (
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-black/5 bg-[#EFECE3]/60 p-2">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-xs font-medium text-[#000000]">
                            Enseignant
                          </p>
                          <a
                            href={`/profile/${course.teacher.id}`}
                            className="text-xs text-[#4A70A9] hover:underline"
                          >
                            {course.teacher.name ?? course.teacher.email} →
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  <a
                    href={`/courses/${course.id}`}
                    className="mt-2 inline-flex text-[11px] font-medium text-[#4A70A9] hover:text-[#8FABD4]"
                  >
                    Voir le détail du cours →
                  </a>
                  {!canJoin && nextSlot && (
                    <p className="mt-1 text-xs text-[#4A70A9]">
                      Lien actif à{" "}
                      {new Date(nextSlot.startTime).toLocaleTimeString(
                        "fr-FR",
                        { hour: "2-digit", minute: "2-digit" },
                      )}{" "}
                      le{" "}
                      {new Date(nextSlot.startTime).toLocaleDateString(
                        "fr-FR",
                        { day: "2-digit", month: "2-digit" },
                      )}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  {canJoin ? (
                    <a
                      href={course.googleMeetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-[#4A70A9] px-4 py-1.5 font-medium text-white hover:bg-[#8FABD4]"
                    >
                      Rejoindre sur Google Meet
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="cursor-not-allowed rounded-full bg-gray-300 px-4 py-1.5 font-medium text-gray-700"
                    >
                      Lien indisponible pour le moment
                    </button>
                  )}
                  {isOwner && <DeleteCourseButton courseId={course.id} />}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

