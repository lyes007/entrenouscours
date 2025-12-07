import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentification requise pour publier un cours." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      subject,
      level,
      googleMeetUrl,
      imageUrl,
      offerType,
      pricePerHour,
      modality,
      availability,
      exchangeSubject,
      slots,
    } = body;

    const missingFields: string[] = [];

    if (!title) missingFields.push("title");
    if (!description) missingFields.push("description");
    if (!subject) missingFields.push("subject");
    if (!level) missingFields.push("level");
    if (!googleMeetUrl) missingFields.push("googleMeetUrl");

    const validSlots =
      Array.isArray(slots) && slots.length > 0
        ? slots.filter(
            (slot: any) => typeof slot.startTime === "string" && slot.startTime.length > 0,
          )
        : [];

    if (validSlots.length === 0) {
      missingFields.push("slots");
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error:
            "Tous les champs obligatoires ne sont pas remplis (au moins un créneau requis).",
          missingFields,
        },
        { status: 400 },
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        subject,
        level,
        googleMeetUrl,
        imageUrl: imageUrl || null,
        offerType,
        pricePerHour: pricePerHour ?? null,
        modality,
        availability: availability || "Voir créneaux",
        exchangeSubject: exchangeSubject ?? null,
        teacherId: (session.user as any).id ?? null,
        slots: {
          create: validSlots.map((slot: any) => ({
            startTime: new Date(slot.startTime),
            endTime: slot.endTime ? new Date(slot.endTime) : null,
            location: slot.location || null,
            notes: slot.notes || null,
          })),
        },
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("[COURSE_CREATE_ERROR]", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création du cours." },
      { status: 500 },
    );
  }
}

