"use client";

import { useState } from "react";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  subject: string;
  level: string;
  offerType: string;
  modality: string;
  createdAt: string;
  teacher: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  _count: {
    slots: number;
    requests: number;
  };
}

interface CoursesTableProps {
  initialCourses: Course[];
}

export function CoursesTable({ initialCourses }: CoursesTableProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [loading, setLoading] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const handleDeleteCourse = async (courseId: string) => {
    setLoading(courseId);
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Erreur lors de la suppression");
        return;
      }

      setCourses(courses.filter((c) => c.id !== courseId));
      setShowDeleteModal(null);
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Erreur lors de la suppression");
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-[#4A70A9]/20 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#EFECE3]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Matière
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Enseignant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Créneaux
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Demandes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Date création
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  <Link
                    href={`/courses/${course.id}`}
                    className="hover:text-[#4A70A9]"
                  >
                    {course.title}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {course.subject} · {course.level}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {course.teacher?.name || course.teacher?.email || "—"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      course.offerType === "FREE"
                        ? "bg-green-100 text-green-800"
                        : course.offerType === "PAID"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {course.offerType}
                  </span>
                  {" · "}
                  <span className="text-xs text-gray-500">
                    {course.modality === "ONLINE"
                      ? "En ligne"
                      : course.modality === "IN_PERSON"
                        ? "Présentiel"
                        : "Flexible"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {course._count.slots}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {course._count.requests}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {new Date(course.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                  <Link
                    href={`/courses/${course.id}`}
                    className="mr-2 text-[#4A70A9] hover:text-[#8FABD4]"
                  >
                    Voir
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(course.id)}
                    disabled={loading === course.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Confirmer la suppression
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteCourse(showDeleteModal)}
                disabled={loading === showDeleteModal}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading === showDeleteModal ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

