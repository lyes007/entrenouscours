"use client";

import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

export function Header() {
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <header className="border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo EntreNousCours" width={40} height={40} />
          <span className="text-lg font-semibold tracking-tight text-[#000000]">
            Entre<span className="text-[#4A70A9]">Nous</span>Cours
          </span>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-[#000000] md:flex">
          <a href="#fonctionnement" className="hover:text-[#4A70A9]">
            Fonctionnement
          </a>
          <a href="#offre" className="hover:text-[#4A70A9]">
            Pour les étudiants
          </a>
          <a href="#enseignants" className="hover:text-[#4A70A9]">
            Pour les enseignants
          </a>
          <a href="#temoignages" className="hover:text-[#4A70A9]">
            Témoignages
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {status === "authenticated" && user ? (
            <>
              <div className="hidden items-center gap-2 text-sm text-black/80 md:flex">
                {user.image && (
                  <Image
                    src={user.image}
                    alt={user.name ?? "Profil"}
                    width={28}
                    height={28}
                    className="rounded-full border border-black/10"
                  />
                )}
                <span className="max-w-[140px] truncate">
                  Bonjour, <span className="font-semibold">{user.name ?? user.email}</span>
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="rounded-full border border-black/10 px-4 py-1.5 text-sm font-medium text-[#000000] hover:border-[#4A70A9] hover:text-[#4A70A9]"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => signIn("google")}
                className="hidden rounded-full border border-[#4A70A9] px-4 py-1.5 text-sm font-medium text-[#4A70A9] hover:bg-[#4A70A9] hover:text-white md:inline-flex"
              >
                Se connecter
              </button>
              <a
                href="/courses"
                className="rounded-full bg-[#4A70A9] px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-[#8FABD4]"
              >
                Commencer gratuitement
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}


