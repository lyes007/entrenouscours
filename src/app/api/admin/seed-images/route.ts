import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

const COURSE_IMAGES = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCPsBF4JpEKOvW23Mg1pbXupQJtonURRh-Ag&s",
  "https://img.freepik.com/premium-vector/boy-studying-with-laptop-online-learning-education-vector-illustration_7087-1886.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIhg-aaxfGQDcxiYNQiIACqfy3M3vwy_JFcQ&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlnSRf5gTB_HVJwAyKmpoVW2ujh0yk6Xh82A&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgtpPZbG2BUS5k7MQPR45exsq5r7CDnwugmA&s",
];

/**
 * Get a random image from the COURSE_IMAGES array
 */
function getRandomImage(): string {
  const randomIndex = Math.floor(Math.random() * COURSE_IMAGES.length);
  return COURSE_IMAGES[randomIndex];
}

export async function POST() {
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

    // Get all courses (we'll update all of them to ensure they all have images)
    const courses = await prisma.course.findMany();

    if (courses.length === 0) {
      return NextResponse.json({
        message: "Aucun cours trouvé",
        updated: 0,
      });
    }

    // Update each course with a random image (even if it already has one)
    const updatePromises = courses.map((course) =>
      prisma.course.update({
        where: { id: course.id },
        data: { imageUrl: getRandomImage() },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      message: `${courses.length} cours mis à jour avec des images`,
      updated: courses.length,
    });
  } catch (error) {
    console.error("Error seeding course images:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout des images aux cours" },
      { status: 500 }
    );
  }
}

