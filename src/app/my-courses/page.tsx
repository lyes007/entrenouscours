import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { DashboardStats } from "@/components/DashboardStats";
import { CourseManagementCard } from "@/components/CourseManagementCard";

export default async function MyCoursesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  const userId = (session.user as any).id;

  const courses = await prisma.course.findMany({
    where: { teacherId: userId },
    include: {
      slots: {
        orderBy: { startTime: "asc" },
      },
      requests: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate statistics
  const totalCourses = courses.length;
  const allRequests = courses.flatMap((c) => c.requests);
  const totalRequests = allRequests.length;
  const pendingRequests = allRequests.filter((r) => r.status === "PENDING").length;
  const acceptedRequests = allRequests.filter((r) => r.status === "ACCEPTED").length;
  const declinedRequests = allRequests.filter((r) => r.status === "DECLINED").length;

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-5">
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Mes cours</h1>
          <p className="mt-1 text-[11px] sm:text-xs text-white/80">
            Gérez tous vos cours et les demandes d&apos;inscription
          </p>
        </div>

        {totalCourses === 0 ? (
          <div className="rounded-2xl border border-white/20 bg-white/95 backdrop-blur-sm p-6 text-center shadow-lg">
            <svg
              className="mx-auto h-10 w-10 text-black/20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h2 className="mt-3 text-lg font-semibold text-[#000000]">
              Aucun cours pour le moment
            </h2>
            <p className="mt-1 text-xs text-black/60">
              Commencez par créer votre premier cours
            </p>
            <a
              href="/courses/new"
              className="mt-4 inline-flex rounded-lg bg-[#4A70A9] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#8FABD4]"
            >
              Créer mon premier cours
            </a>
          </div>
        ) : (
          <>
            <DashboardStats
              totalCourses={totalCourses}
              totalRequests={totalRequests}
              pendingRequests={pendingRequests}
              acceptedRequests={acceptedRequests}
              declinedRequests={declinedRequests}
            />

            <div className="mt-4">
              <h2 className="mb-3 text-sm font-semibold text-white">Mes cours publiés</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                <CourseManagementCard
                  key={course.id}
                  course={{
                    id: course.id,
                    title: course.title,
                    description: course.description,
                    subject: course.subject,
                    level: course.level,
                    modality: course.modality,
                    offerType: course.offerType,
                    pricePerHour: course.pricePerHour,
                    currency: course.currency,
                    exchangeSubject: course.exchangeSubject,
                    imageUrl: course.imageUrl,
                    slots: course.slots.map((slot) => ({
                      id: slot.id,
                      startTime: slot.startTime.toISOString(),
                      endTime: slot.endTime?.toISOString() || null,
                      location: slot.location,
                      notes: slot.notes,
                    })),
                    requests: course.requests.map((req) => ({
                      id: req.id,
                      studentName: req.studentName,
                      studentEmail: req.studentEmail,
                      paymentMethod: req.paymentMethod,
                      proposedTime: req.proposedTime,
                      proposedLocation: req.proposedLocation,
                      message: req.message,
                      status: req.status,
                    })),
                  }}
                />
              ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

