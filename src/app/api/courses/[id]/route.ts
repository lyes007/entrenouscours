import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentification requise." },
        { status: 401 },
      );
    }

    const course = await prisma.course.findUnique({
      where: { id },
      select: { id: true, teacherId: true },
    });

    if (!course) {
      return NextResponse.json({ error: "Cours introuvable." }, { status: 404 });
    }

    if (!course.teacherId || course.teacherId !== (session.user as any).id) {
      return NextResponse.json(
        { error: "Tu ne peux supprimer que tes propres cours." },
        { status: 403 },
      );
    }

    await prisma.course.delete({ where: { id: course.id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[COURSE_DELETE_ERROR]", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la suppression du cours." },
      { status: 500 },
    );
  }
}


