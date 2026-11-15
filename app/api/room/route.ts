import { canManage } from "@/lib/admin";
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

    if (!body?.hotelId) {
      return new NextResponse("Hotel Id is required", { status: 400 });
    }

    const hotel = await prismadb.hotel.findUnique({
      where: { id: body.hotelId },
      select: { userId: true },
    });

    if (!hotel) {
      return new NextResponse("Hotel not found", { status: 404 });
    }

    if (!canManage(hotel.userId, userId)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { id, ...data } = body;

    const room = await prismadb.room.create({
      data,
    });

    return NextResponse.json(room);
  } catch (error) {
    console.log("Error at /api/room POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
