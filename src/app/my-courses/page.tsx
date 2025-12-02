import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { Header } from "@/components/Header";
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
    <div className="min-h-screen bg-[#EFECE3]">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#000000]">Mes cours</h1>
          <p className="mt-2 text-sm text-black/70">
            Gérez tous vos cours et les demandes d&apos;inscription en un seul endroit.
          </p>
        </div>

        {totalCourses === 0 ? (
          <div className="rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-black/20"
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
            <h2 className="mt-4 text-xl font-semibold text-[#000000]">
              Aucun cours pour le moment
            </h2>
            <p className="mt-2 text-sm text-black/60">
              Commencez par créer votre premier cours pour partager vos compétences.
            </p>
            <a
              href="/courses/new"
              className="mt-6 inline-flex rounded-full bg-[#4A70A9] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#8FABD4]"
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

            <div className="mt-8 space-y-6">
              <h2 className="text-xl font-semibold text-[#000000]">Mes cours publiés</h2>
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
          </>
        )}
      </main>
    </div>
  );
}

