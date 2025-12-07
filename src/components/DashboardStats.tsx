interface DashboardStatsProps {
  totalCourses: number;
  totalRequests: number;
  pendingRequests: number;
  acceptedRequests: number;
  declinedRequests: number;
}

export function DashboardStats({
  totalCourses,
  totalRequests,
  pendingRequests,
  acceptedRequests,
  declinedRequests,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
      <div className="rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-black/60">
              Total cours
            </p>
            <p className="mt-1 text-xl font-bold text-[#000000]">{totalCourses}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4A70A9]/10">
            <svg
              className="h-4 w-4 text-[#4A70A9]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-black/60">
              Demandes totales
            </p>
            <p className="mt-1 text-xl font-bold text-[#000000]">{totalRequests}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8FABD4]/20">
            <svg
              className="h-4 w-4 text-[#4A70A9]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-orange-200 bg-orange-50/80 backdrop-blur-sm p-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-orange-700">
              En attente
            </p>
            <p className="mt-1 text-xl font-bold text-orange-700">{pendingRequests}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
            <svg
              className="h-4 w-4 text-orange-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm p-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-black/60">
              Acceptées
            </p>
            <p className="mt-1 text-xl font-bold text-green-600">{acceptedRequests}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
            <svg
              className="h-4 w-4 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

