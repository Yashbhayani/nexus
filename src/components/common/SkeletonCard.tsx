import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function SkeletonPostCard() {
  return (
    <Card className="mb-4 border-0 shadow-sm">
      <CardContent className="p-4">
        {/* User Header */}
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        {/* Post Content */}
        <div className="space-y-2 mb-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        {/* Post Image */}
        <Skeleton className="w-full h-64 rounded-lg mb-3" />

        {/* Actions */}
        <div className="flex items-center gap-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonEventCard({ variant = "grid" }: { variant?: "grid" | "list" }) {
  if (variant === "list") {
    return (
      <Card className="mb-3 border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="flex gap-3 p-4">
            <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-7 w-20 ml-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <CardContent className="p-0">
        <Skeleton className="w-full h-48" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonBigEventCard() {
  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <Skeleton className="w-full h-80" />
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonProfileHeader() {
  return (
    <div className="space-y-4">
      {/* Cover Image */}
      <Skeleton className="w-full h-32" />
      
      {/* Profile Info */}
      <div className="px-4">
        <div className="flex items-start gap-4 -mt-16 mb-4">
          <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
          <div className="flex-1 mt-16">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex gap-6 mb-4">
          <Skeleton className="h-12 w-20" />
          <Skeleton className="h-12 w-20" />
          <Skeleton className="h-12 w-20" />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonOrganizationCard({ variant = "grid" }: { variant?: "grid" | "list" }) {
  if (variant === "list") {
    return (
      <Card className="mb-3 border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="flex gap-3 p-4">
            <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <CardContent className="p-0">
        <Skeleton className="w-full h-48" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonStudentCard({ variant = "grid" }: { variant?: "grid" | "list" }) {
  if (variant === "list") {
    return (
      <Card className="mb-3 border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="flex gap-3 p-4">
            <Skeleton className="w-20 h-20 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-14" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-4/5 mb-3" />
        <div className="flex gap-2 mb-3">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-14" />
        </div>
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}