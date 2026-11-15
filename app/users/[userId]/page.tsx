import HotelList from "@/components/hotel/HotelList";
import { Avatar } from "@/components/user/AuthorCard";
import { HOTEL_STATUS } from "@/lib/admin";
import prismadb from "@/lib/prismadb";
import { getPublicProfile } from "@/lib/users";

interface UserProfileProps {
    params: {
        userId: string
    }
}

/** Public profile of a hotel author: name, picture, member since and approved hotels. */
const UserProfile = async ({ params }: UserProfileProps) => {
    const [profile, hotels] = await Promise.all([
        getPublicProfile(params.userId),
        prismadb.hotel.findMany({
            where: { userId: params.userId, status: HOTEL_STATUS.APPROVED },
            include: { rooms: true },
        }),
    ])

    const memberSince = profile.memberSince
        ? new Date(profile.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : null

    return (<div className="flex flex-col gap-6 py-4">
        <div className="flex items-center gap-4">
            <Avatar profile={profile} size={80} />
            <div>
                <h2 className="text-2xl font-semibold">{profile.name}</h2>
                {memberSince && <div className="text-primary/70">Member since {memberSince}</div>}
                <div className="text-primary/70 text-sm">
                    {hotels.length} {hotels.length === 1 ? "hotel" : "hotels"} listed on HomeTel
                </div>
            </div>
        </div>
        {hotels.length > 0
            ? <HotelList hotels={hotels} />
            : <div className="text-primary/70">No hotels listed yet.</div>}
    </div>);
}

export default UserProfile;
