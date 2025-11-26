import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Tu dois être connecté pour demander à rejoindre un cours." },
        { status: 401 },
      );
    }

    const course = await prisma.course.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!course) {
      return NextResponse.json({ error: "Cours introuvable." }, { status: 404 });
    }

    const body = await request.json();
    const { paymentMethod, proposedTime, proposedLocation, contactEmail, message } =
      body;

    if (!paymentMethod || !proposedTime || !contactEmail) {
      return NextResponse.json(
        { error: "Merci de renseigner le mode de paiement, un créneau et ton email." },
        { status: 400 },
      );
    }

    const created = await prisma.courseRequest.create({
      data: {
        courseId: course.id,
        studentId: (session.user as any).id ?? null,
        studentName: session.user.name ?? null,
        studentEmail: contactEmail,
        paymentMethod,
        proposedTime,
        proposedLocation: proposedLocation || null,
        message: message || null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[COURSE_REQUEST_CREATE_ERROR]", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi de la demande." },
      { status: 500 },
    );
  }
}


