import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding demo data for EntreNousCours...");

  // Optionnel : on nettoie d'abord les anciens cours/slots
  await prisma.courseSlot.deleteMany();
  await prisma.course.deleteMany();

  const now = new Date();
  const addMinutes = (minutes: number) =>
    new Date(now.getTime() + minutes * 60 * 1000);

  const courses = await prisma.course.createMany({
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

  console.log(`Inserted ${courses.count} demo courses`);

  const seededCourses = await prisma.course.findMany({
    orderBy: { createdAt: "asc" },
  });

  for (const [index, course] of seededCourses.entries()) {
    const baseOffset = index * 180;

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

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


