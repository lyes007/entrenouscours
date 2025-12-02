import Image from "next/image";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#EFECE3]">
      <Header />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-12">
        {/* Hero section */}
        <section className="flex flex-col items-start gap-10 pb-16 pt-8 md:flex-row md:items-center">
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center rounded-full bg-[#8FABD4]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#4A70A9]">
              Plateforme tunisienne de cours entre pairs
            </span>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#000000] md:text-5xl">
              Apprends et enseigne
              <br />
              <span className="text-[#4A70A9]">entre étudiants et professeurs</span>
          </h1>
            <p className="max-w-xl text-base leading-relaxed text-black/70">
              EntreNousCours connecte les étudiants tunisiens et les enseignants
              pour des cours en ligne via Google Meet ou en présentiel. Publie
              tes compétences, trouve de l&apos;aide, et construis ton parcours
              à ton rythme.
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
                className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-medium text-[#000000] hover:border-[#4A70A9] hover:text-[#4A70A9]"
              >
                Proposer un cours Google Meet
          </a>
        </div>
            <p className="text-xs text-black/60">
              Cours individuels ou en petits groupes · Evaluation après chaque
              session · Accès gratuit à la plateforme
            </p>
          </div>

          <div className="flex-1 space-y-4 md:space-y-6">
            {/* Bloc vidéo plein largeur, sans fond blanc ni libellés */}
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

            {/* Bloc exemples de classes */}
            <div className="grid gap-3 text-xs text-black/70 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="font-semibold text-[#000000]">Maths Bac</p>
                <p className="mt-1">
                  Révisions intensives en petits groupes avec exercices ciblés.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="font-semibold text-[#000000]">
                  Anglais conversation
                </p>
                <p className="mt-1">
                  Sessions hebdomadaires avec des pairs pour pratiquer à l&apos;oral.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
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

        <section
          id="offre"
          className="grid gap-8 border-t border-black/5 py-12 md:grid-cols-2"
        >
          <div>
            <h2 className="text-2xl font-semibold text-[#000000]">
              Pour les étudiants
            </h2>
            <p className="mt-3 text-sm text-black/70">
              Trouve de l&apos;aide ciblée sur les matières qui comptent pour
              toi : préparation au bac, soutien universitaire ou compétences
              pratiques.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-black/80">
              <li>✓ Accès à des pairs et à des professeurs motivés</li>
              <li>✓ Cours en ligne via Google Meet ou en présentiel</li>
              <li>✓ Système d&apos;évaluation après chaque session</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[#000000]">
              Pour les enseignants
            </h2>
            <p className="mt-3 text-sm text-black/70">
              Crée ta vitrine digitale, planifie tes classes en ligne et
              développe ta communauté d&apos;apprenants.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-black/80">
              <li>✓ Profil professionnel complet avec matières et niveaux</li>
              <li>✓ Gestion simple des sessions Google Meet</li>
              <li>✓ Historique des avis et retours des étudiants</li>
            </ul>
          </div>
        </section>

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
