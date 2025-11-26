import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Avoid reseeding if there is already data
    const existing = await prisma.course.count();
    if (existing > 0) {
      return NextResponse.json(
        { message: "Des cours existent déjà, aucune donnée de démo ajoutée." },
        { status: 200 },
      );
    }

    const now = new Date();
    const addMinutes = (minutes: number) =>
      new Date(now.getTime() + minutes * 60 * 1000);

    await prisma.course.createMany({
      data: [
        {
          title: "Révisions Maths Bac – Limites & Continuité",
          description:
            "Séances ciblées sur les exercices classiques du bac : limites, continuité, dérivées et études de fonctions.",
          subject: "Mathématiques",
          level: "Bac",
          googleMeetUrl: "https://meet.google.com/demo-maths-bac",
          offerType: "PAID",
          pricePerHour: 20,
          currency: "TND",
          modality: "ONLINE",
          availability: "Soirs de semaine et dimanche matin",
          exchangeSubject: null,
          capacity: 6,
        },
        {
          title: "Atelier conversation en anglais – niveau intermédiaire",
          description:
            "Discussions guidées autour de thèmes du quotidien pour améliorer ton aisance à l’oral.",
          subject: "Anglais",
          level: "Licence / Prépa",
          googleMeetUrl: "https://meet.google.com/demo-english-conversation",
          offerType: "FREE",
          pricePerHour: null,
          currency: "TND",
          modality: "ONLINE",
          availability: "Mercredi soir et samedi après-midi",
          exchangeSubject: null,
          capacity: 8,
        },
        {
          title: "Découverte du développement web",
          description:
            "Introduction pratique au HTML, CSS et JavaScript pour créer ta première page web.",
          subject: "Informatique",
          level: "Lycée / Débutant",
          googleMeetUrl: "https://meet.google.com/demo-web-dev",
          offerType: "EXCHANGE",
          pricePerHour: null,
          currency: "TND",
          modality: "FLEXIBLE",
          availability: "Horaires flexibles le week-end",
          exchangeSubject: "Aide en anglais ou mathématiques",
          capacity: 5,
        },
      ],
    });

    const seededCourses = await prisma.course.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Create a couple of time slots per course
    for (const [index, course] of seededCourses.entries()) {
      const baseOffset = index * 180; // Décale un peu chaque cours

      await prisma.courseSlot.createMany({
        data: [
          {
            courseId: course.id,
            startTime: addMinutes(60 + baseOffset),
            endTime: addMinutes(120 + baseOffset),
            location:
              course.modality === "IN_PERSON" || course.modality === "FLEXIBLE"
                ? "Bibliothèque centrale de Tunis"
                : null,
            notes: "Petit groupe, idéal pour poser toutes tes questions.",
          },
          {
            courseId: course.id,
            startTime: addMinutes(300 + baseOffset),
            endTime: addMinutes(360 + baseOffset),
            location:
              course.modality === "IN_PERSON" || course.modality === "FLEXIBLE"
                ? "Café calme près de la fac"
                : null,
            notes: "Session de révision rapide avant les examens.",
          },
        ],
      });
    }

    return NextResponse.json(
      { message: "Données de démonstration créées avec succès." },
      { status: 201 },
    );
  } catch (error) {
    console.error("[SEED_DEMO_ERROR]", error);
    return NextResponse.json(
      { error: "Impossible d'insérer les données de démonstration." },
      { status: 500 },
    );
  }
}


