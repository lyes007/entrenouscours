import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CourseImage } from "@/components/CourseImage";
import { DeleteCourseIconButton } from "@/components/DeleteCourseIconButton";

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
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-10 sm:mb-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90 backdrop-blur-sm sm:text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
                Plateforme communautaire
              </div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                Offres de cours & échanges
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
                Cours en ligne ou en présentiel, échanges de matières et offres gratuites proposées par la communauté.
              </p>
            </div>
            <div className="flex-shrink-0 sm:ml-6">
              <a
                href="/courses/new"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#4A70A9] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4A70A9]/30 transition-all duration-200 hover:bg-[#8FABD4] hover:shadow-xl hover:shadow-[#4A70A9]/40 hover:scale-105 active:scale-95 sm:px-8 sm:py-3.5 sm:text-base"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <span>Proposer une offre</span>
              </a>
            </div>
          </div>
        </header>

      {courses.length === 0 ? (
        <p className="rounded-2xl bg-white/90 backdrop-blur-sm p-6 text-sm text-black/70 shadow-lg">
          Aucune offre n&apos;est encore publiée. Connecte-toi avec Google et
          sois le premier à proposer un cours ou un échange !
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                className="course-card group"
              >
                <div className="top-section">
                  <div className="border"></div>
                  <div className="image-container">
                    <CourseImage
                      imageUrl={course.imageUrl}
                      alt={course.title}
                      width={300}
                      height={150}
                      className="w-full h-full"
                      fill
                    />
                  </div>
                  <div className="icons">
                    <div className="logo">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 94 94"
                        className="svg"
                      >
                        <path
                          fill="white"
                          d="M38.0481 4.82927C38.0481 2.16214 40.018 0 42.4481 0H51.2391C53.6692 0 55.6391 2.16214 55.6391 4.82927V40.1401C55.6391 48.8912 53.2343 55.6657 48.4248 60.4636C43.6153 65.2277 36.7304 67.6098 27.7701 67.6098C18.8099 67.6098 11.925 65.2953 7.11548 60.6663C2.37183 56.0036 3.8147e-06 49.2967 3.8147e-06 40.5456V4.82927C3.8147e-06 2.16213 1.96995 0 4.4 0H13.2405C15.6705 0 17.6405 2.16214 17.6405 4.82927V39.1265C17.6405 43.7892 18.4805 47.2018 20.1605 49.3642C21.8735 51.5267 24.4759 52.6079 27.9678 52.6079C31.4596 52.6079 34.0127 51.5436 35.6268 49.4149C37.241 47.2863 38.0481 43.8399 38.0481 39.0758V4.82927Z"
                        ></path>
                        <path
                          fill="white"
                          d="M86.9 61.8682C86.9 64.5353 84.9301 66.6975 82.5 66.6975H73.6595C71.2295 66.6975 69.2595 64.5353 69.2595 61.8682V4.82927C69.2595 2.16214 71.2295 0 73.6595 0H82.5C84.9301 0 86.9 2.16214 86.9 4.82927V61.8682Z"
                        ></path>
                        <path
                          fill="white"
                          d="M2.86102e-06 83.2195C2.86102e-06 80.5524 1.96995 78.3902 4.4 78.3902H83.6C86.0301 78.3902 88 80.5524 88 83.2195V89.1707C88 91.8379 86.0301 94 83.6 94H4.4C1.96995 94 0 91.8379 0 89.1707L2.86102e-06 83.2195Z"
                        ></path>
                      </svg>
                    </div>
                    <div className="action-buttons">
                      {canJoin ? (
                        <a
                          href={course.googleMeetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="action-btn"
                          title="Rejoindre le cours"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            className="svg-icon"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                          </svg>
                        </a>
                      ) : (
                        <span className="action-btn disabled" title="Cours non disponible">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            className="svg-icon"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 11h-2v-2h2v2zm0-4h-2V7h2v2z" />
                          </svg>
                        </span>
                      )}
                      {isOwner && (
                        <DeleteCourseIconButton courseId={course.id} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="bottom-section">
                  <a href={`/courses/${course.id}`} className="title-link">
                    <h2 className="title">{course.title}</h2>
                  </a>
                  <p className="subject-level">
                    {course.subject} · {course.level}
                  </p>
                  <div className="row row1">
                    <div className="item">
                      <span className="big-text">
                        {course.slots.length}
                      </span>
                      <span className="regular-text">Créneau{course.slots.length > 1 ? "x" : ""}</span>
                    </div>
                    <div className="item">
                      <span className="big-text">
                        {course.offerType === "FREE"
                          ? "Gratuit"
                          : course.offerType === "PAID"
                            ? course.pricePerHour
                              ? `${course.pricePerHour} TND`
                              : "Payant"
                            : "Échange"}
                      </span>
                      <span className="regular-text">
                        {course.modality === "ONLINE"
                          ? "En ligne"
                          : course.modality === "IN_PERSON"
                            ? "Présentiel"
                            : "Flexible"}
                      </span>
                    </div>
                    <div className="item">
                      <span className="big-text">
                        {course.teacher ? "✓" : "—"}
                      </span>
                      <span className="regular-text">
                        {course.teacher
                          ? course.teacher.name?.split(" ")[0] || "Prof"
                          : "Aucun"}
                      </span>
                    </div>
                  </div>
                  {course.teacher && (
                    <a
                      href={`/profile/${course.teacher.id}`}
                      className="teacher-link"
                    >
                      Par {course.teacher.name ?? course.teacher.email} →
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

