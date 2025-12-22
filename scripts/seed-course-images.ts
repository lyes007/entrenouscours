/**
 * Script to seed course images directly in the database
 * Run with: npx tsx scripts/seed-course-images.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COURSE_IMAGES = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCPsBF4JpEKOvW23Mg1pbXupQJtonURRh-Ag&s",
  "https://img.freepik.com/premium-vector/boy-studying-with-laptop-online-learning-education-vector-illustration_7087-1886.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIhg-aaxfGQDcxiYNQiIACqfy3M3vwy_JFcQ&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlnSRf5gTB_HVJwAyKmpoVW2ujh0yk6Xh82A&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgtpPZbG2BUS5k7MQPR45exsq5r7CDnwugmA&s",
];

function getRandomImage(): string {
  const randomIndex = Math.floor(Math.random() * COURSE_IMAGES.length);
  return COURSE_IMAGES[randomIndex];
}

async function main() {
  console.log("🖼️  Début de l'ajout d'images aux cours...");

  const courses = await prisma.course.findMany();

  if (courses.length === 0) {
    console.log("❌ Aucun cours trouvé dans la base de données");
    return;
  }

  console.log(`📚 ${courses.length} cours trouvés`);

  let updated = 0;
  for (const course of courses) {
    const randomImage = getRandomImage();
    await prisma.course.update({
      where: { id: course.id },
      data: { imageUrl: randomImage },
    });
    updated++;
    console.log(`✅ Cours "${course.title}" mis à jour avec image`);
  }

  console.log(`\n✨ ${updated} cours mis à jour avec succès !`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

