const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding demo data for EntreNousCours...");

  // Nettoyer les anciennes données de cours
  await prisma.courseSlot.deleteMany();
  await prisma.course.deleteMany();

  const now = new Date();
  const addMinutes = (minutes) =>
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
      {
        title: "Physique Bac – Mécanique et électricité",
        description:
          "Séances de résolution d’exercices pour consolider les bases en mécanique et électricité avant les examens.",
        subject: "Physique",
        level: "Bac",
        googleMeetUrl: "https://meet.google.com/demo-physique-bac",
        offerType: "PAID",
        pricePerHour: 18,
        currency: "TND",
        modality: "ONLINE",
        availability: "Mardi et jeudi soir",
        exchangeSubject: null,
        capacity: 5,
      },
      {
        title: "Prépa concours ingénieur – Algèbre & Analyse",
        description:
          "Programme intensif pour préparer les concours d’entrée aux écoles d’ingénieurs : algèbre linéaire et analyse avancée.",
        subject: "Mathématiques",
        level: "Prépa",
        googleMeetUrl: "https://meet.google.com/demo-prepa-maths",
        offerType: "PAID",
        pricePerHour: 30,
        currency: "TND",
        modality: "ONLINE",
        availability: "Samedi et dimanche après-midi",
        exchangeSubject: null,
        capacity: 10,
      },
      {
        title: "Club de conversation française – niveau débutant",
        description:
          "Ateliers ludiques pour pratiquer le français oralement à travers des jeux de rôle et des mises en situation.",
        subject: "Français",
        level: "Collège / Lycée",
        googleMeetUrl: "https://meet.google.com/demo-francais-conversation",
        offerType: "FREE",
        pricePerHour: null,
        currency: "TND",
        modality: "FLEXIBLE",
        availability: "Mercredi après-midi",
        exchangeSubject: null,
        capacity: 12,
      },
      {
        title: "Initiation à la programmation Python",
        description:
          "Découvre les bases de Python à travers de petits projets : calculatrice, mini-jeu, scripts utiles.",
        subject: "Informatique",
        level: "Licence / Débutant",
        googleMeetUrl: "https://meet.google.com/demo-python",
        offerType: "EXCHANGE",
        pricePerHour: null,
        currency: "TND",
        modality: "ONLINE",
        availability: "Soirs de semaine",
        exchangeSubject: "Aide en statistiques ou anglais",
        capacity: 6,
      },
      {
        title: "Atelier CV & préparation aux entretiens",
        description:
          "Travail sur ton CV, ton profil LinkedIn et simulations d’entretiens pour stages et premiers emplois.",
        subject: "Soft Skills",
        level: "Licence / Master",
        googleMeetUrl: "https://meet.google.com/demo-career",
        offerType: "PAID",
        pricePerHour: 25,
        currency: "TND",
        modality: "FLEXIBLE",
        availability: "En soirée en semaine",
        exchangeSubject: null,
        capacity: 4,
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


