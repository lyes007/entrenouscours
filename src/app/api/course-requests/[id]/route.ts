import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentification requise." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { status } = body as { status?: "ACCEPTED" | "DECLINED" };

    if (status !== "ACCEPTED" && status !== "DECLINED") {
      return NextResponse.json(
        { error: "Statut invalide. Utilise ACCEPTED ou DECLINED." },
        { status: 400 },
      );
    }

    const requestRecord = await prisma.courseRequest.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!requestRecord) {
      return NextResponse.json(
        { error: "Demande introuvable." },
        { status: 404 },
      );
    }

    if (
      !requestRecord.course.teacherId ||
      requestRecord.course.teacherId !== (session.user as any).id
    ) {
      return NextResponse.json(
        { error: "Tu ne peux gérer que les demandes de tes propres cours." },
        { status: 403 },
      );
    }

    const updated = await prisma.courseRequest.update({
      where: { id: requestRecord.id },
      data: { status },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("[COURSE_REQUEST_UPDATE_ERROR]", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la mise à jour de la demande." },
      { status: 500 },
    );
  }
}


