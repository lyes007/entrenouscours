"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export function Header() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 md:gap-3">
          <Image
            src="/logo.png"
            alt="Logo EntreNousCours"
            width={36}
            height={36}
            className="md:h-10 md:w-10"
          />
          <span className="text-base font-semibold tracking-tight text-[#000000] md:text-lg">
            Entre<span className="text-[#4A70A9]">Nous</span>Cours
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-[#000000] lg:flex">
          <a href="/#fonctionnement" className="transition-colors hover:text-[#4A70A9]">
            Fonctionnement
          </a>
          <a href="/#offre" className="transition-colors hover:text-[#4A70A9]">
            Pour les étudiants
          </a>
          <a href="/#enseignants" className="transition-colors hover:text-[#4A70A9]">
            Pour les enseignants
          </a>
          <a href="/#temoignages" className="transition-colors hover:text-[#4A70A9]">
            Témoignages
          </a>
        </nav>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-3 md:flex">
          {status === "authenticated" && user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm text-black/80 transition-colors hover:text-[#4A70A9]"
              >
                {user.image && (
                  <Image
                    src={user.image}
                    alt={user.name ?? "Profil"}
                    width={32}
                    height={32}
                    className="rounded-full border border-black/10"
                  />
                )}
                <span className="hidden max-w-[140px] truncate lg:inline">
                  Mon profil
                </span>
              </Link>
              <button
                onClick={() => signOut()}
                className="rounded-full border border-black/10 px-4 py-1.5 text-sm font-medium text-[#000000] transition-colors hover:border-[#4A70A9] hover:text-[#4A70A9]"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => signIn("google")}
                className="rounded-full border border-[#4A70A9] px-4 py-1.5 text-sm font-medium text-[#4A70A9] transition-colors hover:bg-[#4A70A9] hover:text-white"
              >
                Se connecter
              </button>
              <Link
                href="/courses"
                className="rounded-full bg-[#4A70A9] px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#8FABD4]"
              >
                Commencer
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 text-black/70 transition-colors hover:bg-[#4A70A9]/10 hover:text-[#4A70A9] md:hidden"
          aria-label="Menu"
        >
          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-black/5 bg-white px-4 pb-6 pt-4">
          {/* Mobile User Info */}
          {status === "authenticated" && user && (
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="mb-4 flex items-center gap-3 rounded-2xl bg-[#EFECE3] p-3 transition-colors hover:bg-[#4A70A9]/10"
            >
              {user.image && (
                <Image
                  src={user.image}
                  alt={user.name ?? "Profil"}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white shadow-sm"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#000000]">
                  {user.name ?? "Utilisateur"}
                </p>
                <p className="truncate text-xs text-black/60">{user.email}</p>
              </div>
            </Link>
          )}

          {/* Mobile Navigation Links */}
          <nav className="mb-4 space-y-1">
            <a
              href="/#fonctionnement"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[#000000] transition-colors hover:bg-[#4A70A9]/10 hover:text-[#4A70A9]"
            >
              Fonctionnement
            </a>
            <a
              href="/#offre"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[#000000] transition-colors hover:bg-[#4A70A9]/10 hover:text-[#4A70A9]"
            >
              Pour les étudiants
            </a>
            <a
              href="/#enseignants"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[#000000] transition-colors hover:bg-[#4A70A9]/10 hover:text-[#4A70A9]"
            >
              Pour les enseignants
            </a>
            <a
              href="/#temoignages"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[#000000] transition-colors hover:bg-[#4A70A9]/10 hover:text-[#4A70A9]"
            >
              Témoignages
            </a>
            <Link
              href="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[#4A70A9] transition-colors hover:bg-[#4A70A9]/10"
            >
              Voir les cours
            </Link>
            {status === "authenticated" && (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[#000000] transition-colors hover:bg-[#4A70A9]/10 hover:text-[#4A70A9]"
              >
                Mon profil
              </Link>
            )}
          </nav>

          {/* Mobile Auth Buttons */}
          <div className="space-y-2 border-t border-black/5 pt-4">
            {status === "authenticated" && user ? (
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm font-medium text-[#000000] transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              >
                Se déconnecter
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    signIn("google");
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#4A70A9] px-4 py-3 text-sm font-medium text-[#4A70A9] transition-colors hover:bg-[#4A70A9] hover:text-white"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Se connecter avec Google
                </button>
                <Link
                  href="/courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full rounded-xl bg-[#4A70A9] px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#8FABD4]"
                >
                  Commencer gratuitement
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
