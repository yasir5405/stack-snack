"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function QuestionCardSkeleton() {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      {/* Top Row: Title + Edit/Delete (hidden in skeleton) */}
      <div className="flex flex-col-reverse items-center justify-between gap-5 sm:flex-row">
        <div className="flex-1">
          {/* timestamp (mobile only) */}
          <Skeleton className="h-3 w-24 sm:hidden mb-2" />

          {/* title */}
          <Skeleton className="h-6 w-3/4" />
        </div>

        {/* Right side action buttons placeholder (if needed) */}
        <div className="hidden sm:flex gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>

      {/* Tags */}
      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-6 w-20 rounded-md" />
        ))}
      </div>

      {/* Bottom metrics */}
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        {/* Author metric */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex flex-col">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20 max-sm:hidden" />
          </div>
        </div>

        {/* vote / answers / views */}
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-4 w-6" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-4 w-6" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-4 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
