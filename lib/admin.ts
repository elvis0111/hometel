import { auth } from "@clerk/nextjs";

export const HOTEL_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type HotelStatus = (typeof HOTEL_STATUS)[keyof typeof HOTEL_STATUS];

/**
 * Super admins are listed (comma-separated Clerk user ids) in the
 * server-only ADMIN_USER_IDS environment variable.
 */
export const isAdminId = (userId?: string | null) => {
  if (!userId) return false;
  return (process.env.ADMIN_USER_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .includes(userId);
};

export const isAdmin = () => isAdminId(auth().userId);

/** The owner of a resource or a super admin may manage it. */
export const canManage = (ownerId: string, userId?: string | null) =>
  !!userId && (ownerId === userId || isAdminId(userId));
