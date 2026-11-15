import { clerkClient } from "@clerk/nextjs";

/** Public, non-sensitive information about a user (never the email). */
export type PublicProfile = {
  id: string;
  name: string;
  imageUrl: string | null;
  memberSince: string | null;
};

const fallbackProfile = (id: string): PublicProfile => ({
  id,
  name: "HomeTel member",
  imageUrl: null,
  memberSince: null,
});

export const getPublicProfile = async (
  userId: string
): Promise<PublicProfile> => {
  try {
    const user = await clerkClient.users.getUser(userId);
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
    return {
      id: user.id,
      name: fullName || user.username || "HomeTel member",
      imageUrl: user.imageUrl || null,
      memberSince: user.createdAt
        ? new Date(user.createdAt).toISOString()
        : null,
    };
  } catch (error) {
    // Users from an older Clerk instance no longer exist: show a neutral profile.
    return fallbackProfile(userId);
  }
};

export const getPublicProfiles = async (userIds: string[]) => {
  const unique = Array.from(new Set(userIds));
  const profiles = await Promise.all(unique.map(getPublicProfile));
  return Object.fromEntries(profiles.map((p) => [p.id, p])) as Record<
    string,
    PublicProfile
  >;
};
