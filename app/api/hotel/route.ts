import { HOTEL_STATUS, isAdminId } from "@/lib/admin";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Moderation fields are never taken from the client.
    const { id, userId: _u, status, reviewedAt, addedAt, updatedAT, ...data } =
      body;

    const autoApproved = isAdminId(userId);

    const hotel = await prismadb.hotel.create({
      data: {
        ...data,
        userId,
        status: autoApproved ? HOTEL_STATUS.APPROVED : HOTEL_STATUS.PENDING,
        reviewedAt: autoApproved ? new Date() : null,
      },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    console.log("Error at /api/hotel POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
