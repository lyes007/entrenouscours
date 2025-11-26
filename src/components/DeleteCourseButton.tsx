"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function DeleteCourseButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (!window.confirm("Es-tu sûr de vouloir supprimer ce cours ?")) return;

    startTransition(async () => {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Impossible de supprimer le cours.");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs text-red-600 hover:underline disabled:opacity-60"
    >
      {isPending ? "Suppression..." : "Supprimer"}
    </button>
  );
}


