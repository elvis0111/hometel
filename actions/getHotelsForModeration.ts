import prismadb from "@/lib/prismadb";
import { HOTEL_STATUS } from "@/lib/admin";

/** All hotels grouped for the super admin dashboard (pending first). */
export const getHotelsForModeration = async () => {
  const hotels = await prismadb.hotel.findMany({
    include: { rooms: true },
    orderBy: { addedAt: "desc" },
  });

  return {
    pending: hotels.filter((h) => h.status === HOTEL_STATUS.PENDING),
    approved: hotels.filter((h) => h.status === HOTEL_STATUS.APPROVED),
    rejected: hotels.filter((h) => h.status === HOTEL_STATUS.REJECTED),
  };
};
