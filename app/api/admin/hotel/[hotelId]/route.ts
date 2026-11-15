import { HOTEL_STATUS, isAdminId } from "@/lib/admin";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const ALLOWED = Object.values(HOTEL_STATUS) as string[];

/** Super admin only: approve, reject or put back a hotel in the queue. */
export async function PATCH(
  req: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isAdminId(userId)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { status } = await req.json();

    if (!ALLOWED.includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    const hotel = await prismadb.hotel.update({
      where: { id: params.hotelId },
      data: {
        status,
        reviewedAt: status === HOTEL_STATUS.PENDING ? null : new Date(),
      },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    console.log("Error at /api/admin/hotel/hotelId PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
