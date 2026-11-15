import { getBookings } from "@/actions/getBookings";
import { getHotelById } from "@/actions/getHotelById";
import HotelDetailsClient from "@/components/hotel/HotelDetailsClient";
import HotelStatusBadge from "@/components/hotel/HotelStatusBadge";
import AuthorCard from "@/components/user/AuthorCard";
import { HOTEL_STATUS, canManage } from "@/lib/admin";
import { getPublicProfile } from "@/lib/users";
import { auth } from "@clerk/nextjs";

interface HotelDetailsProps {
    params: {
        hotelId: string
    }
}

const HotelDetails = async ({ params }: HotelDetailsProps) => {
    const hotel = await getHotelById(params.hotelId)
    if (!hotel) return <div>Oop! Hotel with the given Id not found.</div>

    // Hotels that are not approved yet are only visible to their author and super admins.
    const { userId } = auth()
    const isApproved = hotel.status === HOTEL_STATUS.APPROVED
    if (!isApproved && !canManage(hotel.userId, userId)) {
        return <div>Oop! Hotel with the given Id not found.</div>
    }

    const [bookings, author] = await Promise.all([
        getBookings(hotel.id),
        getPublicProfile(hotel.userId),
    ])

    return (<div className="flex flex-col gap-4">
        {!isApproved && <div className="flex items-center gap-2 text-sm mt-2">
            <HotelStatusBadge status={hotel.status} />
            <span className="text-primary/70">
                {hotel.status === HOTEL_STATUS.PENDING
                    ? "This hotel is waiting for validation and is not publicly listed yet."
                    : "This hotel was rejected and is not publicly listed."}
            </span>
        </div>}
        <HotelDetailsClient hotel={hotel} bookings={bookings} />
        <AuthorCard profile={author} addedAt={hotel.addedAt} />
    </div>);
}

export default HotelDetails;
