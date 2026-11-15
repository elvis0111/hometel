import Link from "next/link";
import Image from "next/image";
import { UserRound } from "lucide-react";
import { PublicProfile } from "@/lib/users";

const formatMemberSince = (iso: string | null) => {
    if (!iso) return null
    return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

export const Avatar = ({ profile, size = 40 }: { profile: PublicProfile, size?: number }) => {
    if (profile.imageUrl) {
        return <Image src={profile.imageUrl} alt={profile.name} width={size} height={size} className="rounded-full object-cover" style={{ width: size, height: size }} />
    }
    return <div className="rounded-full bg-primary/10 flex items-center justify-center" style={{ width: size, height: size }}>
        <UserRound className="w-1/2 h-1/2 text-primary/60" />
    </div>
}

/** "Added by" box linking to the author's public profile. */
const AuthorCard = ({ profile, addedAt }: { profile: PublicProfile, addedAt?: Date }) => {
    const memberSince = formatMemberSince(profile.memberSince)
    return <Link href={`/users/${profile.id}`} className="flex items-center gap-3 rounded-lg border border-primary/10 bg-background/50 p-3 w-fit hover:bg-background transition">
        <Avatar profile={profile} size={44} />
        <div className="text-sm">
            <div className="text-primary/70">Added by</div>
            <div className="font-semibold">{profile.name}</div>
            <div className="text-xs text-primary/60">
                {memberSince && <>Member since {memberSince}</>}
                {memberSince && addedAt && " · "}
                {addedAt && <>Listed on {new Date(addedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</>}
            </div>
        </div>
    </Link>
}

export default AuthorCard;
