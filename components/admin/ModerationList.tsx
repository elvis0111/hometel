'use client'

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Check, Eye, Loader2, PencilLine, RotateCcw, X } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { HotelWithRooms } from "../hotel/AddHotelForm";
import HotelStatusBadge from "../hotel/HotelStatusBadge";
import { Avatar } from "../user/AuthorCard";
import { PublicProfile } from "@/lib/users";
import useLocation from "@/hooks/useLocation";

interface ModerationListProps {
    title: string
    hotels: HotelWithRooms[]
    authors: Record<string, PublicProfile>
    emptyText: string
}

const ModerationList = ({ title, hotels, authors, emptyText }: ModerationListProps) => {
    const [busy, setBusy] = useState<string | null>(null)
    const router = useRouter()
    const { toast } = useToast()
    const { getCountryByCode } = useLocation()

    const setStatus = async (hotelId: string, status: string) => {
        setBusy(hotelId + status)
        try {
            await axios.patch(`/api/admin/hotel/${hotelId}`, { status })
            toast({
                variant: "success",
                description: status === 'APPROVED' ? '✅ Hotel approved' : status === 'REJECTED' ? 'Hotel rejected' : 'Hotel moved back to review',
            })
            router.refresh()
        } catch (error) {
            console.log(error)
            toast({ variant: "destructive", description: 'Something went wrong!' })
        } finally {
            setBusy(null)
        }
    }

    return (<section>
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        {hotels.length === 0 && <div className="text-primary/70 text-sm">{emptyText}</div>}
        <div className="flex flex-col gap-3">
            {hotels.map((hotel) => {
                const author = authors[hotel.userId]
                const country = getCountryByCode(hotel.country)
                return <div key={hotel.id} className="flex flex-col md:flex-row gap-4 rounded-lg border border-primary/10 bg-background/50 p-3">
                    <div className="relative w-full md:w-48 h-32 shrink-0 overflow-hidden rounded-md">
                        <Image fill src={hotel.image} alt={hotel.title} className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-base">{hotel.title}</span>
                            <HotelStatusBadge status={hotel.status} />
                        </div>
                        <div className="text-primary/70">{country?.name}{hotel.city ? `, ${hotel.city}` : ''} · {hotel.rooms.length} {hotel.rooms.length === 1 ? 'room' : 'rooms'}</div>
                        <div className="text-primary/80 line-clamp-2">{hotel.description}</div>
                        {author && <Link href={`/users/${author.id}`} className="flex items-center gap-2 mt-1 w-fit hover:underline">
                            <Avatar profile={author} size={24} />
                            <span>Added by <span className="font-medium">{author.name}</span> on {new Date(hotel.addedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </Link>}
                    </div>
                    <div className="flex md:flex-col gap-2 flex-wrap justify-end">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/hotel-details/${hotel.id}`)}><Eye className="mr-2 h-4 w-4" />View</Button>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/hotel/${hotel.id}`)}><PencilLine className="mr-2 h-4 w-4" />Edit</Button>
                        {hotel.status !== 'APPROVED' && <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={!!busy} onClick={() => setStatus(hotel.id, 'APPROVED')}>
                            {busy === hotel.id + 'APPROVED' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}Approve
                        </Button>}
                        {hotel.status !== 'REJECTED' && <Button size="sm" variant="destructive" disabled={!!busy} onClick={() => setStatus(hotel.id, 'REJECTED')}>
                            {busy === hotel.id + 'REJECTED' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}Reject
                        </Button>}
                        {hotel.status !== 'PENDING' && <Button size="sm" variant="ghost" disabled={!!busy} onClick={() => setStatus(hotel.id, 'PENDING')}>
                            {busy === hotel.id + 'PENDING' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCcw className="mr-2 h-4 w-4" />}Back to review
                        </Button>}
                    </div>
                </div>
            })}
        </div>
    </section>);
}

export default ModerationList;
