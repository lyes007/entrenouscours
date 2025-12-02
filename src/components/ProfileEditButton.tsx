"use client";

import Link from "next/link";

export function ProfileEditButton() {
  return (
    <Link
      href="/profile/edit"
      className="inline-flex items-center gap-2 rounded-xl border border-[#4A70A9] bg-white px-4 py-2 text-sm font-medium text-[#4A70A9] transition-colors hover:bg-[#4A70A9] hover:text-white"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
      Modifier le profil
    </Link>
  );
}

