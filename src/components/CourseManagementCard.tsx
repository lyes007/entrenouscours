"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { DeleteCourseButton } from "./DeleteCourseButton";
import { CourseImage } from "./CourseImage";

type RequestStatus = "PENDING" | "ACCEPTED" | "DECLINED";
type Modality = "ONLINE" | "IN_PERSON" | "FLEXIBLE";
type OfferType = "PAID" | "FREE" | "EXCHANGE";

interface CourseSlot {
  id: string;
  startTime: string;
  endTime: string | null;
  location: string | null;
  notes: string | null;
}

interface CourseRequest {
  id: string;
  studentName: string | null;
  studentEmail: string;
  paymentMethod: string;
  proposedTime: string;
  proposedLocation: string | null;
  message: string | null;
  status: RequestStatus;
}

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  modality: Modality;
  offerType: OfferType;
  pricePerHour: number | null;
  currency: string;
  exchangeSubject: string | null;
  imageUrl: string | null;
  slots: CourseSlot[];
  requests: CourseRequest[];
}

interface CourseManagementCardProps {
  course: Course;
}

export function CourseManagementCard({ course }: CourseManagementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const pendingCount = course.requests.filter((r) => r.status === "PENDING").length;
  const acceptedCount = course.requests.filter((r) => r.status === "ACCEPTED").length;
  const declinedCount = course.requests.filter((r) => r.status === "DECLINED").length;

  const updateRequestStatus = (id: string, status: RequestStatus) => {
    startTransition(async () => {
      const res = await fetch(`/api/course-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Impossible de mettre à jour la demande.");
        return;
      }

      router.refresh();
    });
  };

  return (
    <div
      className={`rounded-xl border shadow-lg transition-all overflow-hidden ${
        pendingCount > 0
          ? "border-orange-200 bg-orange-50/80 backdrop-blur-sm"
          : "border-white/20 bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="grid grid-cols-[100px,1fr] gap-2 p-2 sm:p-3">
        <div className="relative h-20 sm:h-24 rounded-lg overflow-hidden">
          <CourseImage
            imageUrl={course.imageUrl}
            alt={course.title}
            width={100}
            height={96}
            className="w-full h-full object-cover"
            fill
          />
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-bold text-[#000000] line-clamp-1">{course.title}</h3>
                {pendingCount > 0 && (
                  <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-semibold text-orange-700">
                    {pendingCount}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-[#4A70A9] mt-0.5">
                {course.subject} · {course.level}
              </p>
              <p className="text-[11px] text-black/70 line-clamp-1 mt-0.5">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[10px] text-black/60">
                <span>
                  {course.modality === "ONLINE" && "En ligne"}
                  {course.modality === "IN_PERSON" && "Présentiel"}
                  {course.modality === "FLEXIBLE" && "Flexible"}
                </span>
                <span>•</span>
                <span>
                  {course.offerType === "FREE" && "Gratuit"}
                  {course.offerType === "PAID" &&
                    (course.pricePerHour
                      ? `${course.pricePerHour} ${course.currency}/h`
                      : "Payant")}
                  {course.offerType === "EXCHANGE" && "Échange"}
                </span>
                <span>•</span>
                <span>{course.slots.length} créneau{course.slots.length > 1 ? "x" : ""}</span>
              </div>
            </div>
          </div>

          {/* Request Statistics - Compact */}
          {course.requests.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] font-medium text-black/60">Demandes:</span>
              {pendingCount > 0 && (
                <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[9px] font-semibold text-orange-700">
                  {pendingCount}
                </span>
              )}
              {acceptedCount > 0 && (
                <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[9px] font-semibold text-green-700">
                  {acceptedCount}
                </span>
              )}
              {declinedCount > 0 && (
                <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[9px] font-semibold text-gray-600">
                  {declinedCount}
                </span>
              )}
            </div>
          )}

          {/* Actions - Compact */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-lg border border-[#4A70A9] px-2 py-0.5 text-[10px] font-medium text-[#4A70A9] transition-colors hover:bg-[#4A70A9] hover:text-white"
            >
              {isExpanded ? "Masquer" : "Voir"} ({course.requests.length})
            </button>
            <Link
              href={`/courses/${course.id}`}
              className="rounded-lg border border-black/10 px-2 py-0.5 text-[10px] font-medium text-[#000000] transition-colors hover:border-[#4A70A9] hover:text-[#4A70A9]"
            >
              Voir
            </Link>
            <DeleteCourseButton courseId={course.id} />
          </div>
        </div>
      </div>

      {/* Expanded Requests Section */}
      {isExpanded && (
        <div className="border-t border-black/5 bg-[#EFECE3]/30 p-6">
          {course.requests.length === 0 ? (
            <p className="text-sm text-black/60">Aucune demande pour ce cours.</p>
          ) : (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-[#000000]">Toutes les demandes</h4>
              <div className="space-y-3">
                {course.requests.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-xl border border-black/10 bg-white p-4 text-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-[#000000]">
                          {req.studentName ?? req.studentEmail}
                        </p>
                        <p className="mt-0.5 text-[11px] text-black/60">{req.studentEmail}</p>
                        <div className="mt-2 space-y-1 text-black/70">
                          <p>
                            <span className="font-semibold">Paiement :</span>{" "}
                            {req.paymentMethod === "CASH" && "Espèce"}
                            {req.paymentMethod === "CARD" && "Carte"}
                            {req.paymentMethod === "EXCHANGE" && "Échange de services"}
                          </p>
                          <p>
                            <span className="font-semibold">Créneau proposé :</span>{" "}
                            {req.proposedTime}
                          </p>
                          {req.proposedLocation && (
                            <p>
                              <span className="font-semibold">Lieu proposé :</span>{" "}
                              {req.proposedLocation}
                            </p>
                          )}
                          {req.message && (
                            <p>
                              <span className="font-semibold">Message :</span> {req.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                            req.status === "PENDING"
                              ? "bg-orange-100 text-orange-700"
                              : req.status === "ACCEPTED"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {req.status === "PENDING" && "En attente"}
                          {req.status === "ACCEPTED" && "Acceptée"}
                          {req.status === "DECLINED" && "Refusée"}
                        </span>
                        {req.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={isPending}
                              onClick={() => updateRequestStatus(req.id, "ACCEPTED")}
                              className="rounded-full bg-[#4A70A9] px-3 py-1 text-[10px] font-semibold text-white transition-colors hover:bg-[#8FABD4] disabled:opacity-60"
                            >
                              Accepter
                            </button>
                            <button
                              type="button"
                              disabled={isPending}
                              onClick={() => updateRequestStatus(req.id, "DECLINED")}
                              className="rounded-full bg-red-100 px-3 py-1 text-[10px] font-semibold text-red-700 transition-colors hover:bg-red-200 disabled:opacity-60"
                            >
                              Refuser
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

