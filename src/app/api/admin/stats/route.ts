import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Check admin authorization
    if (!isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: "Non autorisé - accès administrateur requis" },
        { status: 403 }
      );
    }

    // Get statistics
    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      totalCourses,
      pendingRequests,
      acceptedRequests,
      declinedRequests,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "TEACHER" } }),
      prisma.course.count(),
      prisma.courseRequest.count({ where: { status: "PENDING" } }),
      prisma.courseRequest.count({ where: { status: "ACCEPTED" } }),
      prisma.courseRequest.count({ where: { status: "DECLINED" } }),
    ]);

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}

