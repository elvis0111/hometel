import { getHotelById } from "@/actions/getHotelById";
import AddHotelForm from "@/components/hotel/AddHotelForm";
import { auth } from "@clerk/nextjs";
import { canManage } from "@/lib/admin";

interface HotelPageProps {
    params: {
        hotelId: string
    }
}

const Hotel = async ({ params }: HotelPageProps) => {
    const hotel = await getHotelById(params.hotelId)
    const { userId } = auth()

    if (!userId) return <div>Not authenticated...</div>

    // The author and super admins can edit the hotel.
    if (hotel && !canManage(hotel.userId, userId)) return <div>Access denied...</div>

    return (<div>
        <AddHotelForm hotel={hotel} />
    </div>);
}

export default Hotel;