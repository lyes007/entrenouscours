"use client";

import { useState } from "react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  _count: {
    courses: number;
    courseRequests: number;
  };
}

interface UsersTableProps {
  initialUsers: User[];
}

export function UsersTable({ initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loading, setLoading] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const handleDeleteUser = async (userId: string) => {
    setLoading(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Erreur lors de la suppression");
        return;
      }

      setUsers(users.filter((u) => u.id !== userId));
      setShowDeleteModal(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Erreur lors de la suppression");
    } finally {
      setLoading(null);
    }
  };

  const handleChangeRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "STUDENT" ? "TEACHER" : "STUDENT";
    setLoading(userId);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Erreur lors de la mise à jour");
        return;
      }

      const updatedUser = await response.json();
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: updatedUser.role } : u))
      );
    } catch (error) {
      console.error("Error changing role:", error);
      alert("Erreur lors de la mise à jour");
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
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Cours créés
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Demandes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Date d'inscription
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {user.name || "—"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {user.email || "—"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      user.role === "TEACHER"
                        ? "bg-blue-100 text-blue-800"
                        : user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {user._count.courses}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {user._count.courseRequests}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                  <button
                    onClick={() => handleChangeRole(user.id, user.role)}
                    disabled={loading === user.id || user.role === "ADMIN"}
                    className="mr-2 text-[#4A70A9] hover:text-[#8FABD4] disabled:opacity-50"
                  >
                    {loading === user.id ? "..." : "Changer rôle"}
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(user.id)}
                    disabled={loading === user.id || user.role === "ADMIN"}
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
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteModal)}
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

