import { Skeleton } from "@/components/admin/skeleton";

export default function AdminLeadsLoading() {
  return (
    <div className="grid gap-5">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-[70px] w-full" />
      <Skeleton className="h-[420px] w-full" />
    </div>
  );
}
