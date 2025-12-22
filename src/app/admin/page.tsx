import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isAdmin } from "@/lib/admin";
import { StatsCard } from "@/components/admin/StatsCard";
import { UsersTable } from "@/components/admin/UsersTable";
import { CoursesTable } from "@/components/admin/CoursesTable";

async function getAdminData() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const [statsRes, usersRes, coursesRes] = await Promise.all([
    fetch(`${baseUrl}/api/admin/stats`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/admin/users`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/admin/courses`, { cache: "no-store" }),
  ]);

  if (!statsRes.ok || !usersRes.ok || !coursesRes.ok) {
    throw new Error("Failed to fetch admin data");
  }

  const [stats, users, courses] = await Promise.all([
    statsRes.json(),
    usersRes.json(),
    coursesRes.json(),
  ]);

  return { stats, users, courses };
}

export default async function AdminPage() {
  // Check authentication
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  // Check admin authorization
  if (!isAdmin(session.user.email)) {
    redirect("/");
  }

  // Fetch data directly using Prisma to avoid fetch issues
  const prisma = (await import("@/lib/prisma")).default;

  const [
    totalUsers,
    totalStudents,
    totalTeachers,
    totalCourses,
    pendingRequests,
    acceptedRequests,
    declinedRequests,
    users,
    courses,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.course.count(),
    prisma.courseRequest.count({ where: { status: "PENDING" } }),
    prisma.courseRequest.count({ where: { status: "ACCEPTED" } }),
    prisma.courseRequest.count({ where: { status: "DECLINED" } }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            courses: true,
            courseRequests: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.course.findMany({
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            slots: true,
            requests: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const stats = {
    users: {
      total: totalUsers,
      students: totalStudents,
      teachers: totalTeachers,
    },
    courses: {
      total: totalCourses,
    },
    requests: {
      pending: pendingRequests,
      accepted: acceptedRequests,
      declined: declinedRequests,
      total: pendingRequests + acceptedRequests + declinedRequests,
    },
  };

  // Serialize dates for client components
  const serializedUsers = users.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }));

  const serializedCourses = courses.map((course) => ({
    ...course,
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-[#EFECE3] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#4A70A9]">
            Tableau de bord Administrateur
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Gérez les utilisateurs, cours et consultez les statistiques de la plateforme
          </p>
        </div>

        {/* Stats Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Statistiques
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Utilisateurs"
              value={stats.users.total}
              icon="👥"
              subtitle={`${stats.users.students} étudiants · ${stats.users.teachers} enseignants`}
            />
            <StatsCard
              title="Total Cours"
              value={stats.courses.total}
              icon="📚"
            />
            <StatsCard
              title="Demandes en attente"
              value={stats.requests.pending}
              icon="⏳"
            />
            <StatsCard
              title="Demandes traitées"
              value={stats.requests.accepted + stats.requests.declined}
              icon="✓"
              subtitle={`${stats.requests.accepted} acceptées · ${stats.requests.declined} refusées`}
            />
          </div>
        </div>

        {/* Users Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Utilisateurs ({serializedUsers.length})
          </h2>
          <UsersTable initialUsers={serializedUsers} />
        </div>

        {/* Courses Section */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Cours ({serializedCourses.length})
          </h2>
          <CoursesTable initialCourses={serializedCourses} />
        </div>
      </div>
    </div>
  );
}

