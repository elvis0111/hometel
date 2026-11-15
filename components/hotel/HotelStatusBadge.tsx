import { cn } from "@/lib/utils";

const STYLES: Record<string, { label: string; className: string }> = {
    PENDING: { label: "Pending review", className: "bg-amber-500/15 text-amber-600 border-amber-500/40" },
    APPROVED: { label: "Approved", className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/40" },
    REJECTED: { label: "Rejected", className: "bg-red-500/15 text-red-600 border-red-500/40" },
}

const HotelStatusBadge = ({ status, className }: { status: string, className?: string }) => {
    const style = STYLES[status] ?? STYLES.PENDING
    return <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", style.className, className)}>
        {style.label}
    </span>
}

export default HotelStatusBadge;
