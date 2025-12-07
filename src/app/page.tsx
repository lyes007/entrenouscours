import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { CourseImage } from "@/components/CourseImage";
import Link from "next/link";

export default async function Home() {
  // Fetch latest 16 courses for the grid
  const courses = await prisma.course.findMany({
    take: 16,
    orderBy: { createdAt: "desc" },
    include: {
      teacher: true,
      slots: {
        orderBy: { startTime: "asc" },
      },
    },
  });

  const now = new Date();
  return (
    <div className="min-h-screen bg-white">
      {/* Hero vidéo pleine largeur */}
      <section className="relative -mt-[73px] overflow-hidden bg-black text-white pt-[73px]">
        <video
          src="/videobg.mp4"
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Overlay très léger avec flou discret pour garder la lisibilité du texte */}
        <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px]" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-16 md:flex-row md:items-center md:gap-10 md:px-8 md:py-24">
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#EFECE3]">
              Plateforme tunisienne de cours entre pairs
            </span>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl">
              EntreNousCours
          </h1>
            <p className="max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
              Apprends, enseigne et échange des compétences entre étudiants et
              enseignants tunisiens. Cours en ligne via Google Meet ou en
              présentiel, en toute simplicité.
          </p>
            <div className="flex flex-wrap items-center gap-4">
          <a
                href="/courses"
                className="rounded-full bg-[#4A70A9] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#8FABD4]"
              >
                Découvrir les cours disponibles
          </a>
          <a
                href="/courses/new"
                className="rounded-full border border-white/40 bg-white/10 px-5 py-2 text-sm font-medium text-white hover:border-white hover:bg-white/20"
              >
                Proposer un cours
              </a>
            </div>
            <p className="text-[11px] text-white/60">
              Cours individuels ou en petits groupes · Sessions Google Meet ou
              présentiel · Communauté 100 % tunisienne
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-0">

        {/* Section d'accroche contenu (texte + exemples de classes) */}
        <section className="mb-12 flex flex-col items-start gap-10 pt-2 md:flex-row md:items-center">
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center rounded-full bg-[#8FABD4]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#4A70A9]">
              Apprends et enseigne
            </span>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#000000] md:text-4xl">
              entre étudiants et professeurs
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-black/70">
              EntreNousCours connecte les étudiants tunisiens et les enseignants
              pour des cours en ligne via Google Meet ou en présentiel. Publie
              tes compétences, trouve de l&apos;aide, et construis ton parcours
              à ton rythme.
            </p>
            <p className="text-xs text-black/60">
              Cours individuels ou en petits groupes · Evaluation après chaque
              session · Accès gratuit à la plateforme
            </p>
          </div>

          <div className="flex-1 space-y-4 md:space-y-6">
            <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-[#8FABD4]/20 shadow-sm">
              <video
                src="/Video.mp4"
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>

            <div className="grid gap-3 text-xs text-black/70 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-4 shadow-md shadow-black/10">
                <p className="font-semibold text-[#000000]">Maths Bac</p>
                <p className="mt-1">
                  Révisions intensives en petits groupes avec exercices ciblés.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-md shadow-black/10">
                <p className="font-semibold text-[#000000]">
                  Anglais conversation
                </p>
                <p className="mt-1">
                  Sessions hebdomadaires avec des pairs pour pratiquer à l&apos;oral.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-md shadow-black/10">
                <p className="font-semibold text-[#000000]">Informatique</p>
                <p className="mt-1">
                  Introduction au développement web et aux projets concrets.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sections inspirées de LearnWorlds */}
        <section
          id="fonctionnement"
          className="grid gap-8 border-t border-black/5 py-12 md:grid-cols-3"
        >
          <div className="md:col-span-1">
            <h2 className="text-2xl font-semibold text-[#000000]">
              Comment fonctionne EntreNousCours ?
            </h2>
            <p className="mt-3 text-sm text-black/70">
              En quelques étapes, tu peux créer ton profil, publier un cours ou
              rejoindre une session en ligne sur Google Meet.
            </p>
          </div>
          <div className="md:col-span-2 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#4A70A9]">
                1. Crée ton compte
              </p>
              <p className="mt-2 text-sm text-black/80">
                Connecte-toi avec ton compte Google et renseigne ton niveau,
                tes matières fortes et celles où tu as besoin d&apos;aide.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#4A70A9]">
                2. Publie ou choisis un cours
              </p>
              <p className="mt-2 text-sm text-black/80">
                En tant qu&apos;étudiant ou enseignant, propose un cours avec un
                lien Google Meet ou découvre les sessions déjà disponibles.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#4A70A9]">
                3. Suis, échange, évalue
              </p>
              <p className="mt-2 text-sm text-black/80">
                Participe au cours, pose tes questions et laisse un avis pour
                aider la communauté à identifier les meilleures expériences.
              </p>
            </div>
          </div>
        </section>

        {/* Section Pour les étudiants */}
        <section
          id="offre-etudiants"
          className="border-t border-black/5 py-12"
        >
          <div className="rounded-3xl bg-gradient-to-br from-[#4A70A9] to-[#8FABD4] p-8 md:p-12 text-white">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-semibold text-white md:text-4xl">
                Pour les étudiants
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/90 md:text-lg">
                Trouve de l&apos;aide ciblée sur les matières qui comptent pour
                toi : préparation au bac, soutien universitaire ou compétences
                pratiques.
              </p>
              <ul className="mt-6 space-y-3 text-base text-white/95 md:text-lg">
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 text-xl">✓</span>
                  <span>Accès à des pairs et à des professeurs motivés</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 text-xl">✓</span>
                  <span>Cours en ligne via Google Meet ou en présentiel</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 text-xl">✓</span>
                  <span>Système d&apos;évaluation après chaque session</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section Pour les enseignants */}
        <section
          id="offre-enseignants"
          className="border-t border-black/5 py-12"
        >
          <div className="rounded-3xl bg-gradient-to-br from-[#EFECE3] to-[#8FABD4]/30 p-8 md:p-12 text-[#000000]">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-semibold text-[#000000] md:text-4xl">
                Pour les enseignants
              </h2>
              <p className="mt-4 text-base leading-relaxed text-black/80 md:text-lg">
                Crée ta vitrine digitale, planifie tes classes en ligne et
                développe ta communauté d&apos;apprenants.
              </p>
              <ul className="mt-6 space-y-3 text-base text-black/90 md:text-lg">
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 text-xl text-[#4A70A9]">✓</span>
                  <span>Profil professionnel complet avec matières et niveaux</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 text-xl text-[#4A70A9]">✓</span>
                  <span>Gestion simple des sessions Google Meet</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 text-xl text-[#4A70A9]">✓</span>
                  <span>Historique des avis et retours des étudiants</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Courses Grid Section */}
        {courses.length > 0 && (
          <section className="border-t border-black/5 py-12">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-[#000000]">
                  Cours disponibles
                </h2>
                <p className="mt-2 text-sm text-black/70">
                  Découvrez les cours proposés par notre communauté
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {courses.map((course) => {
                const activeSlot = course.slots.find(
                  (slot) =>
                    new Date(slot.startTime) <= now &&
                    (!slot.endTime || new Date(slot.endTime) >= now),
                );
                const canJoin = Boolean(activeSlot);

                return (
                  <article
                    key={course.id}
                    className="course-card group"
                  >
                    <div className="top-section">
                      <div className="border"></div>
                      <div className="image-container">
                        <CourseImage
                          imageUrl={course.imageUrl}
                          alt={course.title}
                          width={300}
                          height={150}
                          className="w-full h-full"
                          fill
                        />
                      </div>
                      <div className="icons">
                        <div className="logo">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 94 94"
                            className="svg"
                          >
                            <path
                              fill="white"
                              d="M38.0481 4.82927C38.0481 2.16214 40.018 0 42.4481 0H51.2391C53.6692 0 55.6391 2.16214 55.6391 4.82927V40.1401C55.6391 48.8912 53.2343 55.6657 48.4248 60.4636C43.6153 65.2277 36.7304 67.6098 27.7701 67.6098C18.8099 67.6098 11.925 65.2953 7.11548 60.6663C2.37183 56.0036 3.8147e-06 49.2967 3.8147e-06 40.5456V4.82927C3.8147e-06 2.16213 1.96995 0 4.4 0H13.2405C15.6705 0 17.6405 2.16214 17.6405 4.82927V39.1265C17.6405 43.7892 18.4805 47.2018 20.1605 49.3642C21.8735 51.5267 24.4759 52.6079 27.9678 52.6079C31.4596 52.6079 34.0127 51.5436 35.6268 49.4149C37.241 47.2863 38.0481 43.8399 38.0481 39.0758V4.82927Z"
                            ></path>
                            <path
                              fill="white"
                              d="M86.9 61.8682C86.9 64.5353 84.9301 66.6975 82.5 66.6975H73.6595C71.2295 66.6975 69.2595 64.5353 69.2595 61.8682V4.82927C69.2595 2.16214 71.2295 0 73.6595 0H82.5C84.9301 0 86.9 2.16214 86.9 4.82927V61.8682Z"
                            ></path>
                            <path
                              fill="white"
                              d="M2.86102e-06 83.2195C2.86102e-06 80.5524 1.96995 78.3902 4.4 78.3902H83.6C86.0301 78.3902 88 80.5524 88 83.2195V89.1707C88 91.8379 86.0301 94 83.6 94H4.4C1.96995 94 0 91.8379 0 89.1707L2.86102e-06 83.2195Z"
                            ></path>
                          </svg>
                        </div>
                        <div className="action-buttons">
                          {canJoin ? (
                            <a
                              href={course.googleMeetUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="action-btn"
                              title="Rejoindre le cours"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="white"
                                className="svg-icon"
                              >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                              </svg>
                            </a>
                          ) : (
                            <span className="action-btn disabled" title="Cours non disponible">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="white"
                                className="svg-icon"
                              >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 11h-2v-2h2v2zm0-4h-2V7h2v2z" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="bottom-section">
                      <Link href={`/courses/${course.id}`} className="title-link">
                        <h2 className="title">{course.title}</h2>
                      </Link>
                      <p className="subject-level">
                        {course.subject} · {course.level}
                      </p>
                      <div className="row row1">
                        <div className="item">
                          <span className="big-text">
                            {course.slots.length}
                          </span>
                          <span className="regular-text">Créneau{course.slots.length > 1 ? "x" : ""}</span>
                        </div>
                        <div className="item">
                          <span className="big-text">
                            {course.offerType === "FREE"
                              ? "Gratuit"
                              : course.offerType === "PAID"
                                ? course.pricePerHour
                                  ? `${course.pricePerHour} TND`
                                  : "Payant"
                                : "Échange"}
                          </span>
                          <span className="regular-text">
                            {course.modality === "ONLINE"
                              ? "En ligne"
                              : course.modality === "IN_PERSON"
                                ? "Présentiel"
                                : "Flexible"}
                          </span>
                        </div>
                        <div className="item">
                          <span className="big-text">
                            {course.teacher ? "✓" : "—"}
                          </span>
                          <span className="regular-text">
                            {course.teacher
                              ? course.teacher.name?.split(" ")[0] || "Prof"
                              : "Aucun"}
                          </span>
                        </div>
                      </div>
                      {course.teacher && (
                        <Link
                          href={`/profile/${course.teacher.id}`}
                          className="teacher-link"
                        >
                          Par {course.teacher.name ?? course.teacher.email} →
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="mt-8 flex justify-center">
              <Link
                href="/courses"
                className="rounded-full bg-[#4A70A9] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#8FABD4]"
              >
                Voir plus de cours
              </Link>
            </div>
          </section>
        )}

        <section
          id="temoignages"
          className="border-t border-black/5 py-12 text-sm text-black/80"
        >
          <h2 className="text-2xl font-semibold text-[#000000]">
            Ce que disent nos premiers utilisateurs
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p>
                “J&apos;ai trouvé un groupe pour réviser les maths du bac, avec
                un étudiant d&apos;une autre ville. On se voit chaque semaine
                sur Google Meet.”
              </p>
              <p className="mt-3 text-xs font-semibold text-black/60">
                Sarah, élève en terminale
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p>
                “EntreNousCours m&apos;a permis de proposer des ateliers
                d&apos;anglais conversation en ligne, sans gestion compliquée
                d&apos;outils.”
              </p>
              <p className="mt-3 text-xs font-semibold text-black/60">
                Mehdi, enseignant d&apos;anglais
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p>
                “J&apos;alterne entre recevoir de l&apos;aide en physique et
                aider en informatique. C&apos;est vraiment du donnant-donnant.”
              </p>
              <p className="mt-3 text-xs font-semibold text-black/60">
                Yassine, étudiant en licence
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 bg-white py-6 text-xs text-black/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 md:flex-row">
          <p>© {new Date().getFullYear()} EntreNousCours. Tous droits réservés.</p>
          <div className="flex gap-4">
            <button className="hover:text-[#4A70A9]">Mention légales</button>
            <button className="hover:text-[#4A70A9]">Politique de confidentialité</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
