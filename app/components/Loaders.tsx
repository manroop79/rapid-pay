import { Skeleton } from "@/components/ui/skeleton";

export function BalanceSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-14 w-full" />
            </div>
        </div>
    );
}